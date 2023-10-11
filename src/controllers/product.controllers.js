import { productRepository, categoryRepository } from "../services/index.js";
import CustomError from "../errors/CustomError.js";
import EErrors from "../errors/enums.js";
import { generateCartErrorInfo } from "../errors/info.js";

export const getProducts = async (req, res) => {
  try {
    const { user } = req.user;
    const { first_name, last_name, rol } = user;
    const page = parseInt(req.query.page) || 10;
    const limit = parseInt(req.query.limit) || 10;
    const queryParams = req.query.query || "";
    const sort = parseInt(req.query.sort);
    let products;
    if (page || limit || queryParams || sort) {
      products = await productRepository.getProductsPaginate(
        page,
        limit,
        queryParams,
        sort
      );
    } else {
      products = await productRepository.getProducts();
    }
    const productsPrev = products.productsPrev;
    const productsNext = products.productsNext;
    const productsPrevValidate = products.productsPrevValidate;
    const productsNextValidate = products.productsNextValidate;
    products = products.productsPaginate;
    const category = await categoryRepository.getCategorys();
    res.render("products", {
      products,
      category,
      last_name,
      first_name,
      rol,
      productsPrev,
      productsNext,
      productsPrevValidate,
      productsNextValidate,
    });
  } catch (error) {
    res.send({ error: error.message });
  }
};

export const getProductsRealTime = async (req, res) => {
  try {
    const { user } = req.user;
    const { first_name, last_name, rol } = user;
    const page = parseInt(req.query.page) || 10;
    const limit = parseInt(req.query.limit) || 10;
    const queryParams = req.query.query || "";
    const sort = parseInt(req.query.sort);
    let products;
    if (page || limit || queryParams || sort) {
      products = await productRepository.getProductsPaginate(
        page,
        limit,
        queryParams,
        sort
      );
    } else {
      products = await productRepository.getProducts();
    }
    const category = await categoryRepository.getCategorys();
    console.log(user);
    if (user.rol === "admin") {
      const productsPrev = products.productsPrev;
      const productsNext = products.productsNext;
      const productsPrevValidate = products.productsPrevValidate;
      const productsNextValidate = products.productsNextValidate;
      products = products.productsPaginate;
      res.render("realtimeproducts", {
        products,
        category,
        last_name,
        first_name,
        rol,
        productsPrev,
        productsNext,
        productsPrevValidate,
        productsNextValidate,
      });
    } else {
      throw CustomError.createError({
        name: "Error",
        message: "not authorized",
        code: EErrors.CART_NOT_FOUND,
        info: generateCartErrorInfo(),
      });
    }
  } catch (error) {
    res.send({ error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await productRepository.getProductById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const addProduct = async (req, res) => {
  try {
    const product = await productRepository.addProduct(req.body);
    res.status(201).send(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const updateProduct = async (req, res) => {
  try {
    const product = await productRepository.updateProduct(
      req.params.id,
      req.body
    );
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const product = await productRepository.deleteProduct(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getProductsPaginate = async (req, res) => {
  try {
    const products = await productRepository.getProductsPaginate(
      req.query.page,
      req.query.limit,
      req.query,
      req.query.sort
    );
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getProductsLimit = async (req, res) => {
  try {
    const products = await productRepository.getProductsLimit(req.query.limit);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
