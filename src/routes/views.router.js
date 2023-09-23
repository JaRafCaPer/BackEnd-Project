import { Router } from "express";
import productsModel from "../Dao/mongo/models/products.models.js";
import messageModel from "../Dao/mongo/models/messages.models.js"
import cartModel from "../Dao/mongo/models/cart.model.js";
import { getProductsViews, renderDetailProduct, renderLogin, renderProfile, renderRegister, getProductsAll } from "../controllers/views.controller.js";

const router = Router();

//vistas de session
function auth(req, res, next) {
  if(req.user) return res.redirect("/")
  return next()
}

// perfil de usuario
function profile(req, res, next) {
  if(req.user) return next()
  
  return res.redirect("/login")
}


  //inicio de sesion
router.get("/login", auth, renderLogin)

//resgitro
router.get("/registre", auth, renderRegister)

//profile
router.get("/profile", profile, renderProfile)

//vista home
router.get("/", getProductsViews)


//real time prodcuts
function accesAdmin(req, res, next) {
  const user = req.user;

  if(user.rol == "admin") return next()

  return res.send("no tienes acceso a esta direccion")
}
router.get("/products",accesAdmin, getProductsAll)



//vista detail products
router.get("/detail/:_id", renderDetailProduct)


function accesAUser(req, res, next) {
const user = req.user;
  if(user.rol == "user") return next()

  return res.send("no tienes acceso a esta direccion")
}
//cista chat
router.get("/chat",accesAUser, async (req, res) => {
  const messages = await messageModel.find().lean().exec()
  res.render("chat", {messages})
})

//vista de carts
router.get("/carts/:cid", async(req, res) => {
  const id = req.params.cid;

  try {
    const cart = await cartModel.findOne({ _id: id }).populate("products.pid").lean().exec();
    
    if(!cart){
      res.send("el carrito no existe")
    } else {
      res.render("cart", {cart})
    }
    
  } catch (error) {
    console.log("error al obtener el carrito", error);
  }
})


//agregar un producto meidante un form
router.post("/products", async (req,res) => {
    const productNew = req.body;
    try {
        const productCreated = new productsModel(productNew);
        await productCreated.save();
        res.redirect('/');
      } catch (error) {
        console.error(error);
        res.redirect('/error');
      }
})

router.get("/current", (req, res) => {
  res.render("current", {})
})

export default router