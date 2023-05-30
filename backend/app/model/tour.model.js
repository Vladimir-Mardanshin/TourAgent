module.exports = (sequelize, Sequelize) => {
    var Tour = sequelize.define(
        'tour', // определяем имя таблицы
        {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            cost: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
            start_date: {
                type: Sequelize.DATE,
                allowNull: true
            },
            end_date: {
                type: Sequelize.DATE,
                allowNull: true
            }
        });

    // Определяем связи таблицы abiturient с другими таблицами
    Tour.associate = (models) => {

        // Определение связи один-ко-многим с таблицей exam. Это определение связи с одной стороны.
        // Связь также определена со второй стороны (со стороны модели exam): в файле exam.model.js

        // Определение связи один-ко-многим с таблицей achievement. Это определение связи с одной стороны.
        // Связь также определена со второй стороны (со стороны модели achievement): в файле achievement.model.js
        Tour.hasMany(models.sale, {
            foreignKey: 'tour_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            sourceKey: 'id'
        });

        Tour.hasMany(models.tour_img, {
            foreignKey: 'tour_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            sourceKey: 'id'
        });
    };
    return Tour;
};