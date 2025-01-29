const express = require('express');
const router = express.Router();
const { readCarts, writeCarts, readProducts } = require('../utils/fileManager');

// POST /api/carts/
router.post('/', (req, res) => {
  const carts = readCarts();
  const newCart = {
    id: (carts.length + 1).toString(), // Generar un ID único
    products: [],
  };
  carts.push(newCart);
  writeCarts(carts);
  res.status(201).json(newCart);
});

// GET /api/carts/:cid
router.get('/:cid', (req, res) => {
  const carts = readCarts();
  const cart = carts.find(c => c.id === req.params.cid);
  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

// POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', (req, res) => {
  const carts = readCarts();
  const products = readProducts();
  const cartIndex = carts.findIndex(c => c.id === req.params.cid);
  const product = products.find(p => p.id === req.params.pid);

  if (cartIndex === -1 || !product) {
    return res.status(404).json({ error: 'Carrito o producto no encontrado' });
  }

  const cart = carts[cartIndex];
  const productIndex = cart.products.findIndex(p => p.product === req.params.pid);

  if (productIndex !== -1) {
    cart.products[productIndex].quantity += 1;
  } else {
    cart.products.push({ product: req.params.pid, quantity: 1 });
  }

  writeCarts(carts);
  res.status(201).json(cart);
});

module.exports = router;