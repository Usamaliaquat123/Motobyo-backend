var mongoose = require('mongoose')
const { Schema } = mongoose;


const employee = new Schema({
    FirstName  : String,
    MiddleInitial : String,
    LastName : String,
    DateOfBirth : String,
    DateOfEmployment : String,
    Status : Boolean
})

module.exports = employee