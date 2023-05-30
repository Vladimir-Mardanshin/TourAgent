var db = require('../config/db.config.js');
var globalFunctions = require('../config/global.functions.js');
var Sale= db.sale;
var User = db.user;
var Ticket = db.ticket;

exports.createSaleAndUpdateBalance = (req, res) => {
  const { user_id, tour_id, order_date, cost,amount } = req.body;
  let createdSale; // Переменная для хранения созданной записи Sale

  Sale.build({
    user_id: user_id,
    tour_id: tour_id,
    order_date: order_date,
    cost: cost
  })
    .save()
    .then((sale) => {
      createdSale = sale;

      return User.findByPk(user_id); // Находим пользователя по его id
    })
    .then((user) => {
      if (!user) {
        throw new Error('Пользователь не найден');
      }

      // Прибавляем значение к балансу пользователя
      user.balance -= amount;

      return user.save(); // Сохраняем изменения в базе данных
    })
    .then((updatedUser) => {
      const result = {
        message: 'Запись в таблице Sale создана и баланс пользователя обновлен',
        sale: createdSale,
        user: updatedUser
      };
      globalFunctions.sendResult(res, result);
    })
    .catch((err) => {
      globalFunctions.sendError(res, err);
    });
};

exports.createSaleAndUpdateBalanceT = async (req, res) => {
  try {
    const { user_id, ticket_id, order_date, cost, amount } = req.body;

    const sale = await Sale.build({
      user_id: user_id,
      ticket_id: ticket_id,
      order_date: order_date,
      cost: cost
    }).save();

    const user = await User.findByPk(user_id);
    if (!user) {
      throw new Error('Пользователь не найден');
    }

    user.balance -= amount;
    await user.save();

    const ticket = await Ticket.findByPk(ticket_id);
    if (!ticket) {
      throw new Error('Билет не найден');
    }

    if (ticket.count === 0) {
      throw new Error('Нет доступных билетов');
    }

    ticket.count -= 1;
    ticket.cost *= 1.01;
    await ticket.save();

    const result = {
      message: 'Запись в таблице Sale создана, баланс пользователя обновлен, и количество билетов уменьшено',
      sale: sale,
      user: user,
      ticket: ticket
    };
    globalFunctions.sendResult(res, result);
  } catch (error) {
    globalFunctions.sendError(res, error);
  }
};

exports.findAllSales = (req, res) => {
  const userId = req.params.userId;

  db.sequelize.query(`
      SELECT 
      sale.id, 
      sale.tour_id, 
      sale.ticket_id, 
      CASE
        WHEN sale.tour_id IS NOT NULL THEN tour.name
        ELSE NULL
      END AS tour_name, 
      ticket.flight_number, 
      ticket.departure_city, 
      ticket.arrival_city, 
      sale.cost AS sale_cost, 
      ticket.count, 
      ticket.departure_date, 
      ticket.departure_time, 
      ticket.arrival_date, 
      ticket.arrival_time, 
      tour.start_date, 
      tour.end_date,
      tour.cost AS tour_cost,
      CASE
        WHEN (sale.tour_id IS NOT NULL AND tour.start_date < NOW()) THEN 1
        WHEN (sale.ticket_id IS NOT NULL AND ticket.departure_date < NOW()) THEN 1
        ELSE 0
      END AS is_expired
    FROM sale
    LEFT OUTER JOIN ticket ON sale.ticket_id = ticket.id
    LEFT OUTER JOIN tour ON sale.tour_id = tour.id
    WHERE sale.user_id = :userId;
  `,
  {
    type: db.sequelize.QueryTypes.SELECT,
    replacements: { userId: userId } // подстановка параметров
  })
  .then(objects => {
    globalFunctions.sendResult(res, objects);
  })
  .catch(err => {
    globalFunctions.sendError(res, err);
  })
};





  
