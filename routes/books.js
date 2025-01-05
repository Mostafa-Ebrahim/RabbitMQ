const express = require('express');
const router = express.Router();
const BooksController = require('../controllers/books');

router.post('/', BooksController.createBook);
router.get('/', BooksController.getAllBooks);
router.put('/:id', BooksController.updateBook);
router.delete('/:id', BooksController.deleteBook);

module.exports = router;
