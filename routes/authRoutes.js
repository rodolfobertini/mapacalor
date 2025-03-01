const express = require('express');
const moment = require('moment-timezone');
const { gerarLoginPage, gerarErroLoginPage } = require('../components/loginComponent');

const router = express.Router();

// Middleware de autenticação
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
}

// Rota de login com formulário melhorado
router.get('/login', (req, res) => {
    res.send(gerarLoginPage());
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const dataHora = moment().tz('America/Fortaleza').format('DD/MM/YY - HH:mm:ss');
    const ip = req.ip;
    const os = req.useragent.os;
    const browser = req.useragent.browser;
    console.log(`[${dataHora}] Tentativa de login: username=${username}, password=${password}, ip=${ip}, os=${os}, browser=${browser}`);
    // Verificar credenciais (usando admin/admin como exemplo)
    if (username === process.env.MP_LOGIN && password === process.env.MP_SENHA) {
        req.session.user = username;
        res.redirect('/map');
    } else {
        res.send(gerarErroLoginPage());
    }
});

// Rota de logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = { router, isAuthenticated };
