import {Router} from "express";
import { CartsMongo } from "../dao/managers/carts.mongo.js";




const cartsService = new CartsMongo();


const router = Router();


router.get("/",async(req,res)=>{
    try {
        const cart = await cartsService.getCarts();
  
       res.render("carts", {data:cart})
    } catch (error) {
        console.log(error.message);
        res.status(400).json({status:"error", message:"Hubo un error al obtener el carrito"});
    }
});



router.get("/:cid",async(req,res)=>{
    try {
        const cartId = req.params.cid;
        const cart = await cartsService.getCartById(cartId);
        console.log(cart); 
 
       res.render("carts", {data:cart})
    } catch (error) {
        console.log(error.message);
        res.status(400).json({status:"error", message:"Hubo un error al obtener el carrito"});
    }
});



router.get("/population/:cid",async(req,res)=>{
    try {
        const {cid} = req.params;
        const cart =(await cartsService.getPopulate(cid));
        res.json(cart);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({status:"error", message:"Hubo un error al obtener la información"});
    }
});


router.post("/",async(req,res)=>{
    try {
        const cartCreated = await cartsService.createCart();
        res.json({status:"success",data:cartCreated});
    } catch (error) {
        console.log(error.message);
        res.status(400).json({status:"error", message:error.message});
    }
});


router.post("/:cid/product/:pid",async(req,res)=>{
    try {
 
        await cartsService.addProduct(req.params.cid , req.params.pid);
        const updatedCart = await cartsService.getCartById(req.params.cid);

    res.json({ status: "success", data: updatedCart });
  
    } catch (error) {
        console.log(error.message);
        res.status(400).json({status:"error", message:error.message});
    }

});


router.put("/:cid/product/:pid",async(req,res)=>{
    try {
        const { quantity } = req.body;

        if (!quantity || isNaN(quantity)) {
          throw new Error("La cantidad debe ser un número válido");
        }
    
        const modCart = await cartsService.updateCart(
          req.params.cid,
          req.params.pid,
          parseInt(quantity)
        );
    
        res.json({ status: "success", data: modCart });
    } catch (error) {
        console.log(error.message);
        res.status(400).json({status:"error", message:error.message});
    }

});


router.delete("/:cid",async(req,res)=>{
    try {
        const resultId = await cartsService.deleteCart(req.params.cid);
        res.json({status:"success",data:resultId.message});
    } catch (error) {
        console.log(error.message);
        res.status(400).json({status:"error", message:error.message});
    }
});


router.delete("/:cid/product/:pid",async(req,res)=>{
    try {
        const resultId = await cartsService.deleteProduct(req.params.cid , req.params.pid);
        res.json({status:"success",data:resultId.message});
    } catch (error) {
        console.log(error.message);
        res.status(400).json({status:"error", message:error.message});
    }
});

export {router as cartsRouter}