#!/usr/bin/env node

/**
 * Seeder CLI Tool
 * 
 * Interactive command-line interface for database seeding operations
 * 
 * Usage:
 *   node seeders/cli.js
 *   npm run seed:cli
 */

const readline = require('readline');
const mongoose = require('mongoose');
require('dotenv').config();

// Import seeders
const { runSeeder } = require('./seed');
const { seedBooksWithStrategy, getAvailableStrategies } = require('./bookSeeder');
const { seedUsersWithStrategy, getAvailableUserStrategies, createAdminUser } = require('./userSeeder');
const { connectToDatabase, disconnectFromDatabase, measureTime } = require('./seederUtils');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Utility function to prompt user input
 */
const prompt = (question) => {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
};

/**
 * Display main menu
 */
const showMainMenu = () => {
  console.log('\n🌱 Database Seeder CLI');
  console.log('========================');
  console.log('1. Run complete seeder (books + users)');
  console.log('2. Seed books only');
  console.log('3. Seed users only');
  console.log('4. Create admin user');
  console.log('5. Clear all data');
  console.log('6. Show database status');
  console.log('7. Help');
  console.log('0. Exit');
  console.log('');
};

/**
 * Display book seeding options
 */
const showBookMenu = () => {
  console.log('\n📚 Book Seeding Options');
  console.log('========================');
  const strategies = getAvailableStrategies();
  strategies.forEach((strategy, index) => {
    console.log(`${index + 1}. ${strategy}`);
  });
  console.log('0. Back to main menu');
  console.log('');
};

/**
 * Display user seeding options
 */
const showUserMenu = () => {
  console.log('\n👥 User Seeding Options');
  console.log('========================');
  const strategies = getAvailableUserStrategies();
  strategies.forEach((strategy, index) => {
    console.log(`${index + 1}. ${strategy}`);
  });
  console.log('0. Back to main menu');
  console.log('');
};

/**
 * Handle complete seeding
 */
const handleCompleteSeeding = async () => {
  try {
    console.log('\n🌱 Running complete database seeding...');
    
    const bookCount = await prompt('Enter number of books to seed (default: 50): ');
    const userCount = await prompt('Enter number of users to seed (default: 10): ');
    
    const books = parseInt(bookCount) || 50;
    const users = parseInt(userCount) || 10;
    
    console.log(`\nSeeding ${books} books and ${users} users...`);
    
    await measureTime(async () => {
      await runSeeder();
    }, 'Complete seeding');
    
  } catch (error) {
    console.error('❌ Complete seeding failed:', error.message);
  }
};

/**
 * Handle book seeding
 */
const handleBookSeeding = async () => {
  try {
    showBookMenu();
    const choice = await prompt('Select book seeding strategy: ');
    const strategies = getAvailableStrategies();
    
    if (choice === '0') return;
    
    const strategyIndex = parseInt(choice) - 1;
    if (strategyIndex < 0 || strategyIndex >= strategies.length) {
      console.log('❌ Invalid choice');
      return;
    }
    
    const strategy = strategies[strategyIndex];
    const countInput = await prompt(`Enter number of books to seed (default: 50): `);
    const count = parseInt(countInput) || 50;
    
    console.log(`\nSeeding ${count} books with '${strategy}' strategy...`);
    
    await connectToDatabase();
    await measureTime(async () => {
      await seedBooksWithStrategy(strategy, count);
    }, `Book seeding (${strategy})`);
    await disconnectFromDatabase();
    
  } catch (error) {
    console.error('❌ Book seeding failed:', error.message);
  }
};

/**
 * Handle user seeding
 */
const handleUserSeeding = async () => {
  try {
    showUserMenu();
    const choice = await prompt('Select user seeding strategy: ');
    const strategies = getAvailableUserStrategies();
    
    if (choice === '0') return;
    
    const strategyIndex = parseInt(choice) - 1;
    if (strategyIndex < 0 || strategyIndex >= strategies.length) {
      console.log('❌ Invalid choice');
      return;
    }
    
    const strategy = strategies[strategyIndex];
    const countInput = await prompt(`Enter number of users to seed (default: 10): `);
    const count = parseInt(countInput) || 10;
    
    console.log(`\nSeeding ${count} users with '${strategy}' strategy...`);
    
    await connectToDatabase();
    await measureTime(async () => {
      await seedUsersWithStrategy(strategy, count);
    }, `User seeding (${strategy})`);
    await disconnectFromDatabase();
    
  } catch (error) {
    console.error('❌ User seeding failed:', error.message);
  }
};

