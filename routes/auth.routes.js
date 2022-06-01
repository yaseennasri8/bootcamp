const routes = require('express').Router();
const controller = require('../controllers/auth.controller');
const { verifyAccessToken } = require('../middleWare/verifyAccessToken');

routes.post('/signup', controller.createUsers);
routes.post('/login', controller.login);
routes.post('/change-password', verifyAccessToken, controller.changePassword);
routes.post('/forgot-password', controller.forgotPassword);
routes.post('/reset-password', controller.resetPassword);
routes.post('/check', controller.checkPollution);

module.exports = routes;