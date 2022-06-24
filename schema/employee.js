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
const user = new Schema({ 
    email : String,
    password : String
})

module.exports = { employee, user }