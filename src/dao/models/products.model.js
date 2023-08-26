import mongoose from "mongoose";

const productCollection = "products";

const productSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },
 
    price: {
        type: Number,
        required: true,
        validate: {
            validator: Number.isInteger,
            message: "{VALUE} is not an integer value"
        }
    },
 
    stock: {
        type: Number,
        required: true,
        validate: {
            validator: Number.isInteger,
            message: "{VALUE} is not an integer value"
        }
    },

    thumbnail: {
        type: String,
        required: false
    },

    code: {
        type: String,
        unique: true,
        required: true
    },
  
    category: {
        type: String,
        required: true
    },
 
    status: {
        type: Boolean,
        default: true
    }
}, 
{
 
    timestamps: true,
}
);

export const productsModel = mongoose.model(productCollection, productSchema);

export default mongoose.model('Product', productSchema);