import express from 'express';
import Cart from '../dao/models/carts.model.js'; // Importa el modelo de Cart
import Product from '../dao/models/products.model.js'; // Importa el modelo de Product

const router = express.Router();

// DELETE api/carts/:cid/products/:pid
router.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).send('Carrito no encontrado');

    cart.products = cart.products.filter(product => product._id.toString() !== pid);
    await cart.save();
    res.status(200).send('Producto eliminado del carrito');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// PUT api/carts/:cid
router.put('/:cid', async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;
  try {
    const cart = await Cart.findByIdAndUpdate(cid, { products }, { new: true }).populate('products');
    if (!cart) return res.status(404).send('Carrito no encontrado');
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// PUT api/carts/:cid/products/:pid
router.put('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).send('Carrito no encontrado');

    const product = cart.products.find(product => product._id.toString() === pid);
    if (!product) return res.status(404).send('Producto no encontrado');

    product.quantity = quantity;
    await cart.save();
    res.status(200).send('Cantidad de producto actualizada');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// DELETE api/carts/:cid
router.delete('/:cid', async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await Cart.findByIdAndDelete(cid);
    if (!cart) return res.status(404).send('Carrito no encontrado');
    res.status(200).send('Carrito eliminado');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;
