
var mongoose = require('mongoose');
var employeeSchema = require('../schema/employee')


const employeeModel = mongoose.model('Employee',employeeSchema );

module.exports =  employeeModel
