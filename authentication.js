const jwt = require('jsonwebtoken');

let users = {
    john: { password: "123456" },
    mary: { password: "123456" }
}



exports.login = (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    console.log(users[username].password);
    if(!username || !password || users[username].password !== password){
        return res.status(401).send();
    }

    let payload = { username };

    let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { algorithm: "HS256", expiresIn: '120' });
    
    let refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { algorithm: "HS256", expiresIn: process.env.REFRESH_TOKEN_LIFE });

    users[username].refreshToken = refreshToken;

    return res.status(200).json({
        token: accessToken
    })
    
}

exports.refresh = (req, res) => {
    let accessToken = req.headers.token

    console.log(accessToken);
    if(!accessToken){
        return res.status(403).send();
    }

    let payload;

    try{
        payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        
        next();
    }
    catch(e){
        return res.status(401).send();
    }

    let refreshToken = users[payload.username].refreshToken;

    try{
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    }catch(e){
        return res.status(401).send();
    }

    let newToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: process.env.ACCESS_TOKEN_LIFETIME
    })

    return res.status(200).json({
        token: newToken
    })
}