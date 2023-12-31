import {Router} from "express";
import { ProductsMongo } from "../dao/managers/products.mongo.js";



const productsService = new ProductsMongo();

const router = Router();


router.get("/", async (req, res) => {
    try {
        const {limit=10,page=1,sort,category,stock} = req.query;
        if(!["asc","desc"].includes(sort)){
            res.json({status:"error", message:"ordenamiento no valido, solo puede ser asc o desc"})
        };
        const sortValue = sort === "asc" ? 1 : -1;
        const stockValue = stock === 0 ? undefined : parseInt(stock);
      
        let query = {};
        if(category && stockValue){
            query = {category: category, stock:stockValue}
        } else {
            if(category || stockValue){
                if(category){
                    query={category:category}
                } else {
                    query={stock:stockValue}
                }
            }
        }
    
        const baseUrl = req.protocol + "://" + req.get("host") + req.originalUrl;

        const result = await productsService.getPaginate(query, {
            page,
            limit,
            sort:{price:sortValue},
            lean:true
        });
    
        const response = {
            status:"success",
            payload:result.docs,
            totalPages:result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page:result.page,
            hasPrevPage:result.hasPrevPage,
            hasNextPage:result.hasNextPage,
            prevLink: result.hasPrevPage ? `${baseUrl}?page=${result.prevPage}` : null,
            nextLink: result.hasNextPage ? `${baseUrl}?page=${result.nextPage}` : null,
        }
        console.log("response: ", response);
        res.json(response);
    } catch (error) {
        res.json({status:"error", message:error.message});
    }
  });


router.get("/:pid",async(req,res)=>{
    try {
        const productId = await productsService.getProductById(req.params.pid);
        res.json({status:"success",data:productId});
    } catch (error) {
        console.log(error.message);
        res.status(400).json({status:"error", message:error.message});
    }
});


router.post("/",async(req,res)=>{
    try {
        const productCreated = await productsService.createProduct(req.body);
        res.json({status:"success",data:productCreated});
    } catch (error) {
        console.log(error.message);
        res.status(400).json({status:"error", message:error.message});
    }
});


router.put("/:id",async(req,res)=>{
    try {
     
        const modProduct = await productsService.updateProduct(req.params.id , req.body);
        res.json({status:"success",data:modProduct});
    } catch (error) {
        console.log(error.message);
        res.status(400).json({status:"error", message:error.message});
    }
});


router.delete("/:id",async(req,res)=>{
    try {
        const result = await productsService.deleteProduct(req.params.id);
        res.json({status:"success",data:result.message});
    } catch (error) {
        console.log(error.message);
        res.status(400).json({status:"error", message:error.message});
    }
});

export {router as productsRouter}