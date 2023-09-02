import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const cartSchema = new mongoose.Schema({
  products: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ]
});
cartSchema.plugin(mongoosePaginate);
const CartModel = mongoose.model('carts', cartSchema);

export default CartModel;
