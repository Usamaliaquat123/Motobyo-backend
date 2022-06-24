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


var empRouter = require('./controller/employee');
app.post('/employee',authenticateToken, empRouter.createEmp);
app.get('/employee',authenticateToken, empRouter.getAllEmp);
app.get('/employee/:uid',authenticateToken, empRouter.getEmp);
app.put('/employee/:uid',authenticateToken, empRouter.EditEmp);
app.delete('/employee/:uid',authenticateToken, empRouter.deleteEmp);


// /user
var userRouter = require('./controller/user');
app.post('/user', userRouter.createUser);

 
app.listen(port , () => console.log(`server is running on ${port}`))



module.exports  = app