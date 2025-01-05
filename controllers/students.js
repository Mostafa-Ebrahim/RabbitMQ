const Publisher = require("../queue/publisher");
const DatabaseService = require("../services/database.service");

class StudentsController {
  async createStudent(req, res) {
    try {
      const studentData = req.body;
      await Publisher.publishMessage("student", "create", studentData);
      res.status(202).json({ 
        message: 'Student creation request accepted',
        data: studentData 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllStudents(req, res) {
    try {
      const students = await DatabaseService.findAllStudents();
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateStudent(req, res) {
    try {
      const studentData = req.body;
      const studentId = parseInt(req.params.id);
      await Publisher.publishMessage("student", "update", { ...studentData, id: studentId });
      res.status(202).json({ 
        message: 'Student update request accepted',
        data: { ...studentData, id: studentId } 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteStudent(req, res) {
    try {
      const studentId = parseInt(req.params.id);
      await Publisher.publishMessage("student", "delete", { id: studentId });
      res.status(202).json({ 
        message: 'Student deletion request accepted',
        id: studentId 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new StudentsController();
