var db = require('../config/db.config.js');
var globalFunctions = require('../config/global.functions.js');
var User = db.user;

// Получение списка всех абитуриентов
exports.findAll = (req, res) => {
    User.findAll()
    .then(objects => {
        globalFunctions.sendResult(res, objects);
    })
    .catch(err => {
        globalFunctions.sendError(res, err);
    })
};

exports.updateBalance = (req, res) => {
  const { userId, amount } = req.body;

  User.findByPk(userId)
    .then(user => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь не найден' });
        return;
      }

      // Преобразуем amount в число и прибавляем его к балансу пользователя
      user.balance = Number(amount)+Number(user.balance);

      // Сохраняем изменения в базе данных
      return user.save();
    })
    .then(updatedUser => {
      const result = {
        message: 'Баланс пользователя обновлен',
        user: updatedUser
      };
      globalFunctions.sendResult(res, result);
    })
    .catch(err => {
      globalFunctions.sendError(res, err);
    });
};

exports.findById = (req, res) => {
  User.findByPk(req.params.id)
      .then(object => {
          globalFunctions.sendResult(res, object);
      })
      .catch(err => {
          globalFunctions.sendError(res, err);
      })
};

