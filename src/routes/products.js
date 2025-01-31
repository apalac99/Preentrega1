const express = require('express');
const router = express.Router();
const { readProducts, writeProducts } = require('../utils/fileManager');

// GET /api/products/
router.get('/', (req, res) => {
  const products = readProducts();
  const limit = req.query.limit;
  if (limit) {
    res.json(products.slice(0, limit));
  } else {
    res.json(products);
  }
});

// GET /api/products/:pid
router.get('/:pid', (req, res) => {
  const products = readProducts();
  const product = products.find(p => p.id === req.params.pid);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// POST /api/products/
router.post('/', (req, res) => {
  const products = readProducts();
  const newProduct = {
    id: (products.length + 1).toString(), // Genera un ID único
    ...req.body,
    status: true,
    thumbnails: req.body.thumbnails || [],
  };
  products.push(newProduct);
  writeProducts(products);
  res.status(201).json(newProduct);
});

// PUT /api/products/:pid
router.put('/:pid', (req, res) => {
  const products = readProducts();
  const index = products.findIndex(p => p.id === req.params.pid);
  if (index !== -1) {
    products[index] = { ...products[index], ...req.body };
    writeProducts(products);
    res.json(products[index]);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// DELETE /api/products/:pid
router.delete('/:pid', (req, res) => {
  const products = readProducts();
  const filteredProducts = products.filter(p => p.id !== req.params.pid);
  if (filteredProducts.length < products.length) {
    writeProducts(filteredProducts);
    res.status(204).end();
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

module.exports = router;