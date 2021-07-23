const Sequelize = require('sequelize');

const password = 'H*&Pb*B664w##uZaf2'

const sequelize = new Sequelize('hapi_tutorial', 'root', password, {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
});

sequelize.authenticate().then(() => {
    console.log('Connected!');
}).catch(err => {
    console.log('Could not connect :(');
})