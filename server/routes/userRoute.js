import express from 'express';
import { isAuth, login, logout, register } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js'; 


const userRouter = express.Router();

userRouter.post('/register', register);    // ✅ Good
userRouter.post('/login', login);          // ✅ Good
userRouter.get('/is-auth', authUser, isAuth); // ✅ Good - protected route
userRouter.get('/logout', authUser, logout);  // ✅ Good - protected route

export default userRouter;