import ProductsModel from "./models/products.mongo.model.js";

export default class ProductsMongo {
  async addProduct(product) {
    try {
      return await ProductsModel.create(product);
    } catch (error) {
      throw error;
    }
  }
  async getProducts() {
    try {
      return await ProductsModel.find().lean().exec();
    } catch (error) {
      throw error;
    }
  }
  async getProductById(id) {
    try {
      const product = await ProductsModel.findById(id).lean().exec();
      if (product) return product;
      return null;
    } catch (error) {
      throw error;
    }
  }
  async updateProduct(id, data) {
    try {
      const productExist = await ProductsModel.findByIdAndUpdate(id, data);
      return "product updated";
    } catch (error) {
      throw error;
    }
  }
  async deleteProduct(id) {
    try {
      const productExist = await ProductsModel.findByIdAndDelete(id);
      return "product deleted";
    } catch (error) {
      throw error;
    }
  }
  getProductsOrder = async (sort) => {
    const productsOrders = await ProductsModel.aggregate([
      {
        $sort: { price: sort },
      },
    ]);
    return productsOrders;
  };
  getProductsMatch = async (key, value, sort) => {
    const productMatch = await ProductsModel.aggregate([
      {
        $match: { category: value[0] },
      },
      {
        $sort: { price: sort },
      },
    ]);
    return productMatch;
  };

  getProductsPaginate = async (page, limit, queryParams, sort) => {
    try {
      let query = {};
      if (queryParams) {
        const field = queryParams.split(",")[0];
        let value = queryParams.split(",")[1];
        if (!isNaN(parseInt(value))) value = parseInt(value);
        query[field] = value;
      }
      let products = await ProductsModel.paginate(query, {
        page,
        limit,
        lean: true,
      });

      if ((sort === 1 || sort === -1) && Object.keys(query).length === 0) {
        products = {
          docs: await this.getProductsOrder(sort),
        };

        return products.docs;
      }
      if ((sort === 1 || sort === -1) && query) {
        const keys = Object.keys(query);

        const value = Object.values(query);

        products = {
          docs: await this.getProductsMatch(keys, value, sort),
        };
        const productsPaginate = products.docs;
        const productsPrev = products.prevLink;
        const productsNext = products.nextLink;
        const productsPrevValidate = products.prevPageValidate;
        const productsNextValidate = products.nextPageValidate;
        return {
          productsPaginate,
          productsPrev,
          productsNext,
          productsPrevValidate,
          productsNextValidate,
        };
      }
      products.prevLink = products.hasPrevPage
        ? `?page=${products.prevPage}&limit=${limit}`
        : "";
      products.nextLink = products.hasNextPage
        ? `?page=${products.nextPage}&limit=${limit}`
        : "";
      products.prevPageValidate = products.hasPrevPage
        ? `?page=${products.prevPage}&limit=${limit}`
        : "";
      products.nextPageValidate = products.hasNextPage
        ? `?page=${products.nextPage}&limit=${limit}`
        : "";

      const productsPaginate = products.docs;
      const productsPrev = products.prevLink;
      const productsNext = products.nextLink;
      const productsPrevValidate = products.prevPageValidate;
      const productsNextValidate = products.nextPageValidate;
      return {
        productsPaginate,
        productsPrev,
        productsNext,
        productsPrevValidate,
        productsNextValidate,
      };
    } catch (err) {
      throw err;
    }
  };

  async getProductsLimit(limit) {
    try {
      const products = await ProductsModel.find().lean().exec();
      return products.slice(0, limit);
    } catch (e) {
      throw e;
    }
  }

  async getProductByCode(code) {
    try{
      return await ProductsModel.findOne({code}).lean().exec();
    }catch(e){
      throw e;
    }
  }
}
