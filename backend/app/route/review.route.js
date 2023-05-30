module.exports = (app) => {

    const review = require('../controller/review.controller');
    var { authJwt } = require("../middleware");

    app.get('/api/reviews/:tourId',[authJwt.verifyToken],review.findAll);
    app.get('/api/findAllReviews/:userId',[authJwt.verifyToken],review.findAllReviews);
    app.post('/api/addReview', [authJwt.verifyToken],review.create);

    app.post('/api/updateReview/:id', [authJwt.verifyToken],review.update);

    app.post('/api/deleteReview/:id', [authJwt.verifyToken],review.delete);

    app.get('/api/review/:id', review.findByTourId);

    app.get('/api/findUserComments/:userId', [authJwt.verifyToken],review.findUserComments);

};