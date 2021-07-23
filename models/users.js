const Connection = require('../dbconfig/');
const { DataTypes } = require('sequelize');

const dbConnection = Connection.connect;

dbConnection.define('users', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING
    }
},
{
    freezeTableName: true,
    timestamps: false
})

dbConnection.sync();