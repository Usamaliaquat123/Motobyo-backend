require('dotenv').config()
const express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var db = require('./config/db')
const app = express()
const jwt = require('jsonwebtoken')
const port = process.env.port || 5555
db.then(res => console.log('connect enabled')).catch(err => console.log(err))

const employeeModel = require('./models/employee')

app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors())

// current user

const authenticateToken = (req,res,next) => {
    const authHeader  = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=> {
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })
}




app.post('/user', (req, res) => {
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

})

// get all employee
app.get('/employee',authenticateToken,(req, res) => {
    employeeModel.userModel.find({ email  : req.body.email}).then(() => {
        employeeModel.employeeModel.find({}).then(re => {
            res.send(re.filter(d => d.Status == true))
        })
    }).catch(err => {
        res.send('unauthorized')
    })
})

// get employee
app.get('/employee/:uid',authenticateToken,(req, res) => {
    employeeModel.userModel.find({ email  : req.user.email}).then(() => {
        employeeModel.employeeModel.findById(req.params.uid).then(re => {
            if(re.Status == false){
                res.send('user not found')
            }else{
                res.send(re)
            }
        })

    }).catch(err => {
        res.send('unauthorized')

    })
  

})

// create new employee
app.post('/employee', (req, res)=> {
    employeeModel.userModel.find({ email  : req.user.email}).then(res => 
        {
            const employee = new employeeModel.employeeModel(req.body);
            employee.save().then((re) => res.send(re)).catch(err => res.sendStatus(err))

        }).catch(err => {
        res.send('unauthorized')
    })
})

// update employee 
app.put('/employee/:uid', (req, res) => {
    employeeModel.employeeModel.findOneAndUpdate({_id : req.params.uid}, req.body, {upsert: true}, function(err, doc) {
        if (err) return res.send(500, {error: err});
        return  employeeModel.employeeModel.findById(req.params.uid).then(re => {
                res.send(re)
        })
    });
})
// delete employee
app.delete('/employee/:uid',authenticateToken, (req, res) =>{


    employeeModel.userModel.find({ email  : req.user.email}).then(() => {
        employeeModel.employeeModel.findOneAndUpdate({_id : req.params.uid}, {Status : false}, {upsert: true}, function(err, doc) {
        if (err) return res.send(500, {error: err});
        return employeeModel.employeeModel.find({}).then(re => {
            res.send(re.filter(d => d.Status == true))
        })
    });}).catch(err => {
        res.send('unauthorized')
    })


  
})



app.listen(port , () => console.log(`server is running on ${port}`))



module.exports  = app