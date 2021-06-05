const app = require("express")();

const { authors, books } = require("./data");

const PORT = 8001;

app.get("/", (req, res) => {
    res.send({ message: "Hi this is the rest api" });
});

app.get("/books", (req, res) => {
    res.send(books);
});

app.get("/authors", (req, res) => {
    res.send(authors);
});

app.get("/author/:authorId/books", (req, res) => {
    const authorId = req.params.authorId;

    const b = books.filter((book) => book.authorId == authorId);

    res.send(b);
});

app.get("/book/:bookId/author", (req, res) => {
    const bookId = req.params.bookId;

    const book = books.find((book) => book.id == bookId);

    const author = authors.find((a) => a.id == book.authorId);

    res.send(author);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
