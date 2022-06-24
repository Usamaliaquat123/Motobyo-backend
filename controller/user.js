require('dotenv').config()
const jwt = require('jsonwebtoken');
const employeeModel = require('../models/employee')


exports.createUser=(req, res) => {
    employeeModel.userModel.find(req.body).then(re => {
        if(re.length != 0){
            const user = {
                email : req.body.email,
                password : req.body.password,
            }
            const accessToken =  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
            res.json({ accessToken :accessToken })
        }else{
            res.send('Invalid User')

        }

    }).catch(err => {
        console.log(err)
        res.send('Invalid User')
    })

}