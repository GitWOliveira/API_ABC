const mongoose = require('../database');
const bcrypt = require('bcryptjs');

const PacienteSchema = new mongoose.Schema({
    /*peso:{
        type: Number,
        require: true,
    },

    altura:{
        type: Number,
        require: true,
    },

    indiceMassa:{
        type: Number,
        require: true,
    },

    indiceGordura:{
        type: Number,
        require: true,
    },
    **/
    idade:{
        type: Number,
        require: true,
    },

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        require: true,
    },

    criadoem:{
        type: Date,
        default: Date.now,
    },
});

const Paciente = mongoose.model('Paciente', PacienteSchema);

module.exports = Paciente;