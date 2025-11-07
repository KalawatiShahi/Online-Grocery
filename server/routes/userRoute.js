import express from 'express';
import { isAuth, login, logout, register } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js'; 


const userRouter = express.Router();

userRouter.post('/register', register);    
<<<<<<< HEAD
userRouter.post('/login', login);         
userRouter.get('/is-auth', authUser, isAuth); 
userRouter.get('/logout', authUser, logout);  
=======
userRouter.post('/login', login);          
userRouter.get('/is-auth', authUser, isAuth); 
userRouter.get('/logout', authUser, logout); 
>>>>>>> a4d3dba (remove comment)

export default userRouter;
