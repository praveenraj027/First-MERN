var jwt = require('jsonwebtoken');
const JWT_SECRET = "Piyaisperfectinallaspects";



const fetchuser = (req, res, next)=>{
// Get the user from the jwt token and add the id to req obj
const token = req.header('auth-token');
if(!token){
    res.status(401).send({error: "Please authenticate using a valid token"});

}
try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next()


} catch (error) {
    res.status(401).send({error: "Plaese authenticate usinf a valid token"})
}
    
}


module.exports = fetchuser;