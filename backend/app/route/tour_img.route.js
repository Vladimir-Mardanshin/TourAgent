module.exports = (app) => {

    const tour_img = require('../controller/tour_img.controller');
    var { authJwt } = require("../middleware");

    app.post('/api/addTourImg',  [authJwt.verifyToken],tour_img.addTourImg);
    app.post('/api/deleteImg/:id',  [authJwt.verifyToken],tour_img.delete);
};