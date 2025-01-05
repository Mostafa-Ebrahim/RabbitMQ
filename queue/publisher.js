const amqp = require("amqplib");

class Publisher {
  constructor() {
    this.queueConfig = {
      book: {
        queue: "books_queue",
        operations: {
          create: "created",
          update: "updated",
          delete: "deleted",
        },
      },
      student: {
        queue: "students_queue",
        operations: {
          create: "created",
          update: "updated",
          delete: "deleted",
        },
      },
    };
  }

  async publishMessage(entity, operation, data) {
    try {
      const connection = await amqp.connect("amqp://localhost");
      const channel = await connection.createChannel();

      const config = this.queueConfig[entity];
      if (!config) {
        throw new Error(`Invalid entity: ${entity}`);
      }

      const routingKey = `${entity}.${config.operations[operation]}`;
      const queueName = config.queue;

      await channel.assertQueue(queueName, { durable: true });

      const message = {
        routingKey,
        operation,
        data,
        timestamp: new Date(),
        metadata: {
          entityType: entity,
          actionType: operation,
        },
      };

      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
        persistent: true,
      });

      console.log(`Published ${routingKey}:`, data);

      setTimeout(() => connection.close(), 500);
    } catch (error) {
      console.error("Error publishing message:", error);
      throw error;
    }
  }
}

module.exports = new Publisher();
