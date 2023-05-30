module.exports = (app) => {

    const tour = require('../controller/tour.controller');
    var { authJwt } = require("../middleware");
    // Получение всех пользователей
    app.post("/api/addTour", [authJwt.verifyToken], tour.addTour);

    app.get("/api/listTours", tour.findAll);

    app.post("/api/deleteTour/:tour_id",  [authJwt.verifyToken],tour.delete);

    app.post("/api/updateTour/:id", [authJwt.verifyToken], tour.update);

    app.get("/api/tour/:id", [authJwt.verifyToken], tour.findById);
    

};