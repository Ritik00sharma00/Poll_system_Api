const jwt=require('jsonwebtoken');

const  generateToken=(payload)=>
{ 
    return   jwt.sign(payload,secret_key,{expiresIn:'1h'})
}

const verifyToken=(token)=>
    {
        try{
            
        jwt.verify(token,secret_key);

        }

        catch(err)
        {
            return null;
        }

    }


    module.exports = { generateToken, verifyToken };