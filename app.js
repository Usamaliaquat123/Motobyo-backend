require('dotenv').config()
const express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var db = require('./config/db')
const app = express()
const jwt = require('jsonwebtoken')
const port = process.env.port || 5555
db

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
    console.log(req.body)


    const user = {
        name : "ads",

    }


   const accessToken =  jwt.sign(user, process,env.ACCESS_TOKEN_SECRET)
   res.json({ accessToken :accessToken })

})

// get all employee
app.get('/employee',authenticateToken,(req, res) => {
    if(req.user.email === "admin@admin.org"){
        employeeModel.find({}).then(re => {
            res.send(re.filter(d => d.Status == true))
        })
    }else{
        res.send('unauthorized')
    }
})

// get employee
app.get('/employee/:uid',authenticateToken,(req, res) => {
    if(req.user.email === "admin@admin.org"){
    employeeModel.findById(req.params.uid).then(re => {
        if(re.Status == false){
            res.send('user not found')
        }else{
            res.send(re)
        }
    })

}else{
    res.send('unauthorized')
}
})

// create new employee
app.post('/employee',authenticateToken, (req, res)=> {
    if(req.user.email === "admin@admin.org"){
    const employee = new employeeModel(req.body);
    employee.save().then((re) => res.send(re)).catch(err => res.sendStatus(err))

    }else{
        res.send('unauthorized')
    }
})

// update employee 
app.put('/employee/:uid',authenticateToken, (req, res) => {
    if(req.user.email === "admin@admin.org"){
    employeeModel.findOneAndUpdate({_id : req.params.uid}, req.body, {upsert: true}, function(err, doc) {
        if (err) return res.send(500, {error: err});
        return res.send(doc)
    });
}else{
    res.send('unauthorized')
}
})
// delete employee
app.delete('/employee/:uid', authenticateToken, (req, res) =>{
    if(req.user.email === "admin@admin.org"){
employeeModel.findOneAndUpdate({_id : req.params.uid}, {Status : false}, {upsert: true}, function(err, doc) {
    if (err) return res.send(500, {error: err});
    return employeeModel.find({}).then(re => {
        res.send(re.filter(d => d.Status == true))
    })
});}else{
    res.send('unauthorized')
}
})



app.listen(port , () => console.log(`server is running on ${port}`))



module.exports  = app