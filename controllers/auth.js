const googleOauth2 = require('../utils/oauth2/google');
const facebookOauth2 = require('../utils/oauth2/facebook');
const jwt = require('jsonwebtoken')
const { User } = require('../db/models');
const userType = require('../utils/oauth2/enum');
const {
    JWT_SECRET_KEY
} = process.env
module.exports = { 
    // controller for login googleOAuth
    google: async (req, res, next) => { 
        try { 
            // get the google uri code for login with google oauth
            // code is for getting the credential from the google user.
            const code =  req.query.code;  

            // if there's no code from the google than it'll generate an url and redirect to that url
            if (!code) { 
                // generate the url for redirecting
                const url = googleOauth2.generateAuthURL();
                return res.redirect(url);
            }

            // we can get the token
            const creds = await googleOauth2.setCredentials(code);
            console.log(creds)

            // after the code above we can get the data user;
            const { data } = await googleOauth2.getUserData();
            return res.json(data);

            // if authroized then it's a successful login 
            // res.send('Successful Login') ;
        } catch(err) { 
            next(err);
        }
    },

    facebook: async (req, res, next) => { 
        try { 
            const code =  req.query.code;  
            console.log("facebookmethod ");
            console.log(code);

            // if there's no code from the google than it'll generate an url and redirect to that url
            if (!code) { 
                // generate the url for redirecting
                const url = facebookOauth2.generateAuthURL();
                return res.redirect(url);
            }

            // we can get the token
            const access_token = await facebookOauth2.getAccessToken(code);

            // after the code above we can get the data user;
            const userInfo = await facebookOauth2.getUserInfo(access_token);

            // so we can access the user
            const userExists = await User.findOne( {where: { email: userInfo.email } });
            
            // if the user does not exists than we can create the creds into the database
            if (!userExists) { 
                userExists = await User.create({
                    name: [userInfo.firstName, userInfo.lastName].join(','),
                    email: userInfo.email,
                    userType: userType.facebook
                })
            }

            // payload for token
            const payload = {
                id: userExists.id,
                username: userExists.username,
                email: userExists.email,
                user_type: userExists.user_type
            }

            // create the token
            const token = jwt.sign(payload, JWT_SECRET_KEY);

            // return the token
            return res.status(200).json({
                message: "Successfully Login With Facebook",
                user_id: userExists.id,
                token
            });

            // if authorized then it's a successful login 
            // return res.send('Successful Login') ;
        } catch(err) { 
            next(err);
        }
    },

    register: async(req, res, next) => { 
        try { 
            const { email, password } = req.body;
            const userExists = await User.findOne({where: {email: email}});
            
            // create hashed password

            if(userExists) { 
                if (userExists.userType != userType.basic)
                
                return res.status(404).json({
                    status: false,
                    message: 'User is not found !',
                    data: null
                });
            }

            // check if the user is created with OAuth or not 
            if (userExists.user_type != userType.basic ) { 
                return res.status(404).json({
                    status: false,
                    message: 'Your Account Might be associated with Facebook or Google',
                    data: null
                });
            }

            const newUser = await User.create({
                name: [userInfo.firstName, userInfo.lastName].join(','),
                email: userInfo.email,
                userType: userType.basic
            })

            // return newUser here

        } catch(err) { 
            next(err);
        }
    },

    login: async(req, res, next) => { 
        try { 
            const { email, password } = req.body;
            const userExists = await User.findOne({where: {email: email}});

            if(!userExists) { 
                return res.status(404).json({
                    status: false,
                    message: 'User is not found !',
                    data: null
                });
            }

            if (userExists.user_type != userType.basic ) { 
                return res.status(404).json({
                    status: false,
                    message: 'Your Account Might be associated with Facebook or Google',
                    data: null
                });
            }

            // check password here

        } catch(err) { 
            next(err);
        }
    }
}
