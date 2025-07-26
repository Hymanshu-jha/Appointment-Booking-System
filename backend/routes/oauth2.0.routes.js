import express from 'express';
import { consentPageCallbackHandler, googleAuthPageRedirector, getMe } 
from '../controllers/oauth2.0.controllers.js';
import authorize from '../middlewares/authorize.middlewares.js';
const OAuth2Router = express.Router();


OAuth2Router.get('/auth/google', googleAuthPageRedirector);
OAuth2Router.get('/oauth2callback', consentPageCallbackHandler);
OAuth2Router.get('/me', authorize, getMe);

export default OAuth2Router;

