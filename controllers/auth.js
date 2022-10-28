const googleOauth2 = require('../utils/oauth2/google')
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
}
