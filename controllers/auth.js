const {google} = require('googleapis');
const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    REDIRECT_URI
} = process.env;
const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    REDIRECT_URI
);
// function to generate auth url 
const generateAuthURL = () => {
    // the scopes is just for getting email and profile
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ];

    // generate the authUrl
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        response_type: 'code', // this is what we want for login 
        scope: scopes
    });

    return authUrl;
}
module.exports = { 
    // controller for login googleOAuth
    googleOAuth2: (req, res, next) => { 
        try { 
            // get the google uri code for login with google oauth
            const code =  req.query.code;

            // if there's no code from the google than it'll generate an url and redirect to that url
            if (!code) { 
                const url = generateAuthURL();
                return res.redirect(url);
            }

            // if authroized then it's a successful login 
            res.send('Successful Login') ;
        } catch(err) { 
            next(err);
        }
    }
}
