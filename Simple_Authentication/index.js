// WE will leaning authentication by create a course selling website !!!

//There are mutiple solution are there ,

// 1. Easy soln :- (simple authentication )
// in this soln... we will sending username and password in each req. which is not a good practice ...(we are not storing these things in browser !!)

const express = require("express");
const app = express();

app.use(express.json()); // if you want a middleware to be used for all the routes , then use app.use() ,
// and if you want a middleare for some specific routes then, you just pass that middleware right before the fxn as an argument  ... (app.post or app.get .. takes infinite arguments ..and in the end you give your handler )

// memory arrays ..locally
let ADMINS = [];
let USERS = [];
let COURSES = [];

// auth middleware  --> Here we can write Authentication (User/Admin) fxn and other stuff for verifying users
// adminAuthentication  --> route specific middleware hota h!!

const adminAuthentication = (req, res, next) => {
  const { username, password } = req.headers; // de-structing ..may be     , or const username = req.headers.username, const password = req.headers.password;

  const admin = ADMINS.find(
    (a) => a.username === username && a.password === password
  );

  if (admin) {
    next();
  } else {
    res.status(403).json({ message: "Admin authentication failed" });
  }
};

const userAuthentication = (req, res, next) => {
  const { username, password } = req.headers;
  const user = USERS.find(
    (a) => a.username === username && a.password === password
  );

  if (user) {
    req.user = user; // Add user object to the request ... (whenever any changes in user ..means if we add some course then it will affect directly on Global USERS array !!)
    next();
  } else {
    res.status(403).json({ message: "User authentication failed" });
  }
};

// admin routes

app.post("/admin/signup", (req, res) => {
  // login to signup admin
  const admin = req.body; // admin = {username: "prince@gmail.com", password: "123456"}
  const existingAdmin = ADMINS.find((a) => a.username === admin.username);

  if (existingAdmin) {
    res.status(403).json({ message: "Admin already exists" });
  } else {
    ADMINS.push(admin);
    res.json({ message: "Admin created successfully" });
  }
});

app.post("/admin/login", adminAuthentication, (req, res) => {
  // all these routes need to be authenticated, it gives data if you are admin!!!
  res.json({ message: "Logged in successfully" });
});

app.post("/admin/courses", adminAuthentication, (req, res) => {
  const course = req.body;

  /*
    Here you can check that .. course is valid or not !!!   like....
    if(!course.title){
      return res.status(401).send({message: "Please send me the title"});
    }
  */

  course.id = Date.now(); // use timestamp as course ID
  COURSES.push(course);
  res.json({ message: "Course created successfully", couseId: course.id });
});

app.put("/admin/courses/:courseId", adminAuthentication, (req, res) => {
  const courseId = parseInt(req.params.courseId); // may be.. it gives string and since we want to use as a Id so we need to convert it to number.
  const course = COURSES.find((c) => c.id === courseId);
  if (course) {
    Object.assign(course, req.body);
    res.json({ message: "Course updated successfully" });
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get("/admin/course", adminAuthentication, (req, res) => {
  res.json({ courses: COURSES });
});




///////////////////   Now for users related routes   ///////////////////////



app.post("/users/signup", (req, res) => {
  const user = { ...req.body, purchasedCourses: [] };
  
  const existingUser = USERS.find((a) => a.username === req.body.username);
  
  if (existingUser) {
    res.status(403).json({ message: "User already exists" });
  } else {
    USERS.push(user);
    res.status(200).json({ message: "User created successfully" });
  }
});

app.post("/users/login", userAuthentication, (req, res) => {
  res.json({ message: "User loggin successfully" });
});

app.get("/users/courses", userAuthentication, (req, res) => {
  // res.json({courses : COURSES.filter(c => c.published)});
  let filteredCourses = [];
  for (let i = 0; i < COURSES.length; i++) {
    if (COURSES[i].published) {
      filteredCourses.push(COURSES[i]);
    }
  }
  res.json({ courses: filteredCourses });
});

app.post("/users/courses/:courseId", userAuthentication, (req, res) => {
  const courseId = Number(req.params.courseId);
  const course = COURSES.find((c) => c.id === courseId && c.published);
  if (course) {
    // METHOD 1 :-
    // var username = req.headers["username"];
    //find the user in the global user array
    // update the user object
    // remove the old user object to the USERS global array.
    // add the new user object to the USERS global array.
    
    // METHOD 2 :-
    req.user.purchasedCourses.push(courseId);
    res.json({ message: "Course published successfully" });
  } else {
    res.status(404).json({ message: "course not found or not available" });
  }
});

app.get("/users/purchasedCourses", userAuthentication, (req, res) => {
  // const purchasedCourses = COURSES.filter((c) => req.user.purchasedCourses.includes(c.id));
  
  // We need to extract the complete course object from COURSES ... which have ids which are present in req.user.purchasedCourses
  var purchasedCoursesIds = req.user.purchasedCourses; // it contains only ID of courses
  var purchasedCourses = [];
  for (let i = 0; i < COURSES.length; i++) {
    if (purchasedCoursesIds.indexOf(COURSES[i].id) !== -1) {
      purchasedCourses.push(COURSES[i]);
    }
  }
  
  res.json({ purchasedCourses });
});



app.get("/", (req, res) => {
  res.send({ message: "your app is fine currently" });
});

app.listen(3000, () => {
  console.log("server is startrrr");
});



// middlewares main uses is --> authentication
