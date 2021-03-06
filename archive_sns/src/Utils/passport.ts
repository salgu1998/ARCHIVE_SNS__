const express = require('express')
const router = express.Router()
const parseurl = require('parseurl')
const session = require('express-session')
const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth20' ).Strategy

import { 
    GoogleAccessTokenGenerator 
} from "../Middleware/JWT_Auth";

//세션
router.use(session({
    secret: 'bshjsalgu',
    resave: false,
    saveUninitialized: true
}))
router.use(passport.initialize());
router.use(passport.session());

//사용자가 인증 성공을 성공 할 경우
passport.serializeUser(function(user, done) {
    done(null, user); // user객체가 deserializeUser로 전달됨.
});

//이후 사용자의 요청시 호출
passport.deserializeUser(function(user, done) {
    done(null, user); // 여기의 user가 req.user가 됨
});

//google 로그인 정보 json
const googleCredentials = require('../../config/google.json')

passport.use(new GoogleStrategy({
    clientID: googleCredentials.web.client_id,
    clientSecret: googleCredentials.web.client_secret,
    callbackURL: googleCredentials.web.redirect_uris
    }, 
    async (accessToken, refreshToken, email, done) => {
        const google_access_token = await GoogleAccessTokenGenerator(
            email.id,
            email._json.email, 
            email.displayName
        );

        console.log('google_access_token :', google_access_token);

        return done(null, email);
    }
));

router.get('/google',
    passport.authenticate('google', { 
        scope: ['profile', 'email'] 
    }));

router.get('/google/callback',
	passport.authenticate('google', {
        failureRedirect: '/auth/login', 
        successRedirect: '/auth/'
    })
);

/**
 * test
 */

// 로그인 안되어있으면 튕구기 미들웨어
const authenticateUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(301).redirect('/auth/login');
    }
};

router.get(
    '/', 
    authenticateUser,
    async (req, res) => { 

    const googleid = req.user.id;
    const googleemail = req.user._json.email;
    const googlename = req.user.displayName;

    const content = 'login success<br>'+ 
    googleemail + '<br>' + 
    googleid + '<br>' + 
    googlename;

    res.send(content);
});

router.get('/login', (req, res) => { 
    const content = '<a href = "/auth/google">google login</a>'
    res.send(content);
});

module.exports = router;