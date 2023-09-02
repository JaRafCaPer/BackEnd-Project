import mongoose from "mongoose";

const usersCollections = "users";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true
},
  social: String,
  age: Number,
  password: String,
  rol: {
    type: String,
    enum: ["usuario", "admin"],
    default: "usuario",
  },
  cartId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'carts'
  }
});

mongoose.set("strictQuery", false);

const UserModel = mongoose.model(usersCollections, userSchema);

export default UserModel;