const nodemailer = require("nodemailer");
const pug = require("pug");
const path = require("path");
require("dotenv").config();

/**
 * Email middleware for sending notifications when a book is created
 * This function accepts book details and sends an email notification using Nodemailer
 */

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Compile Pug template to HTML
 * @param {Object} bookDetails - The book object containing title, author, and id
 * @returns {string} - Compiled HTML string
 */
const compileEmailTemplate = (bookDetails) => {
  try {
    // Path to the Pug template file
    const templatePath = path.join(__dirname, "../../views/bookCreated.pug");

    // Prepare template data
    const templateData = {
      bookTitle: bookDetails.title,
      bookAuthor: bookDetails.author,
      bookId: bookDetails._id || bookDetails.id,
      createdDate: new Date().toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      }),
      currentTime: new Date().toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
      }),
    };

    // Compile the Pug template with data
    const compiledHtml = pug.renderFile(templatePath, templateData);

    return compiledHtml;
  } catch (error) {
    console.error("❌ Error compiling Pug template:", error.message);
    throw new Error(`Failed to compile email template: ${error.message}`);
  }
};

/**
 * Send email notification for new book creation
 * @param {Object} bookDetails - The book object containing title, author, and id
 * @param {string} bookDetails.title - The title of the book
 * @param {string} bookDetails.author - The author of the book
 * @param {string|number} bookDetails._id - The unique identifier of the book
 * @returns {Promise<Object>} - Promise that resolves with email info or rejects with error
 */
const sendBookCreationEmail = async (bookDetails) => {
  try {
    // Validate required book details
    if (!bookDetails || !bookDetails.title || !bookDetails.author) {
      throw new Error(
        "Book details are incomplete. Title and author are required."
      );
    }

    // Validate email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error(
        "Email configuration is missing. Please check EMAIL_USER and EMAIL_PASS environment variables."
      );
    }

    const transporter = createTransporter();

    // Compile Pug template to HTML
    const htmlContent = compileEmailTemplate(bookDetails);

    // Define email options
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: "📚 New Book Added to Library",
      html: htmlContent,
      text: `
        New Book Added to Library

        Book Details:
        Title: ${bookDetails.title}
        Author: ${bookDetails.author}
        Book ID: ${bookDetails._id || bookDetails.id}
        Added on: ${new Date().toLocaleString()}

        This is an automated notification from your Book Management System.
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log("📧 Book creation email sent successfully:", info.messageId);
    return {
      success: true,
      messageId: info.messageId,
      message: "Email notification sent successfully",
    };
  } catch (error) {
    console.error("❌ Error sending book creation email:", error.message);

    // Return error info instead of throwing to prevent breaking the main flow
    return {
      success: false,
      error: error.message,
      message: "Failed to send email notification",
    };
  }
};

/**
 * Express middleware wrapper for sending book creation emails
 * This can be used as middleware in Express routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const sendBookEmailMiddleware = async (req, res, next) => {
  try {
    // Check if there's book data in res.locals (set by previous middleware/controller)
    const bookData = res.locals.newBook || req.body;

    if (bookData && bookData.title && bookData.author) {
      // Send email asynchronously without blocking the response
      sendBookCreationEmail(bookData)
        .then((result) => {
          if (result.success) {
            console.log("✅ Email notification sent for book:", bookData.title);
          } else {
            console.log(
              "⚠️ Email notification failed for book:",
              bookData.title,
              "- Error:",
              result.error
            );
          }
        })
        .catch((error) => {
          console.error("❌ Unexpected error in email middleware:", error);
        });
    }

    next();
  } catch (error) {
    console.error("❌ Error in email middleware:", error);
    // Don't block the main flow, just log the error and continue
    next();
  }
};

module.exports = {
  sendBookCreationEmail,
  sendBookEmailMiddleware,
};
