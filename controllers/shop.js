const Product = require("../models/product");

exports.getProducts = async (req, res, next) => {
  const products = await Product.findAll();
  res.render("shop/product-list", {
    prods: products,
    pageTitle: "All Products",
    path: "/products",
  });
};

exports.getProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  const product = await Product.findByPk(prodId);
  res.render("shop/product-detail", {
    product: product,
    pageTitle: product.title,
    path: "/products",
  });
};

exports.getIndex = async (req, res, next) => {
  const products = await Product.findAll();
  res.render("shop/index", {
    prods: products,
    pageTitle: "Shop",
    path: "/",
  });
};

exports.getCart = async (req, res, next) => {
  const cart = await req.user.getCart();
  const cartProducts = await cart.getProducts();
  res.render("shop/cart", {
    path: "/cart",
    pageTitle: "Your Cart",
    products: cartProducts,
  });
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;
  const cart = await req.user.getCart();
  const productCart = (await cart.getProducts({ where: { id: prodId } }))[0];

  if (!productCart) {
    const product = await Product.findByPk(prodId);
    await cart.addProduct(product, { through: { quantity: 1 } });
  } else {
    await cart.addProduct(productCart, {
      through: { quantity: productCart.cartItem.quantity + 1 },
    });
  }

  res.redirect("/cart");
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  const cart = await req.user.getCart();
  const productToDelete = (
    await cart.getProducts({ where: { id: prodId } })
  )[0];
  await productToDelete.cartItem.destroy();
  res.redirect("/cart");
};

exports.postOrder = async (req, res, next) => {
  let cartProducts = await (await req.user.getCart()).getProducts();
  const order = await req.user.createOrder();
  cartProducts.forEach(async (product) => {
    await order.addProduct(product, {
      through: { quantity: product.cartItem.quantity },
    });
  });
  await (await req.user.getCart()).destroy();
  const orders = await req.user.getOrders();
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
    orders: orders,
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
