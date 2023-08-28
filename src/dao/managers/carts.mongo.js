import {cartsModel} from "../models/carts.model.js";

export class CartsMongo{
    constructor(){
        this.model = cartsModel;
    };

    async getCarts(){
        try {
            const data = await this.model.find().lean();
            return data;
        } catch (error) {
            throw new Error(`Error al obtener los carritos ${error.message}`);
        }
    };

    async getCartById(id){
        try {
            const data = await this.model.findById(id);
            if(!data){
                throw new Error("el carrito no existe")
            }
            return data;
        } catch (error) {
            throw new Error(`Error al obtener carrito ${error.message}`);
        }

        
    };

    async getPopulate(id){
        try {
            const data = await this.model.findById(id).populate('products._id');
            if(!data){
                throw new Error("el carrito no existe")
            }
            
            return data;
        } catch (error) {
            throw new Error(`Error al obtener carrito ${error.message}`);
        }

        
    };

    async createCart(cart){
        try {
            const cart = {};
            const data = await this.model.create(cart);
            return data;
        } catch (error) {
            throw new Error(`Error al crear el carrito ${error.message}`);
        }
    };

    async addProduct(cartId, productId) {
        try {
            const cart = await this.model.findById(cartId);
            if (!cart) {
                throw new Error("El carrito no existe");
            }
    
            let searchProductIndex = cart.products.findIndex((product) => product._id.toString() === productId);
            if (searchProductIndex !== -1) {
                cart.products[searchProductIndex].quantity++;
            } else {
                const newProduct = { _id: productId, quantity: 1 };
                cart.products.push(newProduct);
            }
    
            await cart.save();
    
            
            console.log(`El producto con ID ${productId} ha sido añadido al carrito con ID ${cartId}.`);
    
            return this.getPopulate(cartId);
        } catch (error) {
            throw new Error(`Error al agregar el producto ${error.message}`);
        }
    }
    

    async deleteCart(cartId){
        try {
            await this.model.findByIdAndDelete(cartId);
            return {message: "Carrito eliminado"};
        } catch (error) {
            throw new Error(`Error al eliminar el carrito ${error.message}`);
        }
    
    };

    async deleteProduct(cartId, productId){
        try {
            const cart = await this.model.findById(cartId);

            if (!cart){
                throw new Error ("El carrito no existe");
            }

            const productIndex = cart.products.findIndex(
                (product) => product._id.toString() === productId.toString()
              );
              if (productIndex === -1) {
                throw new Error("El producto no existe en el carrito");
              }
          
              cart.products.splice(productIndex, 1);
              await cart.save();
          
              return { message: "Producto eliminado del carrito" };

        } catch (error) {
            throw new Error(`Error al eliminar el carrito ${error.message}`);
        }
    
    };

    async updateCart(cartId, productId, quantity){
        try {
            const cart = await this.model.findById(cartId);
            if (!cart) {
              throw new Error("El carrito no existe");
            }
        
            const product = cart.products.find(
              (product) => product._id.toString() === productId.toString()
            );
            if (!product) {
              throw new Error("El producto no existe en el carrito");
            }
        
            product.quantity = quantity;
            await cart.save();
        
            return cart;
        } catch (error) {
            throw new Error(`Error al actualizar el carrito ${error.message}`);
        }
    };
}