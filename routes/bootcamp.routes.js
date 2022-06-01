const routes = require('express').Router();
const controller = require('../controllers/bootcamp.controller');
const courseController = require('../controllers/course.controller');
const { verifyAccessToken } = require('../middleWare/verifyAccessToken'); //The security middle ware to protect the routes from unauthrized access

routes.post('/create', verifyAccessToken, controller.createBootcamp);
routes.get('/all', verifyAccessToken, controller.getAllBootcamps);
routes.get('/:id', verifyAccessToken, controller.getBootcampById);
routes.put('/:id', verifyAccessToken, controller.updateBootcamp);
routes.delete('/:id', verifyAccessToken, controller.deleteBootcamp);
//course routes
routes.post('/:id/courses', verifyAccessToken, courseController.createBootcampCourse);
routes.get('/:id/courses', verifyAccessToken, courseController.getBootcampCourses);
routes.get('/:id/courses/:courseId', verifyAccessToken, courseController.getBootcampCourseById);
routes.put('/:id/courses/:courseId', verifyAccessToken, courseController.updateBootcampCourseById);
routes.delete('/:id/courses/:courseId', verifyAccessToken, courseController.deleteBootcampCourse);

module.exports = routes;