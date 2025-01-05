const express = require("express");
const router = express.Router();
const booksRouter = require("./books");
const studentsRouter = require("./students")

router.use("/books", booksRouter);
router.use("/students", studentsRouter)

// Health check route
router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

module.exports = router;
