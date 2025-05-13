const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../../books.json");

// Helper to read books from JSON file
function getBooks() {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

// Helper to write updated book list to JSON file
function saveBooks(books) {
  fs.writeFileSync(filePath, JSON.stringify(books, null, 2));
}

module.exports = {
  getBooks,
  saveBooks,
};
