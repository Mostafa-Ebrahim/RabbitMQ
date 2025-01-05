const amqp = require("amqplib");
const DatabaseService = require("../services/database.service");

class Consumer {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.isProcessing = false;
    this.queues = {
      books_queue: this.handleBookOperation.bind(this),
      students_queue: this.handleStudentOperation.bind(this),
    };
  }

  async start() {
    try {
      this.connection = await amqp.connect("amqp://localhost");
      this.channel = await this.connection.createChannel();

      await this.channel.prefetch(1);

      for (const [queue, handler] of Object.entries(this.queues)) {
        await this.channel.assertQueue(queue, { durable: true });
        this.channel.consume(queue, async (msg) => {
          if (this.isProcessing) {
            this.channel.nack(msg, false, true);
            return;
          }

          try {
            this.isProcessing = true;
            const message = JSON.parse(msg.content.toString());
            await handler(message);
            this.channel.ack(msg);
          } catch (error) {
            console.error(`Error processing message: ${error.message}`);
            this.channel.nack(msg, false, false);
          } finally {
            this.isProcessing = false;
          }
        });
      }

      console.log("Consumer started successfully");
    } catch (error) {
      console.error("Error starting consumer:", error);
      throw error;
    }
  }

  async handleBookOperation(message) {
    const { operation, data } = message;
    switch (operation) {
      case "create":
        await DatabaseService.createBook(data);
        break;
      case "update":
        await DatabaseService.updateBook(data.id, data);
        break;
      case "delete":
        await DatabaseService.deleteBook(data.id);
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  }

  async handleStudentOperation(message) {
    const { operation, data } = message;
    switch (operation) {
      case "create":
        await DatabaseService.createStudent(data);
        break;
      case "update":
        await DatabaseService.updateStudent(data.id, data);
        break;
      case "delete":
        await DatabaseService.deleteStudent(data.id);
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  }
}

module.exports = new Consumer();
