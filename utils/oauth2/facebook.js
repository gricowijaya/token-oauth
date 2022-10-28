require('dotenv').config()
const axios = require('axios')
const querystring = require('query-string')
const {
    FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET,
    FACEBOOK_REDIRECT_URI
} = process.env
module.exports = { 
    generateAuthURL: () => { 
        const params = querystring.stringify({
            client_id: FACEBOOK_APP_ID,
            redirect_uri: FACEBOOK_REDIRECT_URI,
            scope:['email', 'user_friends'].join(','),
            respose_type: 'code',
            auth_type: 'rerequest',
            display:'popup'
        });

        return `https://www.facebook.com/v15.0/dialog/oauth?${params}`;
    },

    getAccessToken: async(code) => { 
        const { data } = await axios({
            url: `https://graph.facebook.com/v15.0/oauth/access_token`,
            method: 'get',
            params: { 
                client_id: FACEBOOK_APP_ID,
                client_secret: FACEBOOK_APP_SECRET,
                redirect_uri: FACEBOOK_REDIRECT_URI,
                code,
            }
            
        });

        return data.access_token
    },

    getUserInfo: async(accessToken) => { 
        const { data } = await axios({
            url: "https://graph.facebook.com/me",
            method: 'get',
            params: { 
                fields: ['first_name'],
                access_token: accessToken,
            }
        });

        return data;
    }
}
