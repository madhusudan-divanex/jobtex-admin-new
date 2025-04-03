import jwt from 'jsonwebtoken'

const verify=(req,res,next)=>{
    const token=req.header('Token')
    if(!token){
        return res.status(401).json({message:"token required",success:false})
    }
  try{
        const decodeUser=jwt.verify(token,process.env.SECRET_KEY)
         req.user=decodeUser
         next();
        } catch (error) {
            console.log('error'+error)
            return res.status(401).json({ message: "Token verification unsuccessful",chat:error, success: false });
          }

}

export default verify