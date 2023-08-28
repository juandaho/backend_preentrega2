import { Router } from "express";
import { ProductsMongo } from "../dao/managers/products.mongo.js";

const productsService = new ProductsMongo();

const router = Router();

router.get("/", (req, res) => {
  res.render("home");
});

router.get("/products", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort = "asc", category, stock } = req.query;
    if (!["asc", "desc"].includes(sort)) {
      return res.json({
        status: "error",
        message: "ordenamiento no valido, solo puede ser asc o desc",
      });
    }
    const sortValue = sort === "asc" ? 1 : -1;
    const stockValue = stock === "0" ? undefined : parseInt(stock);
    let query = {};
    if (category && stockValue) {
      query = { category: category, stock: stockValue };
    } else {
      if (category || stockValue) {
        if (category) {
          query = { category: category };
        } else {
          query = { stock: stockValue };
        }
      }
    }
    const baseUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
    const result = await productsService.getPaginate(query, {
      page,
      limit,
      sort: { price: sortValue },
      lean: true,
    });
    const response = {
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      totalDocs: result.totalDocs,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `${baseUrl.replace(`page=${result.page}`, `page=${result.prevPage}`)}`
        : null,
      nextLink: result.hasNextPage
        ? `${baseUrl.replace(`page=${result.page}`, `page=${result.nextPage}`)}`
        : null,
    };
    res.render("products", response);
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realtimeproducts");
});

export { router as viewsRouter };
