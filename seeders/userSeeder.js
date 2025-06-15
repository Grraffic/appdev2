/**
 * User-specific seeder
 * 
 * This file contains user seeding functionality with realistic user profiles
 * and role-based user generation.
 */

const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
const User = require('../src/models/user.model');

/**
 * Predefined admin and test users
 */
const PREDEFINED_USERS = [
  {
    username: 'admin',
    email: 'admin@bookapi.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    username: 'testuser',
    email: 'test@bookapi.com',
    password: 'test123',
    role: 'user'
  },
  {
    username: 'librarian',
    email: 'librarian@bookapi.com',
    password: 'library123',
    role: 'librarian'
  },
  {
    username: 'demo',
    email: 'demo@bookapi.com',
    password: 'demo123',
    role: 'user'
  }
];

/**
 * Generate realistic user profiles
 */
const generateRealisticUsers = async (count) => {
  const users = [];
  
  // Add predefined users first
  for (const predefinedUser of PREDEFINED_USERS) {
    const hashedPassword = await bcrypt.hash(predefinedUser.password, 10);
    users.push({
      username: predefinedUser.username,
      email: predefinedUser.email,
      password: hashedPassword
    });
  }
  
  // Generate remaining users
  const remainingCount = Math.max(0, count - PREDEFINED_USERS.length);
  
  for (let i = 0; i < remainingCount; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    
    // Generate username variations
    const usernameVariations = [
      `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
      `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
      `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
      `${firstName.toLowerCase()}${faker.number.int({ min: 10, max: 99 })}`,
      faker.internet.username({ firstName, lastName })
    ];
    
    const username = faker.helpers.arrayElement(usernameVariations);
    
    // Generate email variations
    const emailDomains = [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
      'example.com', 'test.com', 'email.com', 'mail.com'
    ];
    
    const emailVariations = [
      `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${faker.helpers.arrayElement(emailDomains)}`,
      `${firstName.toLowerCase()}${lastName.toLowerCase()}@${faker.helpers.arrayElement(emailDomains)}`,
      `${username}@${faker.helpers.arrayElement(emailDomains)}`,
      faker.internet.email({ firstName, lastName })
    ];
    
    const email = faker.helpers.arrayElement(emailVariations);
    
    // Generate password (all fake users will have 'password123' for testing)
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
 * Generate users with specific patterns
 */
const generateUsersByPattern = async (pattern, count) => {
  const users = [];
  
  switch (pattern) {
    case 'developers':
      for (let i = 0; i < count; i++) {
        const devNames = [
          'john_dev', 'sarah_coder', 'mike_programmer', 'lisa_engineer',
          'alex_fullstack', 'emma_frontend', 'david_backend', 'anna_devops'
        ];
        const username = faker.helpers.arrayElement(devNames) + faker.number.int({ min: 1, max: 999 });
        const email = `${username}@devteam.com`;
        const password = await bcrypt.hash('dev123', 10);
        
        users.push({ username, email, password });
      }
      break;
      
    case 'students':
      for (let i = 0; i < count; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const studentId = faker.number.int({ min: 100000, max: 999999 });
        const username = `student_${studentId}`;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@university.edu`;
        const password = await bcrypt.hash('student123', 10);
        
        users.push({ username, email, password });
      }
      break;
      
    case 'librarians':
      for (let i = 0; i < count; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const username = `lib_${firstName.toLowerCase()}_${lastName.toLowerCase()}`;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@library.org`;
        const password = await bcrypt.hash('library123', 10);
        
        users.push({ username, email, password });
      }
      break;
      
    default:
      return await generateRealisticUsers(count);
  }
  
  return users;
};

/**
 * Seed users with specific strategy
 */
const seedUsersWithStrategy = async (strategy = 'realistic', count = 10) => {
  try {
    console.log(`👥 Seeding ${count} users using '${strategy}' strategy...`);
    
    let usersData;
    
    switch (strategy) {
      case 'realistic':
        usersData = await generateRealisticUsers(count);
        break;
      case 'developers':
        usersData = await generateUsersByPattern('developers', count);
        break;
      case 'students':
        usersData = await generateUsersByPattern('students', count);
        break;
      case 'librarians':
        usersData = await generateUsersByPattern('librarians', count);
        break;
      default:
        usersData = await generateRealisticUsers(count);
    }
    
    // Clear existing users
    await User.deleteMany({});
    
    // Insert new users
    const users = await User.insertMany(usersData);
    
    console.log(`   ✅ Successfully seeded ${users.length} users`);
    console.log(`   📊 Strategy: ${strategy}`);
    
    // Show predefined users for easy testing
    const predefinedUsernames = PREDEFINED_USERS.map(u => u.username);
    const seededPredefined = users.filter(u => predefinedUsernames.includes(u.username));
    
    if (seededPredefined.length > 0) {
      console.log('   🔑 Test accounts:');
      PREDEFINED_USERS.forEach(user => {
        console.log(`      ${user.username}: ${user.email} (password: ${user.password})`);
      });
    }
    
    return users;
    
  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
    throw error;
  }
};

/**
 * Create a single admin user
 */
const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('👤 Admin user already exists');
      return existingAdmin;
    }
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = new User({
      username: 'admin',
      email: 'admin@bookapi.com',
      password: hashedPassword
    });
    
    await adminUser.save();
    console.log('👤 Admin user created: admin@bookapi.com (password: admin123)');
    return adminUser;
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    throw error;
  }
};

/**
 * Get available user seeding strategies
 */
const getAvailableUserStrategies = () => {
  return [
    'realistic',   // Mix of realistic user profiles
    'developers',  // Developer-themed usernames
    'students',    // Student-themed usernames
    'librarians'   // Librarian-themed usernames
  ];
};

/**
 * Get predefined test users info
 */
const getPredefinedUsers = () => {
  return PREDEFINED_USERS.map(user => ({
    username: user.username,
    email: user.email,
    password: user.password,
    role: user.role
  }));
};

module.exports = {
  seedUsersWithStrategy,
  generateRealisticUsers,
  generateUsersByPattern,
  createAdminUser,
  getAvailableUserStrategies,
  getPredefinedUsers,
  PREDEFINED_USERS
};
