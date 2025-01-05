const express = require("express");
const routes = require("./routes/index");
const consumer = require("./queue/consumer");

const app = express();
app.use(express.json());

app.use("/api", routes);

async function startServer() {
  try {
    await consumer.start();
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
