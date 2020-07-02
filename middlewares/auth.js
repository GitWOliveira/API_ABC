const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader)
        return res.status(401).send({error:'O token não foi informado'});
 
    //Formato do token Bearer+hash
    //Fazendo a validação se o token que recebemos está correto
    //splita o que for recebido
    const parts = authHeader.split(' ');

    //verifica se tem 2 partes
    if(!parts.length == 2)
        return res.status(401).send({ error:'Erro no token'});
    
    //Se sim armazena as tuas partes do array
    const [scheme, token] = parts;

    //IF com "Rejects" / começa a rejects 
    //^ indica o inicio da verificação
    //Bearer é a palavra que estamos procurando no inicio
    //$ final da verificação e i para insenssitive
    if(!/^Bearer$/i.test(scheme))
        return res.status(401).send({ error: 'token mal formatado'});

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if(err) return res.status(401).send({error: 'Token invalido'});

    req.userId = decoded.id;
    return next();
    });
};

