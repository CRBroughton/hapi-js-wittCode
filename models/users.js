const Connection = require('../dbconfig/');
const { DataTypes } = require('sequelize');

const dbConnection = Connection.connect;

dbConnection.define('users', {
    username: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING
    }
},
{
    freezeTableName: true
})

dbConnection.sync();