/**
 * Seeder Utilities
 * 
 * Common utilities and helper functions for database seeding operations
 */

const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');

/**
 * Database connection utilities
 */
const connectToDatabase = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('🔌 Connected to MongoDB');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
};

const disconnectFromDatabase = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('🔌 Disconnected from MongoDB');
    }
  } catch (error) {
    console.error('❌ Database disconnection failed:', error.message);
    throw error;
  }
};

/**
 * Collection management utilities
 */
const clearCollection = async (Model, collectionName) => {
  try {
    const result = await Model.deleteMany({});
    console.log(`   🗑️  Cleared ${result.deletedCount} documents from ${collectionName}`);
    return result.deletedCount;
  } catch (error) {
    console.error(`❌ Error clearing ${collectionName}:`, error.message);
    throw error;
  }
};

const getCollectionCount = async (Model, collectionName) => {
  try {
    const count = await Model.countDocuments();
    return count;
  } catch (error) {
    console.error(`❌ Error counting ${collectionName}:`, error.message);
    return 0;
  }
};

/**
 * Seeding progress utilities
 */
const createProgressBar = (total) => {
  let current = 0;
  
  return {
    update: (increment = 1) => {
      current += increment;
      const percentage = Math.round((current / total) * 100);
      const filled = Math.round((current / total) * 20);
      const empty = 20 - filled;
      
      const bar = '█'.repeat(filled) + '░'.repeat(empty);
      process.stdout.write(`\r   Progress: [${bar}] ${percentage}% (${current}/${total})`);
      
      if (current >= total) {
        console.log(''); // New line when complete
      }
    },
    
    complete: () => {
      current = total;
      const bar = '█'.repeat(20);
      console.log(`\r   Progress: [${bar}] 100% (${total}/${total})`);
    }
  };
};

/**
 * Batch processing utilities
 */
const processBatches = async (items, batchSize, processor) => {
  const results = [];
  const total = items.length;
  const progress = createProgressBar(total);
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await processor(batch);
    results.push(...batchResults);
    progress.update(batch.length);
  }
  
  return results;
};

/**
 * Data validation utilities
 */
const validateSeedData = (data, requiredFields) => {
  const errors = [];
  
  data.forEach((item, index) => {
    requiredFields.forEach(field => {
      if (!item[field]) {
        errors.push(`Item ${index}: Missing required field '${field}'`);
      }
    });
  });
  
  return errors;
};

const removeDuplicates = (array, keyField) => {
  const seen = new Set();
  return array.filter(item => {
    const key = item[keyField];
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

/**
 * Faker utilities for consistent data generation
 */
const generateUniqueValues = (generator, count, maxAttempts = 1000) => {
  const values = new Set();
  let attempts = 0;
  
  while (values.size < count && attempts < maxAttempts) {
    values.add(generator());
    attempts++;
  }
  
  if (values.size < count) {
    console.warn(`⚠️  Could only generate ${values.size} unique values out of ${count} requested`);
  }
  
  return Array.from(values);
};

const seedFaker = (locale = 'en') => {
  faker.locale = locale;
  faker.seed(Date.now()); // Use current timestamp as seed for reproducible randomness
};

/**
 * Error handling utilities
 */
const handleSeederError = (error, context) => {
  console.error(`\n❌ Error in ${context}:`);
  console.error(`   Message: ${error.message}`);
  
  if (error.code === 11000) {
    console.error('   Cause: Duplicate key error - some data already exists');
    console.error('   Solution: Clear existing data or use different values');
  } else if (error.name === 'ValidationError') {
    console.error('   Cause: Data validation failed');
    console.error('   Details:', error.errors);
  } else if (error.name === 'MongoNetworkError') {
    console.error('   Cause: Database connection issue');
    console.error('   Solution: Check MongoDB connection and credentials');
  }
  
  throw error;
};

/**
 * Logging utilities
 */
const logSeederStart = (seederName, config) => {
  console.log(`\n🌱 Starting ${seederName}...`);
  console.log('📋 Configuration:');
  Object.entries(config).forEach(([key, value]) => {
    console.log(`   ${key}: ${value}`);
  });
  console.log('');
};

const logSeederComplete = (seederName, results) => {
  console.log(`\n✅ ${seederName} completed successfully!`);
  console.log('📊 Results:');
  Object.entries(results).forEach(([key, value]) => {
    console.log(`   ${key}: ${value}`);
  });
};

/**
 * Environment utilities
 */
const checkEnvironment = () => {
  const requiredEnvVars = ['MONGODB_URI'];
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(varName => {
      console.error(`   ${varName}`);
    });
    throw new Error('Environment configuration incomplete');
  }
  
  console.log('✅ Environment configuration validated');
};

/**
 * Time utilities
 */
const measureTime = async (operation, label) => {
  const startTime = Date.now();
  console.log(`⏱️  Starting ${label}...`);
  
  try {
    const result = await operation();
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`✅ ${label} completed in ${duration}ms`);
    return result;
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.error(`❌ ${label} failed after ${duration}ms`);
    throw error;
  }
};

module.exports = {
  // Database utilities
  connectToDatabase,
  disconnectFromDatabase,
  
  // Collection utilities
  clearCollection,
  getCollectionCount,
  
  // Progress utilities
  createProgressBar,
  processBatches,
  
  // Data utilities
  validateSeedData,
  removeDuplicates,
  generateUniqueValues,
  seedFaker,
  
  // Error handling
  handleSeederError,
  
  // Logging utilities
  logSeederStart,
  logSeederComplete,
  
  // Environment utilities
  checkEnvironment,
  
  // Time utilities
  measureTime
};
