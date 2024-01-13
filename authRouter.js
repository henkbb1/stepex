const Router = require('express');
const router = new Router();
const controller = require('./authController');
const {check} = require('express-validator');
const authMiddleware = require('./middlewares/authMiddleware');
const rolesMiddleware = require('./middlewares/rolesMiddleware');


router.post('/registration', [
        check('username', 'Имя пользователя не может пустым').notEmpty(),
        check(
            'password', 
            'Пароль должен быть от 4 до 8 символов'
        ).isLength({min: 4, max: 8})
    ],   
    controller.registration
);
router.post('/login', controller.login);
router.get('/getUsers', rolesMiddleware(["ADMIN"]), controller.getUsers);

module.exports = router;