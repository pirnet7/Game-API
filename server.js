const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const path = require("path");
app.use(express.json());
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

let books = {};
let lends = {};

const filePath = path.join(__dirname, "./data.json");
fs.readFile(filePath, "utf8", (err, data) => {
  const jsonData = JSON.parse(data); // jsonData = json value
  books = jsonData.books; // books value
  lends = jsonData.lends; // lends value
});

let i = lends.length + 1
let currentdate = new Date();
// 1.
app.get("/books", (req, res) => {
  res.send(books);
});

// 2.
app.get("/books/:isbn", (req, res) => {
  res.send(books.find((book) => book.isbn === req.params.isbn));
});

// 3.
app.post("/books", (req, res) => {
  books = [...books, req.body];
  res.send(req.body);
});

// 4.
app.put("/books/:isbn", (req, res) => {
  books = books.map((book) =>
    book.isbn === req.params.isbn ? req.body : book
  );
  res.send(req.body);
});

// 5. Delete (Delete immer mit params machen!)
app.delete("/books/:isbn", (req, res) => {
  const isbnToDelete = req.params.isbn;
  books = books.filter((book) => book.isbn !== isbnToDelete);
  res.send(req.body);
});

// 6. Patch
app.patch("/books/:isbn", (req, res) => {
  const bookToChangeIsbn = req.params.isbn;
  const changedBook = req.body;
  const book = books.find((book) => book.isbn === bookToChangeIsbn);

  if (book) {
    Object.assign(book, changedBook);
    res.send(book);
  } else {
    res.status(404).send({ message: "Book not found" });
  }
});

// 	Gibt alle Ausleihen als JSON zurück
app.get("/lends", (req, res) => {
  res.send(lends);
});

// Gibt alle Informationen zu einer Ausleihe als JSON zurück
app.get("/lends/:id", (req, res) => {
  res.send(lends.find((lend) => lend.id == req.params.id));
});

// Leiht ein neues Buch aus
app.post("/lends", (req, res) => {
  function fillBorrowedAt(reqBody) {
    reqBody.borrowed_at = new Date();
    return reqBody;
  }
  req.body = fillBorrowedAt(req.body);
  lends = [...lends, req.body];
  res.send(req.body);
});

// Bringt ein Buch zurück
app.delete('/lends/:id', (req, res) => {
  let i = lends.findIndex((lend) => lend.id == req.params.id)
  lends[i].returned_at = currentdate.getDay() + "." + currentdate.getMonth() + "." + currentdate.getFullYear()
  res.send(lends)
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});