
var mongoose = require('mongoose');
var employeeSchema = require('../schema/employee')


const employeeModel = mongoose.model('Employee',employeeSchema.employee );
const userModel = mongoose.model('user',employeeSchema.user );

module.exports =  {employeeModel, userModel}
