## Create a course selling website

### Description

Functionally the same as simple_Authentication. Routes are different though.
We now need to implement actual authentication here.
We're going to use Json Web Tokens(JWT) for the same.
When the user signs up, they should get back a jwt that is valid for 1 hour.
They should then send just that jwt vs sending username and password to the authentication routes.

You need to understand the APIs of jwt. We will be covering this in the extra recorded session this week.

## Routes

### Admin Routes:

- POST /admin/signup
  Description: Creates a new admin account.
  Input: { username: 'admin', password: 'pass'}
  Output: {message: 'Admin created successfully', token:'jwt_token_here'}
- POST /admin/login
  Description: Authentication an admin. It requires the admin to send username and password in the headers.
  Input: Headers: {'username': 'admin', 'password': 'pass'}
  Output: {message: 'Logged in successfully', token:'jwt_token_here'}
- POST /admin/courses
  Description: Creates a new course.
  Input: Headers: {'Authentication':'Bearer jwt_token_here'},Body: {title: 'course title', description: 'course description', price: 100, imageLink: 'http///',published: true}
  Output: {message: 'Course created successfully', courseId: 1}
- PUT /admin/courses/:courseId
  Description: Edits an existing course. courseId in the URL path should be replaced with the ID of the course to be edited.
  Input: Headers: {'Authentication': 'Bearer jwt_token_here'}, Body: {title" 'updated course title',description: 'updated course description', price: 100, imageLink: 'https///',published: false}
  Output: {message: 'Course updated successfully'}
- GET /admin/courses
