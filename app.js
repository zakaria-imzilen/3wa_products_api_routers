const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const productsRouter = require("./routers/products");

app.use(bodyParser.json()); // Middlewares

app.use("/products", productsRouter);

app.listen(4000, () => {
	console.log("I am listening to Tarik in the port 4000");
});
