var db = require('../config/db.config.js');
var globalFunctions = require('../config/global.functions.js');
var Review = db.review;
var Sale= db.sale;
var User = db.user;

exports.findAll = (req, res) => {
  Sale.findAll({
    include: [
      {
        model: Review,
        include: {
          model: User,
          attributes: ['email']
        },
      },
    ],
    where: { tour_id: req.params.tourId }
  })
    .then((sales) => {
      globalFunctions.sendResult(res, sales);
    })
    .catch((err) => {
      globalFunctions.sendError(res, err);
    });
};

exports.findAllReviews = (req, res) => {
  const userId = req.params.userId;
  Review.findAll({
    where: { user_id: userId }
  })
      .then(objects => {
          globalFunctions.sendResult(res, objects);
      })
      .catch(err => {
          globalFunctions.sendError(res, err);
      })
};


exports.create = (req, res) => {
  const userId = req.body.user_id;
  const saleId = req.body.sale_id;
  const userRole = req.body.user_role; // Assuming the user's role is provided in the request

  // Check if the user is an administrator
  if (userRole === 'Администратор') {
    // Create the review without checking the sale record
    Review.create({
      user_id: userId,
      sale_id: saleId,
      rating: req.body.rating,
      description: req.body.description,
      date: req.body.date
    })
      .then(object => {
        globalFunctions.sendResult(res, object);
      })
      .catch(err => {
        globalFunctions.sendError(res, err);
      });
  } else {
    // User is not an administrator, check if there is a sale record for the user and tour
    Sale.findOne({
      where: {
        id: saleId,
        user_id: userId
      }
    })
      .then(sale => {
        if (sale) {
          Review.create({
            user_id: userId,
            sale_id: saleId,
            rating: req.body.rating,
            description: req.body.description,
            date: req.body.date
          })
            .then(object => {
              globalFunctions.sendResult(res, object);
            })
            .catch(err => {
              globalFunctions.sendError(res, err);
            });
        } else {
          globalFunctions.sendError(res, 'Для оставления комментария необходимо приобрести данный тур');
        }
      })
      .catch(err => {
        globalFunctions.sendError(res, err);
      });
  }
};

  
exports.update = (req, res) => {
    Review.update(
      {
        user_id: req.body.user_id,
        sale_id: req.body.sale_id,
        rating: req.body.rating,
        description: req.body.description,
        date: req.body.date
      },
      {
        where: {
          id: req.params.id
        }
      }
    )
      .then(object => {
        globalFunctions.sendResult(res, object);
      })
      .catch(err => {
        globalFunctions.sendError(res, err);
      });
  };
  
exports.delete = (req, res) => {
    Review.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(() => {
        globalFunctions.sendResult(res, 'Запись удалена');
      })
      .catch(err => {
        globalFunctions.sendError(res, err);
      });
  };

exports.findByTourId = (req, res) => {
    const tourId = req.params.id;
    Review.findAll({
      include: [
        {
          model: Sale,
          where: { tour_id: tourId },
          include: [{ model: User, attributes: ['email'] }]
        }
      ],
      attributes: ['description', 'rating','date'],
      raw: true
    })
      .then(reviews => {
        globalFunctions.sendResult(res, reviews);
      })
      .catch(err => {
        globalFunctions.sendError(res, err);
      });
  };

  exports.findUserComments = (req, res) => {
    const userId = req.params.userId;
    Review.findAll({
      where: { user_id: userId },
      raw: true
    })
      .then(comments => {
        globalFunctions.sendResult(res, comments);
      })
      .catch(err => {
        globalFunctions.sendError(res, err);
      });
  };
  
  
  
  