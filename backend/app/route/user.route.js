module.exports = (app) => {

    const user = require('../controller/user.controller');
    var { authJwt } = require("../middleware");
    // Получение всех пользователей
    app.get("/api/users", [authJwt.verifyToken], user.findAll);

    app.put("/api/updateBalance", [authJwt.verifyToken], user.updateBalance);

    app.get('/api/user/:id',[authJwt.verifyToken], user.findById);
};