/**
 * Handle admin user creation
 */
const handleAdminCreation = async () => {
  try {
    console.log('\n👤 Creating admin user...');
    
    await connectToDatabase();
    await measureTime(async () => {
      await createAdminUser();
    }, 'Admin user creation');
    await disconnectFromDatabase();
    
  } catch (error) {
    console.error('❌ Admin user creation failed:', error.message);
  }
};

/**
 * Handle data clearing
 */
const handleDataClearing = async () => {
  try {
    const confirm = await prompt('⚠️  Are you sure you want to clear ALL data? (yes/no): ');
    
    if (confirm.toLowerCase() !== 'yes') {
      console.log('Operation cancelled');
      return;
    }
    
    console.log('\n🗑️  Clearing all data...');
    
    await connectToDatabase();
    
    const Book = require('../src/models/bookModels');
    const User = require('../src/models/user.model');
    
    await measureTime(async () => {
      await Book.deleteMany({});
      await User.deleteMany({});
    }, 'Data clearing');
    
    await disconnectFromDatabase();
    
  } catch (error) {
    console.error('❌ Data clearing failed:', error.message);
  }
};

/**
 * Show database status
 */
const showDatabaseStatus = async () => {
  try {
    console.log('\n📊 Database Status');
    console.log('==================');
    
    await connectToDatabase();
    
    const Book = require('../src/models/bookModels');
    const User = require('../src/models/user.model');
    
    const bookCount = await Book.countDocuments();
    const userCount = await User.countDocuments();
    
    console.log(`📚 Books: ${bookCount}`);
    console.log(`👥 Users: ${userCount}`);
    console.log(`🔌 Database: ${mongoose.connection.name}`);
    console.log(`📡 Connection: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    
    await disconnectFromDatabase();
    
  } catch (error) {
    console.error('❌ Failed to get database status:', error.message);
  }
};

/**
 * Show help information
 */
const showHelp = () => {
  console.log('\n📖 Seeder CLI Help');
  console.log('===================');
  console.log('This tool helps you seed your database with sample data.');
  console.log('');
  console.log('Available operations:');
  console.log('• Complete seeding: Seeds both books and users');
  console.log('• Book seeding: Seeds books with various strategies');
  console.log('• User seeding: Seeds users with different patterns');
  console.log('• Admin creation: Creates a single admin user');
  console.log('• Data clearing: Removes all data from database');
  console.log('• Status check: Shows current database state');
  console.log('');
  console.log('Book strategies: balanced, random, classics, fantasy, mystery, scifi, romance');
  console.log('User strategies: realistic, developers, students, librarians');
  console.log('');
};

/**
 * Main CLI loop
 */
const runCLI = async () => {
  console.log('🌱 Welcome to the Database Seeder CLI!');
  
  try {
    while (true) {
      showMainMenu();
      const choice = await prompt('Enter your choice: ');
      
      switch (choice) {
        case '1':
          await handleCompleteSeeding();
          break;
        case '2':
          await handleBookSeeding();
          break;
        case '3':
          await handleUserSeeding();
          break;
        case '4':
          await handleAdminCreation();
          break;
        case '5':
          await handleDataClearing();
          break;
        case '6':
          await showDatabaseStatus();
          break;
        case '7':
          showHelp();
          break;
        case '0':
          console.log('\n👋 Goodbye!');
          rl.close();
          process.exit(0);
          break;
        default:
          console.log('❌ Invalid choice. Please try again.');
      }
    }
  } catch (error) {
    console.error('❌ CLI error:', error.message);
    rl.close();
    process.exit(1);
  }
};

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n\n👋 Goodbye!');
  rl.close();
  process.exit(0);
});

// Run CLI if this file is executed directly
if (require.main === module) {
  runCLI();
}

module.exports = { runCLI };
