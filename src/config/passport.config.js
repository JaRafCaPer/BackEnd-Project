import passport from "passport";
import local from 'passport-local'
import UserModel from "../DAO/mongoManager/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import GitHubStrategy from 'passport-github2'
import GoogleStrategy from 'passport-google-oauth20';

const LocalStrategy = local.Strategy

const initializePassport = () => {

    passport.use('github', new GitHubStrategy(
        {
            clientID: 'Iv1.539642c92e819c00',
            clientSecret: '1d43f3bf3c6f41be319928a7c6a57f3dff954915',
            callbackURL: 'http://127.0.0.1:8080/api/session/githubcallback'
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await UserModel.findOne({ email: profile._json.email });
    
                if (user) {
                    console.log('User already exists ' + profile._json.email);
                    return done(null, user);
                }
                // Dividimos para sacar el nombre y el apellido
                const fullName = profile._json.name;
                const nameParts = fullName.split(' ');
                const firstName = nameParts[0];
                const lastName = nameParts.slice(1).join(' ');

                const newUser = {
                    first_name: firstName,
                    last_name: lastName,
                    age: profile._json.public_repos,
                    email: profile._json.email,
                    password: '', 
                    type: profile._json.type
                };
    
                console.log(newUser);
                const result = await UserModel.create(newUser);
                return done(null, result);
            } catch (e) {
                return done('Error to login with GitHub: ' + e);
            }
        }
    ));

        



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
