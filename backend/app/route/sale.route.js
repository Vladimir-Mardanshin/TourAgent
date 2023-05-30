module.exports = (app) => {

    const sale = require('../controller/sale.controller');
    var { authJwt } = require("../middleware");
    // Получение всех пользователей

    app.post("/api/createSale", [authJwt.verifyToken],sale.createSaleAndUpdateBalance);

    app.post("/api/createSaleT", [authJwt.verifyToken],sale.createSaleAndUpdateBalanceT);

    app.get("/api/findAllSales/:userId",  [authJwt.verifyToken],sale.findAllSales);

};