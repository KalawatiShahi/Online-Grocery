import jwt from 'jsonwebtoken';

const authSeller = async (req, res, next)=>{
     const { sellerToken } = req.cookies;

     if(!sellerToken){
        return res.json({success: false, message: 'Not Authorized'});
     }
      try {
            const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET)
            if(tokenDecode.email === process.env.SELLER_EMAIL){
                next()
            }else{
                return res.json({success: false, message: 'Not Authorized'});
            }
         } catch (error) {
             return res.status(401).json({ success: false, message: 'Invalid or expired token', error: error.message });
         }
}

export default  authSeller;