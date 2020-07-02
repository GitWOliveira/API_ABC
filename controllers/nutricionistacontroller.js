const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Paciente = require('../models/paciente');
const Nutricionista = require('../models/nutricionista');


const router = express.Router();

router.use(authMiddleware);

//listar nutri existentes
router.get('/', async(req, res) => {
    try {
        //.populate pra utilizar o igrloading para evitar o aumento exponencial de pesquisar de  registros
        //diminuindo apenas para 2 querys 1 para os projetos e outra para todos os usuários, nesse caso
        const nutricionistas = await Nutricionista.find().populate(['user', 'listaPacientes']);
        return res.send({nutricionistas});

    } catch (err) {
        return res.status(400).send({ error: 'Erro no carregamento dos nutricionistas'})
    }
});

//listar nutri por ID
router.get('/:nutricionistaId', async(req, res) => {
    try {
        const nutricionista = await Nutricionista.findById( req.params.nutricionistaId).populate('user');
        return res.send({nutricionista});

    } catch (err) {
        return res.status(400).send({ error: 'Erro no carregamento do nutricionista'})
    }
});

//Rota para criar um novo registro
router.post('/', async(req, res) => {
    try {    
        const { crn, listaPacientes} = req.body;

        const nutricionista = await Nutricionista.create({ crn, user: req.userId });

        //Ira aguardar cada interação abaixo para depois continual
        //com o .save() fora do Pacientes, evitando que não seja relacionado
        await Promise.all(listaPacientes.map(async paciente => {
            const nutricionistaPaciente = new Paciente({ ...paciente, nutricionista: nutricionista._id});
            await nutricionistaPaciente.save();

            nutricionista.listaPacientes.push(nutricionistaPaciente);         
            }
        ));
         
        await nutricionista.save();

        return res.send({nutricionista});

    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Erro na criação do Nutricionista'})
    }
});

//Rota para atualizar o registro
router.put('/:nutricionistaId', async(req, res) => {
    try {    
        const { crn, listaPacientes} = req.body;

        //removendo todos os pacientes associados antes de realizar a atualização
        const nutricionista = await Nutricionista.findByIdAndUpdate(req.params.nutricionistaId,crn,{new:true});
        nutricionista.listaPacientes = [];

        await Paciente.remove({nutricionista: nutricionista._id});

        await Promise.all(listaPacientes.map(async paciente => {
            const nutricionistaPaciente = new Paciente({ ...paciente, nutricionista: nutricionista._id});
            await nutricionistaPaciente.save();

            nutricionista.listaPacientes.push(nutricionistaPaciente);         
            }
        ));
         
        await nutricionista.save();

        return res.send({nutricionista});

    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Erro na atualização do Registro'})
    }
});

//rota para deletrar um registro
router.delete('/:nutricionistaId', async(req, res) => {
    try {
        await Nutricionista.findByIdAndRemove( req.params.nutricionistaId);
        return res.send();

    } catch (err) {
        return res.status(400).send({ error: 'Erro na exclusão do registro'});
    }
});

//definição de rota
module.exports = app => app.use('/nutricionista', router);