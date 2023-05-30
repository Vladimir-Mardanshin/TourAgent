module.exports = (sequelize, Sequelize) => {
    var Ticket = sequelize.define(
        'ticket', // определяем имя таблицы
        {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            flight_number: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            departure_city: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            arrival_city: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            cost: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
            count: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            departure_date: {
                type: Sequelize.DATE,
                allowNull: true
            },
            departure_time: {
                type: Sequelize.TIME,
                allowNull: true
            },
            arrival_date: {
                type: Sequelize.DATE,
                allowNull: true
            },
            arrival_time: {
                type: Sequelize.TIME,
                allowNull: true
            },
        });

    // Определяем связи таблицы abiturient с другими таблицами
    Ticket.associate = (models) => {

        // Определение связи один-ко-многим с таблицей exam. Это определение связи с одной стороны.
        // Связь также определена со второй стороны (со стороны модели exam): в файле exam.model.js

        // Определение связи один-ко-многим с таблицей achievement. Это определение связи с одной стороны.
        // Связь также определена со второй стороны (со стороны модели achievement): в файле achievement.model.js
        Ticket.hasMany(models.sale, {
            foreignKey: 'ticket_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            sourceKey: 'id'
        });
    };
    return Ticket;
};