const mongoose = require('../database');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({

    nome:{
        type: String,
        require: true,
    },

    sobrenome:{
        type: String,
        require: true,
    },

    cpf:{
        type: Number,
        require: true,
    },

    rg:{
        type: Number,
        require: true,
    },

    dtNascimento:{
        type: Date,
        require: true,
    },

    telefone:{
        type: Number,
        require: true,
    },

    email:{
        type: String,
        unique: true,
        require: true,
        lowercase: true
    },

    senha:{
        type: String,
        require: true,
        select: false,
    },

    criadoem:{
        type: Date,
        default: Date.now,
    },
});

UserSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.senha, 10);
    this.senha = hash;

    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;