var db = require('../config/db.config.js');
var globalFunctions = require('../config/global.functions.js');
var multiparty = require('multiparty');
var fs = require('fs');
var uuid = require('uuid');
var TourImg = db.tour_img;

exports.addTourImg = async (req, res) => {
    // создаём объект для чтения данных, переданных со стороны клиента (передавали объект FormData)
    var form = new multiparty.Form();

    // читаем данные
    await form.parse(req, async (err, fields, files) => {
        if (!err) {
            var mimeType = files.file[0].headers['content-type']; // тип файла указывается так: image/png
            expansion = mimeType.split('/')[1]; // из "image/png" нужно извлечь только расширение

            var newName = uuid.v4() + "." + expansion; // вызываем функцию v4() для того, чтобы уникальный идентификатор был сгенерирован случайным образом
            var link = './files/' + newName;

            await fs.rename(files.file[0].path, link, (err) => {
                if (err) {
                    throw err;
                }
            });
            var tour_id = fields.tour_id [0];
            TourImg.create({
                tour_id: tour_id,
                link: newName,
                mime_type: mimeType
            }).then(object => {
                globalFunctions.sendResult(res, object);
            }).catch(err => {
                globalFunctions.sendError(res, err);
            })
        }
        else{
            globalFunctions.sendError(res, err);
        }
    });
};

exports.delete = (req, res) => {
  TourImg.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((image) => {
      if (!image) {
        return res.status(404).send('Изображение не найдено');
      }

      // Удаление файла из директории files
      const filePath = `files/${image.link}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Ошибка при удалении файла');
        }

        // Удаление записи из базы данных
        image.destroy()
          .then(() => {
            globalFunctions.sendResult(res, 'Изображение удалено');
          })
          .catch((err) => {
            globalFunctions.sendError(res, err);
          });
      });
    })
    .catch((err) => {
      globalFunctions.sendError(res, err);
    });
};

