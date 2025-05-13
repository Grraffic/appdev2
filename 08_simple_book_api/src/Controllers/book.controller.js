const { getBooks, saveBooks } = require("../models/bookModels");

const getWelcome = (req, res) => {
  res.send("Simple Book API using Node.js and Express");
};

const getAllBooks = (req, res) => {
  const books = getBooks();
  res.json(books);
};

const getBookById = (req, res) => {
  const books = getBooks();
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
};

const addBook = (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ message: "Title and author are required" });
  }

  const books = getBooks();
  const newBook = {
    id: books.length ? books[books.length - 1].id + 1 : 1,
    title,
    author,
  };

  books.push(newBook);
  saveBooks(books);
  res.status(201).json(newBook);
};

const updateBook = (req, res) => {
  const books = getBooks();
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ message: "Book not found" });

  const { title, author } = req.body;
  if (title) book.title = title;
  if (author) book.author = author;

  saveBooks(books);
  res.json(book);
};

const deleteBook = (req, res) => {
  let books = getBooks();
  const index = books.findIndex((b) => b.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Book not found" });

  const deletedBook = books.splice(index, 1)[0];
  saveBooks(books);
  res.json({ message: "Book deleted successfully", book: deletedBook });
};

module.exports = {
  getWelcome,
  getAllBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
};
