const Publisher = require("../queue/publisher");
const DatabaseService = require("../services/database.service");

class BooksController {
  async createBook(req, res) {
    try {
      const bookData = req.body;
      await Publisher.publishMessage("book", "create", bookData);
      res.status(202).json({ 
        message: 'Book creation request accepted',
        data: bookData 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllBooks(req, res) {
    try {
      const books = await DatabaseService.findAllBooks();
      res.json(books);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateBook(req, res) {
    try {
      const bookData = req.body;
      const bookId = parseInt(req.params.id);
      await Publisher.publishMessage("book", "update", { ...bookData, id: bookId });
      res.status(202).json({ 
        message: 'Book update request accepted',
        data: { ...bookData, id: bookId } 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteBook(req, res) {
    try {
      const bookId = parseInt(req.params.id);
      await Publisher.publishMessage("book", "delete", { id: bookId });
      res.status(202).json({ 
        message: 'Book deletion request accepted',
        id: bookId 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new BooksController();
