import mongoose from "mongoose";

const URI = "mongodb+srv://juandaho:conexion12abc@cluster0.buwlub1.mongodb.net/mydatabase?retryWrites=true&w=majority";

try {
    await mongoose.connect(URI, { serverSelectionTimeoutMS:5000 });
    console.log("Base de Datos mongodb está conectada...");
} catch (error) {
    console.error("Error conectando a la base de datos MongoDB:", error);
}
