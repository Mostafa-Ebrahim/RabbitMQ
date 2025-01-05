const express = require('express');
const router = express.Router();
const StudentsController = require('../controllers/students');

router.post('/', StudentsController.createStudent);
router.get('/', StudentsController.getAllStudents);
router.put('/:id', StudentsController.updateStudent);
router.delete('/:id', StudentsController.deleteStudent);

module.exports = router;
