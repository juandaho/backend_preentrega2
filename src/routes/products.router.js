
import express from 'express';
const router = express.Router();
import { productsModel as Product } from '../dao/models/products.model.js';

router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sortQuery = req.query.sort;
    const query = req.query.query || {};

    const sort = {};
    if (sortQuery === 'asc') {
      sort.price = 1;
    } else if (sortQuery === 'desc') {
      sort.price = -1;
    }

    const products = await Product.find(query)
      .sort(sort)
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    const response = {
      status: 'success',
      payload: products,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `/path/to/endpoint?page=${page - 1}` : null,
      nextLink: page < totalPages ? `/path/to/endpoint?page=${page + 1}` : null,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
