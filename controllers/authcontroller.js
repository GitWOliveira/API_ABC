const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth');

const User = require('../models/User');

const router = express.Router();

function generateToken(params ={}){
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
};

//Processos de registo de um novo usuário recebidos por POST
//de um site externo
router.post('/register', async (req, res) => {

    const {email} = req.body;
    
    try{
        //Se já existe o e-mail retorna o e-mail
        if (await User.findOne({email}))
            return res.status(400).send({error: "Usuário já existe"});

        const user = await User.create(req.body);
        
        user.senha = undefined;

        return res.send({
            user,
        });

    } catch(err){
        return res.status(400).send({ error: 'Registration failed'});
    }
});

//autenticação das credências cadstradas para acesso ao site
router.post('/authenticate', async (req, res) => {

    const{ email, senha} = req.body;

    const user = await User.findOne({ email }).select('+senha');

    //validações de senha/usuário
    if(!user)
        return res.status(400).send({error: "Usuário não localizado"});

    if(!await bcrypt.compare(senha, user.senha))
        return res.status(400).send({error: 'Senha inválida'});

    user.senha = undefined;

    //validação do token utilizando o id do usuário(geração pelo banco)
    //e o secret do auth.json e expira em 1 dia(86400s)
    const token = res.send({
        user, 
        token: generateToken({ id:user.id}),
    });
});

module.exports = app => app.use('/auth', router);