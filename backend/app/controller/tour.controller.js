var db = require('../config/db.config.js');
var globalFunctions = require('../config/global.functions.js');
var Tour = db.tour;
var Tour_img = db.tour_img;
var fs = require('fs');

exports.addTour = (req, res) => {
    Tour.create({
        name: req.body.name,
        description: req.body.description,
        cost: req.body.cost,
        start_date: req.body.start_date,
        end_date: req.body.end_date
    }).then(object => {
        globalFunctions.sendResult(res, object);
    }).catch(err => {
        globalFunctions.sendError(res, err);
    })
};

exports.findAll = (req, res) => {
    Tour.findAll({
        // where: {
        //     tour_id: req.body.tour_id
        // },
        include: [
            {
                model: Tour_img,
                required: false
            }
        ]
    })
        .then(tour => {
            console.log(tour)
            const results = tour.map(tour => ({
                id: tour.id,
                name: tour.name,
                description: tour.description,
                start_date: tour.start_date,
                end_date: tour.end_date,
                cost: tour.cost,
                tour_imgs: tour.tour_imgs
            }));
            globalFunctions.sendResult(res, results);
        })
        .catch(err => {
            globalFunctions.sendError(res, err);
        });
};


exports.delete = (req, res) => {
  // Удаление изображений, связанных с туром
  Tour_img.findAll({
    where: {
      tour_id: req.params.tour_id,
    },
    attributes: ['link'], // Получить только атрибут 'link'
  })
    .then((images) => {
      // Удаление изображений и связанных файлов
      for (const image of images) {
        const filePath = `files/${image.link}`;
        // Проверяем, существует ли файл перед удалением
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // Удаление файла
        }
      }
      // Удаление самого тура
      return Tour.destroy({
        where: {
          id: req.params.tour_id,
        },
      });
    })
    .then(() => {
      globalFunctions.sendResult(res, 'Тур и связанные с ним изображения удалены');
    })
    .catch((err) => {
      globalFunctions.sendError(res, err);
    });
};

exports.update = (req, res) => {
    Tour.update(
      { name: req.body.name,
        description: req.body.description,
        cost: req.body.cost,
        start_date: req.body.start_date,
        end_date: req.body.end_date 
      },
      {
        where: { 
            id: req.params.id 
        },
      }
    )
      .then(() => {
        globalFunctions.sendResult(res, 'Данные тура успешно обновлены');
      })
      .catch((err) => {
        globalFunctions.sendError(res, err);
      });
  };

exports.findById = (req, res) => {
    Tour.findByPk(req.params.id)
        .then(object => {
            globalFunctions.sendResult(res, object);
        })
        .catch(err => {
            globalFunctions.sendError(res, err);
        })
};
  



