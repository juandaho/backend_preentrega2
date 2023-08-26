import {cartModel} from "../models/carts.model.js"
import ProductManager from "../mongomanagers/productManagerMongo.js"

const pm = new ProductManager()

class CartManager {
    getCarts = async () => {
        const carts = await cartModel.find();
        return carts;
    };

    getCartById = async (cartId) => {
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            throw new Error('Cart not found');
        }
        return cart;
    };

    addCart = async (products) => {
        let cartData = {};
        if (products && products.length > 0) {
            cartData.products = products;
        }

        const cart = await cartModel.create(cartData);
        return cart;
    };

    addProductInCart = async (cid, obj) => {
        const filter = { _id: cid, "products._id": obj._id };
        const cart = await cartModel.findById(cid);
        const findProduct = cart.products.some((product) => product._id.toString() === obj._id);

        if (findProduct) {
            const update = { $inc: { "products.$.quantity": obj.quantity } };
            await cartModel.updateOne(filter, update);
        } else {
            const update = { $push: { products: { _id: obj._id, quantity: obj.quantity } } };
            await cartModel.updateOne({ _id: cid }, update);
        }

        return await cartModel.findById(cid);
    };
};

export default CartManager;
