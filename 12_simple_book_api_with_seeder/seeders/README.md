# Database Seeder

A comprehensive database seeding system for the Book API project. This seeder provides multiple strategies for populating your database with realistic sample data for development and testing.

## 🚀 Quick Start

```bash
# Run complete seeding (books + users)
npm run seed

# Test seeder data generation (no database required)
npm run seed:test

# Interactive CLI
npm run seed:cli

# Show help
npm run seed:help
```

## 📁 File Structure

```
seeders/
├── seed.js           # Main seeder script
├── bookSeeder.js     # Book-specific seeding
├── userSeeder.js     # User-specific seeding
├── seederUtils.js    # Utility functions
├── cli.js            # Interactive CLI tool
└── README.md         # This file
```

## 📚 Book Seeding

### Available Strategies

- **balanced** - Mix of all genres (default)
- **random** - Completely random using Faker.js
- **classics** - Classic literature
- **fantasy** - Fantasy books
- **mystery** - Mystery/thriller books
- **scifi** - Science fiction
- **romance** - Romance novels

### Usage Examples

```bash
# Seed 50 balanced books
npm run seed:books

# Seed 30 fantasy books
npm run seed:books:fantasy

# Seed 20 classic books
npm run seed:books:classics

# Custom seeding
node seeders/seed.js --books=100
```

### Book Collections

Each strategy includes curated collections:

- **Classics**: To Kill a Mockingbird, 1984, Pride and Prejudice, etc.
- **Fantasy**: Lord of the Rings, Harry Potter, Game of Thrones, etc.
- **Mystery**: Agatha Christie, Gillian Flynn, Raymond Chandler, etc.
- **Sci-Fi**: Foundation, Neuromancer, Hitchhiker's Guide, etc.
- **Romance**: Jane Eyre, The Notebook, Outlander, etc.

## 👥 User Seeding

### Available Strategies

- **realistic** - Mix of realistic user profiles (default)
- **developers** - Developer-themed usernames
- **students** - Student-themed usernames
- **librarians** - Librarian-themed usernames

### Predefined Test Users

The seeder always creates these test accounts:

| Username | Email | Password | Role |
|----------|-------|----------|------|
| admin | admin@bookapi.com | admin123 | admin |
| testuser | test@bookapi.com | test123 | user |
| librarian | librarian@bookapi.com | library123 | librarian |
| demo | demo@bookapi.com | demo123 | user |

### Usage Examples

```bash
# Seed 10 realistic users
npm run seed:users

# Custom user seeding
node seeders/seed.js --users=20
```

## 🛠️ Advanced Usage

### Command Line Options

```bash
# Main seeder options
node seeders/seed.js [options]

Options:
  --help, -h     Show help message
  --books=N      Number of books to seed (default: 50)
  --users=N      Number of users to seed (default: 10)
  --no-clear     Don't clear existing data before seeding

Examples:
  node seeders/seed.js --books=100 --users=20
  node seeders/seed.js --no-clear
```

### Programmatic Usage

```javascript
// Import specific seeders
const { seedBooksWithStrategy } = require('./seeders/bookSeeder');
const { seedUsersWithStrategy } = require('./seeders/userSeeder');

// Seed books
await seedBooksWithStrategy('fantasy', 50);

// Seed users
await seedUsersWithStrategy('realistic', 20);
```

## 🎮 Interactive CLI

The CLI provides an interactive interface for seeding operations:

```bash
npm run seed:cli
```

Features:
- Complete seeding with custom counts
- Strategy-specific seeding
- Database status checking
- Data clearing with confirmation
- Admin user creation

## 🧪 Testing

Test the seeder data generation without database connection:

```bash
npm run seed:test
```

This will:
- Generate sample books and users
- Test all strategies
- Show predefined users
- Verify data structure

## 📊 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run seed` | Complete seeding (books + users) |
| `npm run seed:fresh` | Seed without clearing existing data |
| `npm run seed:books` | Seed books only (balanced strategy) |
| `npm run seed:users` | Seed users only (realistic strategy) |
| `npm run seed:books:fantasy` | Seed 30 fantasy books |
| `npm run seed:books:classics` | Seed 20 classic books |
| `npm run seed:cli` | Interactive CLI |
| `npm run seed:test` | Test data generation |
| `npm run seed:help` | Show help |

## 🔧 Configuration

### Environment Variables

Make sure your `.env` file contains:

```env
MONGODB_URI=your_mongodb_connection_string
```

### Customization

You can modify the seeding behavior by editing:

- `SEED_CONFIG` in `seed.js` for default counts
- `BOOK_COLLECTIONS` in `bookSeeder.js` for book data
- `PREDEFINED_USERS` in `userSeeder.js` for test users

## 🚨 Important Notes

1. **Data Clearing**: By default, the seeder clears existing data. Use `--no-clear` to preserve existing data.

2. **Unique Constraints**: The seeder handles duplicate usernames/emails gracefully.

3. **Password Security**: All generated users have the password `password123` for testing purposes.

4. **Database Connection**: Ensure MongoDB is running and accessible before seeding.

## 🐛 Troubleshooting

### Common Issues

**Connection Error**
```
Error: Database connection failed
```
- Check MongoDB is running
- Verify MONGODB_URI in .env file
- Ensure network connectivity

**Duplicate Key Error**
```
Error: E11000 duplicate key error
```
- Use `--no-clear` flag to preserve existing data
- Or clear the database manually first

**Validation Error**
```
Error: User validation failed
```
- Check user model requirements
- Verify email format validation

### Getting Help

1. Run `npm run seed:help` for command options
2. Run `npm run seed:test` to test without database
3. Check the console output for detailed error messages
4. Use the interactive CLI for guided seeding

## 📝 License

This seeder is part of the Book API project and follows the same license terms.
