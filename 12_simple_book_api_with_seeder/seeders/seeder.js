/**
 * Database Seeder Script
 * 
 * This script:
 * - Connects to MongoDB database
 * - Clears existing collections (users and books)
 * - Populates the database with:
 *   - At least 5 fake users (with hashed passwords using bcrypt)
 *   - At least 10 fake books, each associated to a user by userId
 * 
 * Usage: npm run seed
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
require('dotenv').config();

// Import models
const Book = require('../src/models/bookModels');
const User = require('../src/models/user.model');

// Import database connection
const connectDB = require('../src/config/db');

/**
 * Connect to MongoDB database
 */
const connectToDatabase = async () => {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB database');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

/**
 * Clear existing collections
 */
const clearCollections = async () => {
  try {
    console.log('🗑️  Clearing existing collections...');
    
    // Clear books collection
    const booksDeleted = await Book.deleteMany({});
    console.log(`   📚 Cleared ${booksDeleted.deletedCount} books`);
    
    // Clear users collection
    const usersDeleted = await User.deleteMany({});
    console.log(`   👥 Cleared ${usersDeleted.deletedCount} users`);
    
    console.log('✅ Collections cleared successfully\n');
  } catch (error) {
    console.error('❌ Error clearing collections:', error.message);
    throw error;
  }
};

/**
 * Create fake users with hashed passwords
 */
const createFakeUsers = async (count = 5) => {
  try {
    console.log(`👥 Creating ${count} fake users...`);
    
    const users = [];
    
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    users.push({
      username: 'admin',
      email: 'admin@bookapi.com',
      password: adminPassword
    });
    
    // Create test user
    const testPassword = await bcrypt.hash('test123', 10);
    users.push({
      username: 'testuser',
      email: 'test@bookapi.com',
      password: testPassword
    });
    
    // Create remaining fake users
    const remainingCount = count - 2;
    for (let i = 0; i < remainingCount; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const username = faker.internet.username({ firstName, lastName });
      const email = faker.internet.email({ firstName, lastName });
      
      // Hash password using bcrypt
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      users.push({
        username,
        email,
        password: hashedPassword
      });
    }
    
    // Insert users into database
    const createdUsers = await User.insertMany(users);
    
    console.log(`✅ Successfully created ${createdUsers.length} users`);
    console.log('👤 Sample users:');
    createdUsers.slice(0, 3).forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.username} (${user.email})`);
    });
    console.log('');
    
    return createdUsers;
  } catch (error) {
    console.error('❌ Error creating users:', error.message);
    throw error;
  }
};

/**
 * Create fake books associated with users
 */
const createFakeBooks = async (users, count = 10) => {
  try {
    console.log(`📚 Creating ${count} fake books associated with users...`);
    
    const books = [];
    
    // Predefined book titles and authors for variety
    const bookTemplates = [
      { title: "The Midnight Library", author: "Matt Haig" },
      { title: "Where the Crawdads Sing", author: "Delia Owens" },
      { title: "The Seven Husbands of Evelyn Hugo", author: "Taylor Jenkins Reid" },
      { title: "Atomic Habits", author: "James Clear" },
      { title: "The Silent Patient", author: "Alex Michaelides" },
      { title: "Educated", author: "Tara Westover" },
      { title: "The Invisible Life of Addie LaRue", author: "V.E. Schwab" },
      { title: "Klara and the Sun", author: "Kazuo Ishiguro" },
      { title: "Project Hail Mary", author: "Andy Weir" },
      { title: "The Guest List", author: "Lucy Foley" }
    ];
    
    for (let i = 0; i < count; i++) {
      // Use predefined books first, then generate with Faker
      let title, author;
      
      if (i < bookTemplates.length) {
        title = bookTemplates[i].title;
        author = bookTemplates[i].author;
      } else {
        title = faker.book.title();
        author = faker.book.author();
      }
      
      // Randomly assign book to a user
      const randomUser = faker.helpers.arrayElement(users);
      
      books.push({
        title,
        author,
        userId: randomUser._id
      });
    }
    
    // Insert books into database
    const createdBooks = await Book.insertMany(books);
    
    console.log(`✅ Successfully created ${createdBooks.length} books`);
    console.log('📖 Sample books with user associations:');
    
    // Show sample books with their associated users
    for (let i = 0; i < Math.min(3, createdBooks.length); i++) {
      const book = createdBooks[i];
      const user = users.find(u => u._id.toString() === book.userId.toString());
      console.log(`   ${i + 1}. "${book.title}" by ${book.author} (owned by: ${user.username})`);
    }
    console.log('');
    
    return createdBooks;
  } catch (error) {
    console.error('❌ Error creating books:', error.message);
    throw error;
  }
};

/**
 * Display seeding summary
 */
const displaySummary = async (users, books) => {
  try {
    console.log('📊 Seeding Summary:');
    console.log('===================');
    console.log(`👥 Total Users: ${users.length}`);
    console.log(`📚 Total Books: ${books.length}`);
    console.log('');
    
    // Show user-book distribution
    console.log('📋 User-Book Distribution:');
    for (const user of users) {
      const userBooks = books.filter(book => book.userId.toString() === user._id.toString());
      console.log(`   ${user.username}: ${userBooks.length} book(s)`);
    }
    console.log('');
    
    // Show test account credentials
    console.log('🔑 Test Account Credentials:');
    console.log('   admin@bookapi.com (password: admin123)');
    console.log('   test@bookapi.com (password: test123)');
    console.log('   Other users (password: password123)');
    console.log('');
    
  } catch (error) {
    console.error('❌ Error displaying summary:', error.message);
  }
};

/**
 * Main seeding function
 */
const runSeeder = async () => {
  const startTime = Date.now();
  
  try {
    console.log('🌱 Starting database seeding process...\n');
    
    // Step 1: Connect to database
    await connectToDatabase();
    
    // Step 2: Clear existing collections
    await clearCollections();
    
    // Step 3: Create fake users (minimum 5)
    const users = await createFakeUsers(5);
    
    // Step 4: Create fake books associated with users (minimum 10)
    const books = await createFakeBooks(users, 10);
    
    // Step 5: Display summary
    await displaySummary(users, books);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log('🎉 Database seeding completed successfully!');
    console.log(`⏱️  Total time: ${duration}ms`);
    console.log('\n💡 You can now start the server and test the API with seeded data.');
    
  } catch (error) {
    console.error('\n💥 Seeding failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  } finally {
    // Close database connection
    try {
      await mongoose.connection.close();
      console.log('🔌 Database connection closed.');
    } catch (error) {
      console.error('❌ Error closing database connection:', error.message);
    }
    process.exit(0);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Promise Rejection:', err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err.message);
  process.exit(1);
});

// Run the seeder if this file is executed directly
if (require.main === module) {
  runSeeder();
}

module.exports = { runSeeder };
