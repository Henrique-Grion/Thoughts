const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
    database: 'thoughts',
    host: 'localhost',
    username: 'root',
    password: '',
    dialect: 'mysql'
})

try {
    sequelize.authenticate();
    console.log('Connected to database...');
} catch (err) {
    console.log('Database Error: ' + err);
}

module.exports = sequelize