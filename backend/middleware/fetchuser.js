
var jwt = require('jsonwebtoken');

const JSWKey = 'shhhhh';
const fetchuser = (req,res,next)=>{
    try {
        const token = req.header('auth-token');
        if(!token){
            res.status(401).send({error:"auth denied"});
        }
        const data = jwt.verify(token, JSWKey);
        req.user = data.user;

        next();
    } catch (error) {
        res.status(401).send({error:"Please authenticate using a valid token"})
    }
}
module.exports = fetchuser;