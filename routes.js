const app = require('./app')




// current user

app.post('/user', (req, res) => {
        console.log(req)
        console.log(res)
})
    
    // get all employee
app.get('/employee',(req, res) => {
    console.log(req.body)
})

// get employee
app.get('/employee/:id',(req, res) => {
console.log(req.body)
})

// create new employee
app.post('/employee', (req, res)=> {
    console.log(req.body)
})

// update employee 
app.put('/employee', (req, res) => {
    console.log(req.body)
})
// delete employee
app.delete('/employee', (req, res) =>{
    console.log(req.body)
})
