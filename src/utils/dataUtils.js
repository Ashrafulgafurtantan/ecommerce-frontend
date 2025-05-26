import productsData from '../data/products.json';

export const getCategories = () => productsData.categories;

export const getProducts = () => productsData.products;

export const getProductById = (id) => {
  return productsData.products.find(product => product.id === id);
};

export const getCategoryById = (id) => {
  return productsData.categories.find(category => category.id === id);
};

export const updateProduct = (productId, updates) => {
  const productIndex = productsData.products.findIndex(p => p.id === productId);
  if (productIndex === -1) return null;
  
  productsData.products[productIndex] = {
    ...productsData.products[productIndex],
    ...updates
  };
  
  return productsData.products[productIndex];
};

export const addProduct = (product) => {
  const newId = productsData.products.length + 1;
  const newProduct = {
    id: newId,
    ...product
  };
  productsData.products.push(newProduct);
  return newProduct;
};

export const removeProduct = (productId) => {
  const productIndex = productsData.products.findIndex(p => p.id === productId);
  if (productIndex === -1) return false;
  
  productsData.products.splice(productIndex, 1);
  return true;
};

export const addToCart = (productId, quantity = 1) => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const product = getProductById(productId);
  
  if (!product) return null;
  
  const existingItem = cart.find(item => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity,
      name: product.name,
      price: product.price,
      unit: product.unit
    });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  return cart;
};

export const removeFromCart = (productId) => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const updatedCart = cart.filter(item => item.productId !== productId);
  localStorage.setItem('cart', JSON.stringify(updatedCart));
  return updatedCart;
};

export const updateCartItemQuantity = (productId, quantity) => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const cartIndex = cart.findIndex(item => item.productId === productId);
  
  if (cartIndex === -1) return null;
  
  cart[cartIndex].quantity = quantity;
  localStorage.setItem('cart', JSON.stringify(cart));
  return cart;
};

export const getCart = () => {
  return JSON.parse(localStorage.getItem('cart') || '[]');
};

export const clearCart = () => {
  localStorage.removeItem('cart');
};

export const processOrder = (cart) => {
  let success = true;
  
  cart.forEach(item => {
    const product = getProductById(item.productId);
    if (product && product.quantity >= item.quantity) {
      updateProduct(item.productId, {
        quantity: product.quantity - item.quantity
      });
    } else {
      success = false;
    }
  });
  
  if (success) {
    clearCart();
    return true;
  }
  return false;
};
