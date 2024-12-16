const { DataTypes } = require('sequelize')
const db = require('../db/conn.js')
const User = require('./User.js')

const Thought = db.define('Thought', {
    title: {
        type: DataTypes.STRING,
        required: true
    }
})

Thought.belongsTo(User);
User.hasMany(Thought);

module.exports = Thought