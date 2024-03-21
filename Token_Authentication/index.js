// WE will leaning authentication by create a course selling website !!!

//There are mutiple solution are there ,

// 1. Medium soln :- (token authentication )
// in this soln... we will sending username and password in incripted form ..know as token.. after logging first time..we send both thing.. but then for each req. we send token for auth !!

const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json()); // if you want a middleware to be used for all the routes , then use app.use() ,
// and if you want a middleare for some specific routes then, you just pass that middleware right before the fxn as an argument  ... (app.post or app.get .. takes infinite arguments ..and in the end you give your handler )

// memory arrays ..locally
let ADMINS = [];
let USERS = [];
let COURSES = [];

const secretKey = "YOUR_SECRET_KEY"; // there is a bug.. user can also create courses.. bcoz both admin and user have same secret key..so do provide different secret keys !!

const generateJwt = (user) => {
  const payload = { username: user.username };
  return jwt.sign(payload, secretKey, { expiresIn: "1hr" });
};

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(" ")[1];

      jwt.verify(token, secretKey, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }
        req.user = user;
        next();
      });
    }
  } else {
    res.sendStatus(401);
  }
};

/////////// admin routes  ////////////////////////

app.post("/admin/signup", (req, res) => {
  // login to signup admin
  const admin = req.body; // admin = {username: "prince@gmail.com", password: "123456"}
  const existingAdmin = ADMINS.find((a) => a.username === admin.username);

  if (existingAdmin) {
    res.status(403).json({ message: "Admin already exists" });
  } else {
    ADMINS.push(admin);
    const token = generateJwt(admin);
    res.json({ message: "Admin created successfully", token });
  }
});

app.post("/admin/login", authenticateJwt, (req, res) => {
  const { username, password } = req.headers;
  const admin = ADMINS.find(
    (a) => a.username === username && a.password === password
  );

  if (admin) {
    const token = generateJwt(admin);
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "Admin authentication failed" });
  }
});

app.post("/admin/courses", authenticateJwt, (req, res) => {
  const course = req.body;

  /*
    Here you can check that .. course is valid or not !!!   like....
    if(!course.title){
      return res.status(401).send({message: "Please send me the title"});
    }
  */

  COURSES.push({ ...course, id: COURSES.length + 1 });
  res.json({ message: "Course created successfully", couseId: COURSES.length });
});

app.put("/admin/courses/:courseId", authenticateJwt, (req, res) => {
  const courseId = parseInt(req.params.courseId); // may be.. it gives string and since we want to use as a Id so we need to convert it to number.
  const courseIdx = COURSES.findIndex((c) => c.id === courseId);
  if (courseIdx > -1) {
    const updatedCourse = { ...COURSES[courseIdx], ...req.body };
    COURSES[courseIdx] = updatedCourse;
    res.json({ message: "Course updated successfully" });
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get("/admin/course", authenticateJwt, (req, res) => {
  res.json({ courses: COURSES });
});

///////////////////   Now for users related routes   ///////////////////////

app.post("/users/signup", (req, res) => {
  const user = req.body;

  const existingUser = USERS.find((a) => a.username === req.body.username);

  if (existingUser) {
    res.status(403).json({ message: "User already exists" });
  } else {
    USERS.push(user);
    const token = generateJwt(user);
    res.status(200).json({ message: "User created successfully", token });
  }
});

app.post("/users/login", authenticateJwt, (req, res) => {
 const {username, password} = req.headers;
 const user = USERS.find(u => u.username && u.password === password);
 if(user){
    const token = generateJwt(req.body.username);
    res.json({ message: "User loggin successfully", token  });
 }else{
    res.status(403).json({message: "User authentication failed"});
 }
});

app.get("/users/courses", authenticateJwt, (req, res) => {
  res.json({ courses: COURSES });
});

app.post("/users/courses/:courseId", authenticateJwt, (req, res) => {
  const courseId = req.params.courseId;
  const course = COURSES.find((c) => c.id === courseId && c.published);
  if (course) {
    req.user.purchasedCourses.push(courseId);
    res.json({ message: "Course purchased successfully" });
  } else {
    res.status(404).json({ message: "Course not found or not available" });
  }
});

app.get("/users/purchasedCourses", authenticateJwt, (req, res) => {
  const user = USERS.find((u) => u.username === req.user.username);
  if (user && user.purchasedCourses) {
    res.json({ purchasedCourses: user.purchasedCourses });
  } else {
    res.status(404).json({ message: "No courses purchased" });
  }
});

app.listen(3000, () => {
  console.log("server is startrrr");
});

// // middlewares main uses is --> authentication
