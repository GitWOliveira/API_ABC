const mongoose = require('../database');
const bcrypt = require('bcryptjs');

const NutricionistaSchema = new mongoose.Schema({

    crn:{
        type: Number,
        require:true,
    },
    
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        require: true,
    },

    listaPacientes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Paciente',
    }],

    criadoem:{
        type: Date,
        default: Date.now,
    },
});

const Nutricionista = mongoose.model('Nutricionista', NutricionistaSchema);

module.exports = Nutricionista;