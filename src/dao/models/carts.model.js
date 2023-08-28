import mongoose from "mongoose";

const cartsCollection = "carts";

const cartSchema = new mongoose.Schema({
  products: {
      type:[
          {
              _id:{
                  type:mongoose.Schema.Types.ObjectId,
                  ref:"products"
              },
              quantity:{
                  type:Number,
                  required:true,
                  default:1
              }
          }
      ],
      required:true,
      default:[]
  }
});


export const cartsModel = mongoose.model(cartsCollection,cartSchema);