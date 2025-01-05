const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class DatabaseService {
  // Books operations
  async createBook(bookData) {
    return prisma.book.create({
      data: bookData
    });
  }

  async findAllBooks() {
    return prisma.book.findMany();
  }

  async updateBook(id, bookData) {
    return prisma.book.update({
      where: { id: parseInt(id) },
      data: bookData
    });
  }

  async deleteBook(id) {
    return prisma.book.delete({
      where: { id: parseInt(id) }
    });
  }

  // Students operations
  async createStudent(studentData) {
    return prisma.student.create({
      data: studentData
    });
  }

  async findAllStudents() {
    return prisma.student.findMany();
  }

  async updateStudent(id, studentData) {
    return prisma.student.update({
      where: { id: parseInt(id) },
      data: studentData
    });
  }

  async deleteStudent(id) {
    return prisma.student.delete({
      where: { id: parseInt(id) }
    });
  }
}

module.exports = new DatabaseService();
