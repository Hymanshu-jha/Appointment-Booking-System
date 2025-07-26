import express from "express";
import { 
    signup,
    login,
    logout,
    mailVerify
 } from "../controllers/users.controllers.js";
import authorize from "../middlewares/authorize.middlewares.js";
const userRouter = express.Router();


userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.post('/logout', authorize, logout);
userRouter.get('/mailverify', mailVerify);

export default userRouter;