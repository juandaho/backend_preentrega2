import { productsModel } from "../models/products.model.js"

export default class ProductManager {
    getProducts = async () => {
        return await productsModel.find().lean();
    }

    getProductById = async (id) => {
        const product = await productsModel.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }

    addProduct = async (product) => {
        this.validateProduct(product);
        await productsModel.create(product);
        return await productsModel.findOne({ title: product.title });
    }

    updateProduct = async (id, product) => {
        this.validateProduct(product);
        const updatedProduct = await productsModel.findByIdAndUpdate(id, { $set: product }, { new: true });
        if (!updatedProduct) {
            throw new Error('Product not found');
        }
        return updatedProduct;
    }

    deleteProduct = async (id) => {
        const deletedProduct = await productsModel.findByIdAndDelete(id);
        if (!deletedProduct) {
            throw new Error('Product not found');
        }
        return deletedProduct;
    }

    validateProduct = (product) => {
        if (!product.title || !product.price) {
            throw new Error("Invalid product format");
        }
    }
}
