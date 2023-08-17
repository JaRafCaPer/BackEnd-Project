import Router from 'express'
import UserModel from '../DAO/mongoManager/models/user.model.js'
import passport from "passport";

const router = Router();

router.post('/login', passport.authenticate('login', '/login'), async (req, res) => {

  if (!req.user) return res.status(400).send('Invalid Credentials')
  req.session.user = req.user

  return res.redirect('/products')
});
  
  router.post("/register",
    passport.authenticate('register', { failureRedirect: '/register', }), async (req, res) => {
    return res.redirect("/");
  });
  
  router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        res.json({ message: err });
      }
      res.redirect("/");
    });
  });

router.post('/register',
passport.authenticate('register', { failureRedirect: '/register', }),
async (req, res) => {
    res.redirect('/login')
}
)

function auth(req, res, next) {
if (req.session?.user) next()
else res.redirect('/login')
}
router.get('/profile', auth, (req, res) => {
const user = req.session.user

res.render('profile', user)
})


router.get(
  '/login-github',
  passport.authenticate('github', {scope: ['user:email'] }),
  async(req, res) => {}
)

router.get(
  '/githubcallback',
  passport.authenticate('github', { failureRedirect: '/'}),
  async(req, res) => {
      console.log('Callback: ', req.user)
      req.session.user = req.user
      console.log('prueba 1', req.session)
      res.redirect('/profile')
  }
)
export default  router;