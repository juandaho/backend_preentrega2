import express from "express";
import path from "path";
import { engine } from "express-handlebars";
import http from "http";
import { Server } from "socket.io";

import { __dirname } from "./utils.js";
import { productsRouter } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { viewsRouter } from "./routes/views.routes.js";
import { connectDB } from "./config/dbConnection.js";
import { cartsModel } from "./dao/models/carts.model.js";
import { productsModel } from "./dao/models/products.model.js";

const app = express();
const port = 8080;


const server = http.createServer(app);

const io = new Server(server);


io.on("connection", (socket) => {
  console.log("Un cliente se ha conectado");

});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));


server.listen(port, () => console.log(`Server listening on port ${port}`));

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "/views"));

connectDB();

app.use(viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

io.on("connection", (socket) => {
    console.log("Un cliente se ha conectado");

    
    socket.on("deleteProduct", async (id) => {
        try {
          
            await productsModel.findByIdAndDelete(id);

            console.log(`Producto con ID ${id} eliminado exitosamente`);
            
         
            io.emit("enviodeproducts", await productsModel.find());
        } catch (error) {
            console.error(`Error al eliminar el producto con ID ${id}: ${error}`);
        }
    });



});
