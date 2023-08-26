import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";

import viewRouter from "./routes/view.router.js";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";

import ProductManager from "./dao/mongomanagers/productManagerMongo.js";
import MessagesManager from "./dao/mongomanagers/messageManagerMongo.js";

import { __dirname } from "./utils.js";
import "./dao/dbConfig.js";

const app = express();
const PORT = process.env.PORT || 8080;

const productManager = new ProductManager();
const messagesManager = new MessagesManager();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine());
app.set('view engine', 'handlebars');
app.set("views", __dirname + "/views");

app.use("/products", productRouter);
app.use("/api", cartRouter);
app.use("/", viewRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = new Server(httpServer);

io.on("connection", async (socket) => {
  console.log("Client connected with ID:", socket.id);

  const products = await productManager.getProducts();
  io.emit("enviodeproducts", products);

  socket.on("addProduct", async (product) => {
    await productManager.addProduct(product);
    const updatedProducts = await productManager.getProducts();
    io.emit("enviodeproducts", updatedProducts);
  });

  socket.on("deleteProduct", async (id) => {
    await productManager.deleteProduct(id);
    const updatedProducts = await productManager.getProducts();
    io.emit("enviodeproducts", updatedProducts);
  });

  socket.on("nuevousuario", (username) => {
    console.log(`User: ${username}`);
    socket.broadcast.emit("broadcast", username);
  });

  socket.on("disconnect", () => {
    console.log(`User with ID : ${socket.id} has disconnected`);
  });

  socket.on("mensaje", async (message) => {
    await messagesManager.createMessage(message);
    const messages = await messagesManager.getMessages();
    io.emit("chat", messages);
  });
});
