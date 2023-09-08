import Router from 'express'
import UserModel from '../DAO/mongoManager/models/user.model.js'
import passport from "passport";
import { config } from 'dotenv'
import jwt from 'jsonwebtoken'
import { extractCookie } from '../utils.js';

config({ path: '.env' })

const privateKey = process.env.PRIVATE_KEY


const router = Router();

router.post('/login', passport.authenticate('login', '/login'), async (req, res) => {
  const { user } = req
  if (!req.user) return res.status(400).send('Invalid Credentials')
  console.log('login2', user);
  return res.cookie(privateKey, req.user.token).redirect('/products')

  
});
  
  router.post("/register",
    passport.authenticate('register', { failureRedirect: '/register', }), async (req, res) => {
    return res.redirect("/");
  });
 
  
  router.get("/logout", (req, res) => {
    res.clearCookie(privateKey)
    console.log('cookie deleted');
    req.session.destroy((err) => {
      if (err) {
        res.json({ message: err });
      }
      res.redirect("/");
    });
  });


function auth(req, res, next) {
if (req.user) next()
else res.redirect('/login')
}


router.get('/profile',
    passport.authenticate('jwt', {session: false }),
    (req, res) => {
        
        const { user } = req 
       console.log('profile:', user)
        res.render('profile', user)
    }
)

router.get(
  '/login-github',
  passport.authenticate('github', {scope: ['user:email'] }),
  async(req, res) => {}
)

router.get('/githubcallback',
    passport.authenticate('github', { failureRedirect: '/fail-github' }),
    (req, res) => {
        console.log('Callback:', req.user)
        const { user } = req
        console.log('linea 69', user)
        res.cookie(privateKey, user.token).redirect('/products')
    }
)

router.get('/current', (req, res) =>{
  const token = extractCookie(req)
  console.log(token);
        if(!token)return res.status(401).json({error: "Not authenticated"})
    
        jwt.verify(token, privateKey, (error, credentials)=>{
            if(error) return res.status(403).json({error: "Not authorized"})
            return res.json(credentials.user)
        })
}

)
export default  router;