module.exports = (sequelize, Sequelize) => {
    var Sale = sequelize.define(
        'sale', // определяем имя таблицы
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
            tour_id: {
                type: Sequelize.INTEGER, // тип данных STRING (в MySQL — VARCHAR)
                allowNull: true
            },
            ticket_id: {
                type: Sequelize.INTEGER, // тип данных STRING (в MySQL — VARCHAR)
                allowNull: true
            },
            order_date: {
                type: Sequelize.DATE,
                allowNull: false
            },
            cost: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
        });

    // Определяем связи таблицы abiturient с другими таблицами
    Sale.associate = (models) => {

        // Определение связи один-ко-многим с таблицей exam. Это определение связи с одной стороны.
        // Связь также определена со второй стороны (со стороны модели exam): в файле exam.model.js
        Sale.belongsTo(models.user, {
            foreignKey: 'user_id'
        });

        // Определение связи один-ко-многим с таблицей achievement. Это определение связи с одной стороны.
        // Связь также определена со второй стороны (со стороны модели achievement): в файле achievement.model.js
        Sale.belongsTo(models.tour, {
            foreignKey: 'tour_id'
        });

        Sale.belongsTo(models.ticket, {
            foreignKey: 'ticket_id'
        });

        Sale.hasOne(models.review, {
            foreignKey: 'sale_id',
            onDelete: 'CASCADE'
        });
    };
    return Sale;
};