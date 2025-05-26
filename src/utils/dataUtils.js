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
