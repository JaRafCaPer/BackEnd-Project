export default class ProductDTO {
  constructor(product) {
    if (!product.title || !product.price || !product.stock) {
      throw new Error("Faltan campos obligatorios");
    }

    this.title = product.title;
    this.description = product.description || "";
    this.price = product.price;
    this.thumbnail = product.thumbnail || "";
    this.code = product.code || "0";
    this.category = product.category || "default";
    this.status = product.status || true;
    this.owner = product.owner || "adminCoder@coder.com";
    this.stock = product.stock;
  }
}
