import passport from "passport";
import local from 'passport-local'
import UserModel from "../DAO/mongoManager/models/user.model.js";
import CartModel from "../DAO/mongoManager/models/cart.model.js";
import { createHash, isValidPassword } from "../utils.js";
import github from 'passport-github2'
import passportJWT from 'passport-jwt'
import google from "passport-google-oauth20";
import { extractCookie, generateToken } from "../utils.js";


const LocalStrategy = local.Strategy;
const JwtStrategy = passportJWT.Strategy;
const GitHubStrategy = github.Strategy;
const GoogleStrategy = google.Strategy;

const clientIdGitHub = process.env.CLIENT_GITHUB_ID;
const clientSecretGitHub = process.env.CLIENT_GITHUB_SECRET;
const callbackUrlGitHub = process.env.CLIENT_GITHUB_CALLBACK;
const clientIdGoogle = process.env.CLIENT_GOOGLE_ID;
const clientSecretGoogle = process.env.CLIENT_GOOGLE_SECRET;
const callbackUrlGoogle = process.env.CLIENT_GOOGLE_CALLBACK;
const JwtExtract = passportJWT.ExtractJwt;
const privateKey = process.env.PRIVATE_KEY


const initializePassport = () => {

    passport.use('github', new GitHubStrategy(
        {
            clientID: clientIdGitHub,
            clientSecret: clientSecretGitHub,
            callbackURL: callbackUrlGitHub,
        },
        async (accessToken, refreshToken, profile, done) => {
            // console.log(profile)
            
            try {
                const email = profile._json.email
                console.log( { email })
                const user = await UserModel.findOne({ email }).lean().exec()
                if(user) {
                    console.log('User already exits!!')
                } else {
                    console.log(` Registering User`)

                    // Dividimos para sacar el nombre y el apellido
                    const fullName = profile._json.name;
                    const nameParts = fullName.split(' ');
                    const firstName = nameParts[0];
                    const lastName = nameParts.slice(1).join(' ');

                    const newCart = await CartModel.create({ products: [] });

                    const newUser = {
                        first_name: firstName,
                        last_name: lastName,
                        email,
                        age: profile._json.public_repos,
                        password: '',
                        social: 'github',
                        rol: 'user',
                        cartId: newCart._id
                    }
                    const result = await UserModel.create(newUser)
                    console.log(result)
                    user = newUser
                }

                const token = generateToken(user)
                user.token = token
                // console.log(user.token);
                return done(null, user)

            } catch (e) {
                return done('Error to login with github' + e) 
            }
        }
    ))
    
    passport.use(
        "google",
        new GoogleStrategy(
          {
            clientID: clientIdGoogle,
            clientSecret: clientSecretGoogle,
            callbackURL: callbackUrlGoogle,
          },
          async (accessToken, refreshToken, profile, cb) => {
            try {
              const email = profile._json.email;
              const name = profile._json.given_name;
              const lastName = profile._json.family_name;
    
              let user = await UserModel.findOne({ email: email });
    
              if (!user) {
                console.log("New user");
    
                const newCart = await CartModel.create({ products: [] });
    
                const newUser = {
                  first_name: name,
                  last_name: lastName,
                  email: email,
                  password: "",
                  social: "Google",
                  cartId: newCart._id,
                };
    
                user = await UserModel.create(newUser);
              }
    
              const token = generateToken(user);
    
              user.token = token;
    
              return cb(null, user);
            } catch (err) {
              return cb(`Error: ${err}`);
            }
          }
        )
      );


      passport.use(
        "jwt",
        new JwtStrategy(
          {
            jwtFromRequest: JwtExtract.fromExtractors([extractCookie]),
            secretOrKey:  privateKey,
          },
          async (jwt_payload, done) => {
            try {
              return done(null, jwt_payload);
            } catch (err) {
              return done(err);
            }
          }
        )
      );

    passport.use('register', new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },
        async (req, username, password, done) => {
            const { first_name, last_name, age ,email } = req.body
            try {
                const user = await UserModel.findOne({ email: username })
                if (user) {
                    console.log('User already exits')
                    return done(null, false)
                }

                const newUser = {
                    first_name,
                    last_name,
                    age,
                    email,
                    password: createHash(password)
                }
                const result = await UserModel.create(newUser)
                return done(null, result)
            } catch (e) {
                return done('Error to register ' + error)
            }
        }
    ))

    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (username, password, done) => {
            try {
                const user = await UserModel.findOne({ email: username }).lean().exec()
                if (!user) {
                    console.error('User doesnt exist')
                    return done(null, false)
                }

                if (!isValidPassword(user, password)) {
                    console.error('Password not valid')
                    return done(null, false)
                }
                const token = generateToken(user);
                // console.log('login', user);
                user.token = token;
                return done(null, user)
            } catch (e) {
                return done('Error login ' + error)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    })

}

export default initializePassport
