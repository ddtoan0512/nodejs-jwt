const jwt = require('jsonwebtoken');

exports.verify = (req, res, next) => {
    let accessToken = req.headers.token

    console.log(accessToken);
    if(!accessToken){
        return res.status(403).send('403');
    }

    let payload;

    try{
        payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        next();
    }
    catch(e){
        console.log(e)
        return res.status(401).send('401');
    }
}