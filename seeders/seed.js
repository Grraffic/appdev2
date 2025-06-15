/**
 * Database Seeder for Book API
 * 
 * This script populates the database with sample data for development and testing.
 * It can seed books, users, and other entities with realistic data using Faker.js
 * 
 * Usage:
 *   node seeders/seed.js
 *   npm run seed
 *   npm run seed:fresh (drops existing data first)
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

// Configuration
const SEED_CONFIG = {
  books: {
    count: 50,
    clearExisting: true
  },
  users: {
    count: 10,
    clearExisting: true
  }
};

/**
 * Clear existing data from collections
 */
const clearDatabase = async () => {
  try {
    console.log('🗑️  Clearing existing data...');
    
    if (SEED_CONFIG.books.clearExisting) {
      await Book.deleteMany({});
      console.log('   ✅ Books collection cleared');
    }
    
    if (SEED_CONFIG.users.clearExisting) {
      await User.deleteMany({});
      console.log('   ✅ Users collection cleared');
    }
    
    console.log('');
  } catch (error) {
    console.error('❌ Error clearing database:', error.message);
    throw error;
  }
};

/**
 * Generate sample books data
 */
const generateBooksData = (count) => {
  const books = [];
  
  // Some predefined classic books for variety
  const classicBooks = [
    { title: "To Kill a Mockingbird", author: "Harper Lee" },
    { title: "1984", author: "George Orwell" },
    { title: "Pride and Prejudice", author: "Jane Austen" },
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
    { title: "The Catcher in the Rye", author: "J.D. Salinger" },
    { title: "Lord of the Flies", author: "William Golding" },
    { title: "Animal Farm", author: "George Orwell" },
    { title: "Brave New World", author: "Aldous Huxley" },
    { title: "The Lord of the Rings", author: "J.R.R. Tolkien" },
    { title: "Harry Potter and the Philosopher's Stone", author: "J.K. Rowling" }
  ];
  
  // Add classic books first
  const classicsToAdd = Math.min(classicBooks.length, Math.floor(count * 0.3));
  for (let i = 0; i < classicsToAdd; i++) {
    books.push(classicBooks[i]);
  }
  
  // Generate remaining books with Faker
  const remainingCount = count - classicsToAdd;
  for (let i = 0; i < remainingCount; i++) {
    books.push({
      title: faker.book.title(),
      author: faker.book.author()
    });
  }
  
  return books;
};

/**
 * Generate sample users data
 */
const generateUsersData = async (count) => {
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
  
  // Generate remaining users with Faker
  const remainingCount = count - 2;
  for (let i = 0; i < remainingCount; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const username = faker.internet.username({ firstName, lastName });
    const email = faker.internet.email({ firstName, lastName });
    const password = await bcrypt.hash('password123', 10);
    
    users.push({
      username,
      email,
      password
    });
  }
  
  return users;
};

/**
 * Seed books into database
 */
const seedBooks = async () => {
  try {
    console.log(`📚 Seeding ${SEED_CONFIG.books.count} books...`);
    
    const booksData = generateBooksData(SEED_CONFIG.books.count);
    const books = await Book.insertMany(booksData);
    
    console.log(`   ✅ Successfully seeded ${books.length} books`);
    console.log(`   📖 Sample books: "${books[0].title}" by ${books[0].author}`);
    if (books.length > 1) {
      console.log(`                   "${books[1].title}" by ${books[1].author}`);
    }
    console.log('');
    
    return books;
  } catch (error) {
    console.error('❌ Error seeding books:', error.message);
    throw error;
  }
};

/**
 * Seed users into database
 */
const seedUsers = async () => {
  try {
    console.log(`👥 Seeding ${SEED_CONFIG.users.count} users...`);
    
    const usersData = await generateUsersData(SEED_CONFIG.users.count);
    const users = await User.insertMany(usersData);
    
    console.log(`   ✅ Successfully seeded ${users.length} users`);
    console.log(`   👤 Admin user: admin@bookapi.com (password: admin123)`);
    console.log(`   👤 Test user:  test@bookapi.com (password: test123)`);
    console.log('');
    
    return users;
  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
    throw error;
  }
};

/**
 * Main seeding function
 */
const runSeeder = async () => {
  try {
    console.log('🌱 Starting database seeding process...\n');
    
    // Connect to database
    await connectDB();
    
    // Clear existing data
    await clearDatabase();
    
    // Seed data
    const books = await seedBooks();
    const users = await seedUsers();
    
    // Summary
    console.log('🎉 Database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   📚 Books seeded: ${books.length}`);
    console.log(`   👥 Users seeded: ${users.length}`);
    console.log('\n💡 You can now start the server and test the API with seeded data.');
    
  } catch (error) {
    console.error('\n💥 Seeding failed:', error.message);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed.');
    process.exit(0);
  }
};

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
📖 Database Seeder Help

Usage:
  node seeders/seed.js [options]
  npm run seed
  npm run seed:fresh

Options:
  --help, -h     Show this help message
  --books=N      Number of books to seed (default: ${SEED_CONFIG.books.count})
  --users=N      Number of users to seed (default: ${SEED_CONFIG.users.count})
  --no-clear     Don't clear existing data before seeding

Examples:
  node seeders/seed.js --books=100 --users=20
  node seeders/seed.js --no-clear
  `);
  process.exit(0);
}

// Parse command line arguments
args.forEach(arg => {
  if (arg.startsWith('--books=')) {
    SEED_CONFIG.books.count = parseInt(arg.split('=')[1]) || SEED_CONFIG.books.count;
  }
  if (arg.startsWith('--users=')) {
    SEED_CONFIG.users.count = parseInt(arg.split('=')[1]) || SEED_CONFIG.users.count;
  }
  if (arg === '--no-clear') {
    SEED_CONFIG.books.clearExisting = false;
    SEED_CONFIG.users.clearExisting = false;
  }
});

// Run the seeder
if (require.main === module) {
  runSeeder();
}

module.exports = {
  runSeeder,
  generateBooksData,
  generateUsersData,
  clearDatabase
};
