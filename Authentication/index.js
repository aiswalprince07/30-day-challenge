// WE will leaning authentication by create a course selling website !!!

//There are mutiple solution are there ,
// 1. Easy soln :- (simple authentication )

cosnt express = require("express");
const app = express();

// app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// auth middleware  --> Here we can write Authentication (User/Admin) fxn and other stuff for verifying users






// admin routes 

app.post("/admin/signup",(req,res)=>{
    // login to signup admin
    const admin = req.body;   // admin = {username: "prince@gmail.com", password: "123456"}
    const existingAdmin = ADMINS.find(a => a.username === admin.username);

    if(existingAdmin){
        res.status(403).json({message : "Admin already exists"});
    }else{
        ADMINS.push(admin);
        res.json({message: 'Admin created successfully'});
    }
})

app.post('/admin/login', adminAuthentication, (req,res)=> { // all these routes need to be authenticated, it gives data if you are admin!!!
    res.json({message : 'Logged in successfully'});
})

app.post(' /admin/courses', adminAuthentication , (req,res)=>{
    const course = req.body;
    course.id = Date.now();
    res.json({message: 'Course created successfully', couseId : course.COURSES}); 
})