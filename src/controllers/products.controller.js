import { productService } from '../services/index.js';

export const getProducts = async (req, res) => {
  try {
    const products = await productService.getProducts();
    return res.send(products);
  } catch (error) {
    return res.send({ status: 'error', payload: error });
  }
};

export const getProductByID = async (req, res) => {
  try {
    const id = req.params.pId;
    const product = await productService.getProductById(id);
    return res.send(product);
  } catch (error) {
    return res.send({ status: 'error', payload: error });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const id = req.params.pId;
    const {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
    } = req.body;
    const newProduct = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
    };
    console.log(id);
    const product = await productService.updateProduct(id, newProduct);
    return res.send({ status: 'success', product });
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.pId;
    const deleteProduct = await productService.deleteProduct(id);
    if (!deleteProduct)
      return res.send({
        status: 'error',
        payload: 'There has been a problem deleting the product',
      });
    return res.send({
      status: 'success',
      payload: `Product deleted, ${deleteProduct}}`,
    });
  } catch (e) {
    return console.error(e);
  }
};
export const updateStock = async (req, res) => {
  try {
    const pId = req.params.pId;
    const stock = parseInt(req.body.stock);
    const updatedStock = await productService.updateStock(pId, stock);
    if (!updatedStock)
      return res.send({
        status: 'error',
        payload: 'There has been a problem updating the stock!',
      });
    return res.send({ status: 'success', payload: 'Stock updated!' });
  } catch (error) {
    throw new error(error);
  }
};

export const addProductToDatabase = async (req, res) => {
  try {
    const { title, description, price, thumbnail, code, stock, status } =
      req.body;
    const product = { title, description, price, thumbnail, code, stock, status };
    const prodCreated = await productService.addProductToDatabase(product);
    return res.send({ status: 'success', product: prodCreated });
  } catch (error) {
    console.log(error);
    return res.send({ status: 'error', payload: error });
  }
};
