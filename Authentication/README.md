## Create a course selling website

### Description

1. Admins should be able to sign up
2. Admins should be able to create courses
    1. Course has a title, description, price and image link
    2. Course should be able to be published
3. Admins should be able to edit courses
4. Users should be able to sign up
5. Users should be able to purchase courses
6. Users should be able to view purchased courses
7. Users should be able to view all courses


## Routes 
### Admin Routes :
    - POST /admin/signup
      Description: Creates a new admin account.
      Input: { username: 'admin', password: 'pass' }
      Output: { message: 'Admin Created Successfully '}
    - POST /admin/login
      Description: Authenticates an admin. It requires the admin to send username and password in the headers.
      Input: Headers: {'username': 'admin', 'password': 'pass'}
    - POST /admin/courses
      Description: Creates a new course.
      Input: Headers: { 'username': 'admin', 'password': 'pass'}
      Input: Body: {title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com',published: true}
      Output: { message: 'course created successfully', courseId: 1 }
    - PUT /admin/courses/:courseId
      Description: Edits an existing course. courseId in the URL path should be replaced with the ID of the course to be edited.
      Input: Headers: { 'username': 'admin', 'password': 'pass'}
      Input: Body: {title: 'update course title', description: 'update course description', price: 100, imageLink: 'https://updatedlinktoimage.com',published: false}
      Output: { message: 'course created successfully' }
    - GET /admin/courses
      Description: Returns all the courses.
      Output: {course: [{id: 1, title: 'course title', description: 'descrition', price: 100, imageLink: 'https: //https://linktoimage.com',published: }] }