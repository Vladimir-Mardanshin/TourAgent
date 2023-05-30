module.exports = (sequelize, Sequelize) => {
    var Review = sequelize.define(
        'review', // определяем имя таблицы
        {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            user_id: {
                type: Sequelize.INTEGER, // тип данных STRING (в MySQL — VARCHAR)
                allowNull: false
            },
            sale_id: {
                type: Sequelize.INTEGER, // тип данных STRING (в MySQL — VARCHAR)
                allowNull: true
            },
            rating: {
                type: Sequelize.INTEGER,
                allowNull: true,
                validate: {
                     min: 1,
                     max: 5
                }
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            date: {
                type: Sequelize.DATE,
                allowNull: false,
            }
        });

    // Определяем связи таблицы abiturient с другими таблицами
    Review.associate = (models) => {

        // Определение связи один-ко-многим с таблицей exam. Это определение связи с одной стороны.
        // Связь также определена со второй стороны (со стороны модели exam): в файле exam.model.js
        Review.belongsTo(models.user, {
            foreignKey: 'user_id'
        });

        // Определение связи один-ко-многим с таблицей achievement. Это определение связи с одной стороны.
        // Связь также определена со второй стороны (со стороны модели achievement): в файле achievement.model.js
        Review.belongsTo(models.sale, {
            foreignKey: 'sale_id'
        });

    };
    return Review;
};