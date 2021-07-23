const Sequelize = require('sequelize');

const password = 'H*&Pb*B664w##uZaf2'

const sequelize = new Sequelize('hapi_tutorial', 'root', password, {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
});

module.exports.connect = sequelize;

// module.exports.getUsers = async function() {
//     try {
//         await sequelize.authenticate();
//         console.log("Connected!")
//         const [results, metadata] = await sequelize.query('SELECT * FROM users');
//         // console.log(results)
//         return results;
//         // const [results2, metadata2] = await sequelize.query('UPDATE users SET username = "Bob" WHERE password = "soccer"');
//         // console.log(metadata2)
//     } catch (e) {
//         console.log("Can't connect to database :(")
//     }
// }