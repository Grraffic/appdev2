/**
 * Book-specific seeder
 * 
 * This file contains book seeding functionality with more detailed book data
 * and genre-specific generation capabilities.
 */

const { faker } = require('@faker-js/faker');
const Book = require('../src/models/bookModels');

/**
 * Predefined book data with various genres
 */
const BOOK_COLLECTIONS = {
  classics: [
    { title: "To Kill a Mockingbird", author: "Harper Lee" },
    { title: "1984", author: "George Orwell" },
    { title: "Pride and Prejudice", author: "Jane Austen" },
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
    { title: "The Catcher in the Rye", author: "J.D. Salinger" },
    { title: "Lord of the Flies", author: "William Golding" },
    { title: "Animal Farm", author: "George Orwell" },
    { title: "Brave New World", author: "Aldous Huxley" },
    { title: "Of Mice and Men", author: "John Steinbeck" },
    { title: "The Grapes of Wrath", author: "John Steinbeck" }
  ],
  
  fantasy: [
    { title: "The Lord of the Rings", author: "J.R.R. Tolkien" },
    { title: "Harry Potter and the Philosopher's Stone", author: "J.K. Rowling" },
    { title: "The Hobbit", author: "J.R.R. Tolkien" },
    { title: "A Game of Thrones", author: "George R.R. Martin" },
    { title: "The Name of the Wind", author: "Patrick Rothfuss" },
    { title: "The Way of Kings", author: "Brandon Sanderson" },
    { title: "The Chronicles of Narnia", author: "C.S. Lewis" },
    { title: "Dune", author: "Frank Herbert" },
    { title: "The Dark Tower", author: "Stephen King" },
    { title: "The Wheel of Time", author: "Robert Jordan" }
  ],
  
  mystery: [
    { title: "The Murder of Roger Ackroyd", author: "Agatha Christie" },
    { title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson" },
    { title: "Gone Girl", author: "Gillian Flynn" },
    { title: "The Big Sleep", author: "Raymond Chandler" },
    { title: "In the Woods", author: "Tana French" },
    { title: "The Maltese Falcon", author: "Dashiell Hammett" },
    { title: "The Silence of the Lambs", author: "Thomas Harris" },
    { title: "The Hound of the Baskervilles", author: "Arthur Conan Doyle" },
    { title: "And Then There Were None", author: "Agatha Christie" },
    { title: "The Talented Mr. Ripley", author: "Patricia Highsmith" }
  ],
  
  scifi: [
    { title: "Foundation", author: "Isaac Asimov" },
    { title: "Neuromancer", author: "William Gibson" },
    { title: "The Hitchhiker's Guide to the Galaxy", author: "Douglas Adams" },
    { title: "Ender's Game", author: "Orson Scott Card" },
    { title: "The Martian", author: "Andy Weir" },
    { title: "Fahrenheit 451", author: "Ray Bradbury" },
    { title: "The Time Machine", author: "H.G. Wells" },
    { title: "I, Robot", author: "Isaac Asimov" },
    { title: "The War of the Worlds", author: "H.G. Wells" },
    { title: "Starship Troopers", author: "Robert A. Heinlein" }
  ],
  
  romance: [
    { title: "Jane Eyre", author: "Charlotte Brontë" },
    { title: "Wuthering Heights", author: "Emily Brontë" },
    { title: "Sense and Sensibility", author: "Jane Austen" },
    { title: "The Notebook", author: "Nicholas Sparks" },
    { title: "Outlander", author: "Diana Gabaldon" },
    { title: "Me Before You", author: "Jojo Moyes" },
    { title: "The Time Traveler's Wife", author: "Audrey Niffenegger" },
    { title: "The Fault in Our Stars", author: "John Green" },
    { title: "Eleanor Oliphant Is Completely Fine", author: "Gail Honeyman" },
    { title: "Call Me by Your Name", author: "André Aciman" }
  ]
};

/**
 * Generate books by genre
 */
const generateBooksByGenre = (genre, count) => {
  const books = [];
  const genreBooks = BOOK_COLLECTIONS[genre] || [];
  
  // Add predefined books from the genre
  const predefinedCount = Math.min(genreBooks.length, count);
  for (let i = 0; i < predefinedCount; i++) {
    books.push(genreBooks[i]);
  }
  
  // Generate additional books with Faker if needed
  const remainingCount = count - predefinedCount;
  for (let i = 0; i < remainingCount; i++) {
    books.push({
      title: faker.book.title(),
      author: faker.book.author()
    });
  }
  
  return books;
};

/**
 * Generate a balanced collection of books across genres
 */
const generateBalancedBookCollection = (totalCount) => {
  const books = [];
  const genres = Object.keys(BOOK_COLLECTIONS);
  const booksPerGenre = Math.floor(totalCount / genres.length);
  const remainder = totalCount % genres.length;
  
  // Add books from each genre
  genres.forEach((genre, index) => {
    const count = booksPerGenre + (index < remainder ? 1 : 0);
    const genreBooks = generateBooksByGenre(genre, count);
    books.push(...genreBooks);
  });
  
  // Shuffle the array to mix genres
  return shuffleArray(books);
};

/**
 * Utility function to shuffle an array
 */
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Generate completely random books using Faker
 */
const generateRandomBooks = (count) => {
  const books = [];
  for (let i = 0; i < count; i++) {
    books.push({
      title: faker.book.title(),
      author: faker.book.author()
    });
  }
  return books;
};

/**
 * Seed books with specific strategy
 */
const seedBooksWithStrategy = async (strategy = 'balanced', count = 50) => {
  try {
    console.log(`📚 Seeding ${count} books using '${strategy}' strategy...`);
    
    let booksData;
    
    switch (strategy) {
      case 'balanced':
        booksData = generateBalancedBookCollection(count);
        break;
      case 'random':
        booksData = generateRandomBooks(count);
        break;
      case 'classics':
        booksData = generateBooksByGenre('classics', count);
        break;
      case 'fantasy':
        booksData = generateBooksByGenre('fantasy', count);
        break;
      case 'mystery':
        booksData = generateBooksByGenre('mystery', count);
        break;
      case 'scifi':
        booksData = generateBooksByGenre('scifi', count);
        break;
      case 'romance':
        booksData = generateBooksByGenre('romance', count);
        break;
      default:
        booksData = generateBalancedBookCollection(count);
    }
    
    // Clear existing books
    await Book.deleteMany({});
    
    // Insert new books
    const books = await Book.insertMany(booksData);
    
    console.log(`   ✅ Successfully seeded ${books.length} books`);
    console.log(`   📖 Strategy: ${strategy}`);
    console.log(`   📚 Sample: "${books[0].title}" by ${books[0].author}`);
    
    return books;
    
  } catch (error) {
    console.error('❌ Error seeding books:', error.message);
    throw error;
  }
};

/**
 * Get available seeding strategies
 */
const getAvailableStrategies = () => {
  return [
    'balanced',   // Mix of all genres
    'random',     // Completely random using Faker
    'classics',   // Classic literature
    'fantasy',    // Fantasy books
    'mystery',    // Mystery/thriller books
    'scifi',      // Science fiction
    'romance'     // Romance novels
  ];
};

module.exports = {
  seedBooksWithStrategy,
  generateBooksByGenre,
  generateBalancedBookCollection,
  generateRandomBooks,
  getAvailableStrategies,
  BOOK_COLLECTIONS
};
