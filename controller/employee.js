const employeeModel = require('../models/employee')

// create new employee
exports.createEmp= (req, res)=>{
    
    employeeModel.userModel.find({ email  : req.user.email}).then(() => 
        {
            const employee = new employeeModel.employeeModel(req.body);
            employee.save().then((re) => res.send(re)).catch(err => res.sendStatus(err))

        }).catch(err => {
        res.send('unauthorized')
    })
}


// get all employee
exports.getAllEmp=(req, res) => {
    
    employeeModel.userModel.find({ email  : req.body.email}).then(() => {
        employeeModel.employeeModel.find({}).then(re => {
            res.send(re.filter(d => d.Status == true))
        })
    }).catch(err => {
        res.send('unauthorized')
    })
};


// get employee
exports.getEmp=(req, res) => {
    console.log("getEmp",req)
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
  

}

// update employee 
exports.EditEmp= (req, res) => {
    employeeModel.employeeModel.findOneAndUpdate({_id : req.params.uid}, req.body, {upsert: true}, function(err, doc) {
        if (err) return res.send(500, {error: err});
        return  employeeModel.employeeModel.findById(req.params.uid).then(re => {
                res.send(re)
        })
    });
}


// delete employee
exports.deleteEmp= (req, res) =>{


    employeeModel.userModel.find({ email  : req.user.email}).then(() => {
        employeeModel.employeeModel.findOneAndUpdate({_id : req.params.uid}, {Status : false}, {upsert: true}, function(err, doc) {
        if (err) return res.send(500, {error: err});
        return employeeModel.employeeModel.find({}).then(re => {
            res.send(re.filter(d => d.Status == true))
        })
    });}).catch(err => {
        res.send('unauthorized')
    })


  
}


