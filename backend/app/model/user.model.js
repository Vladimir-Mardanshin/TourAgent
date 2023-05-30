module.exports = (sequelize, Sequelize) => {
    var User = sequelize.define(
        'user', // определяем имя таблицы
        {
            id: {
                type: Sequelize.INTEGER, // тип данных INTEGER
                autoIncrement: true, // включение автоматической нумерации
                primaryKey: true, // поле является первичным ключом
                allowNull: false // настройка allowNull со значением false запрещает запись в поле значений NULL (для поля с настройкой автоинкремента можно не указывать)
            },
            firstname: {
                type: Sequelize.STRING(50), // тип данных STRING (в MySQL — VARCHAR)
                allowNull: false
            },
            lastname: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            patronymic: {
                type: Sequelize.STRING(50),
                allowNull: true
            },
            email: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            password: {
                type: Sequelize.STRING(200),
                allowNull: false
            },
            role: {
                type: Sequelize.ENUM,
                values: ['Пользователь', 'Администратор'],
                allowNull: false
            },
            phone: {
                type: Sequelize.STRING(50),
                allowNull: true
            },
            balance: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0
            },
        });

    // Определяем связи таблицы user с другими таблицами
    User.associate = (models) => {
        // Определение связи один-к-одному с таблицей abiturient. Это определение связи с одной стороны.
        // Связь также определена со второй стороны (со стороны модели abiturient): в файле abiturient.model.js
        User.hasMany(models.sale, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            sourceKey: 'id'
        });
        User.hasMany(models.review, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            sourceKey: 'id'
        });

    };

    // если в базе данных в таблице пользователей нет ни одной записи, то при запуске приложения будет создан пользователь с правами администратора
    User.findAll()
        .then(objects => {
            if (objects.length === 0){
                User.create({
                    firstname: 'Баха',
                    lastname: 'Джангиров',
                    email: 'admin@gmail.com',
                    password: "$2a$10$XmJkVaW14XTUG7CtSMjh/eBChTaaSKr/5sFXqISgpbRNmm2XcM1U6",
                    role: 2
                });
            }
        })
        .catch(err => {
            console.log(err)
        })
    return User;
};