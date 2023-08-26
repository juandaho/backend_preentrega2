import mongoose from 'mongoose';

const cartCollection = 'Carts';

const cartSchema = new mongoose.Schema({
    customId: {
        type: String,
        unique: true,
    },
    products: [
        {
            _id: {
                type: mongoose.Types.ObjectId,
                ref: 'Products',
            },
            quantity: {
                type: Number,
                default: 1,
            },
        },
    ],
}, 
{
    timestamps: true,
});

cartSchema.index({ 'products._id': 1 });

const CartModel = mongoose.model(cartCollection, cartSchema);

export { CartModel };
export default CartModel;
