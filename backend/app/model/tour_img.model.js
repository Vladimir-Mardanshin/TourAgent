module.exports = (sequelize, Sequelize) => {
    var Tour_img = sequelize.define(
        'tour_img', // определяем имя таблицы
        {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            tour_id: {
                type: Sequelize.INTEGER, // тип данных STRING (в MySQL — VARCHAR)
                allowNull: false
            },
            link: {
                type: Sequelize.STRING(200)
            },
            mime_type: {
                type: Sequelize.STRING(25)
            }
        });

    // Определяем связи таблицы abiturient с другими таблицами
    Tour_img.associate = (models) => {

        // Определение связи один-ко-многим с таблицей exam. Это определение связи с одной стороны.
        // Связь также определена со второй стороны (со стороны модели exam): в файле exam.model.js
        Tour_img.belongsTo(models.tour, {
            foreignKey: 'tour_id'
        });
    };
    return Tour_img;
};