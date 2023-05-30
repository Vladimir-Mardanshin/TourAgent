module.exports = (app) => {

    const ticket = require('../controller/ticket.controller');
    var { authJwt } = require("../middleware");
    
    app.post("/api/addTicket", [authJwt.verifyToken], ticket.create);

    app.get("/api/listTickets", ticket.findAll);

    app.post("/api/deleteTicket/:id",  [authJwt.verifyToken],ticket.delete);

    app.post("/api/updateTicket/:id", [authJwt.verifyToken], ticket.update);

    app.get("/api/ticket/:id",  [authJwt.verifyToken],ticket.findById);


};