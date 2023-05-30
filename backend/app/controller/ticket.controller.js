var db = require('../config/db.config.js');
var globalFunctions = require('../config/global.functions.js');
var Ticket = db.ticket;

exports.findAll = (req, res) => {
    Ticket.findAll()
        .then(objects => {
            globalFunctions.sendResult(res, objects);
        })
        .catch(err => {
            globalFunctions.sendError(res, err);
        })
};

exports.create = (req, res) => {
    // Проверка уникальности flight_number
    Ticket.findOne({ where: { flight_number: req.body.flight_number } })
      .then(existingTicket => {
        if (existingTicket) {
          // Билет с таким flight_number уже существует
          return res.status(400).json({ error: 'Билет с указанным номером рейса уже существует.' });
        }
  
        // Создание нового билета
        Ticket.create({
          flight_number: req.body.flight_number,
          departure_city: req.body.departure_city,
          arrival_city: req.body.arrival_city,
          cost: req.body.cost,
          count: req.body.count,
          departure_date: req.body.departure_date,
          departure_time: req.body.departure_time,
          arrival_date: req.body.arrival_date,
          arrival_time: req.body.arrival_time,
        })
          .then(object => {
            globalFunctions.sendResult(res, object);
          })
          .catch(err => {
            globalFunctions.sendError(res, err);
          });
      })
      .catch(err => {
        globalFunctions.sendError(res, err);
      });
  };
  
  

exports.update = (req, res) => {
    Ticket.update({
        flight_number: req.body.flight_number,
        departure_city: req.body.departure_city,
        arrival_city: req.body.arrival_city,
        cost: req.body.cost,
        count: req.body.count,
        departure_date: req.body.departure_date,
        departure_time: req.body.departure_time,
        arrival_date: req.body.arrival_date,
        arrival_time: req.body.arrival_time,
        },
        {
            where: {
                id: req.params.id
            }
        }
    ).then(object => {
        globalFunctions.sendResult(res, object);
    }).catch(err => {
        globalFunctions.sendError(res, err);
    })
};

exports.delete = (req, res) => {
    Ticket.destroy({
        where: {
            id: req.params.id
        }
    }).then(() => {
        globalFunctions.sendResult(res, 'Запись удалена');
    }).catch(err => {
        globalFunctions.sendError(res, err);
    });
};

exports.findById = (req, res) => {
    Ticket.findByPk(req.params.id)
        .then(object => {
            globalFunctions.sendResult(res, object);
        })
        .catch(err => {
            globalFunctions.sendError(res, err);
        })
};
