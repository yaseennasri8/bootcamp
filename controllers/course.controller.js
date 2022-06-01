const Bootcamp = require('../models/bootcamp');
const Course = require('../models/course');
const createError = require('http-errors');
const schemaValidate = require('../helper/schema.validation');

//========= course into boot camps======
//Create course
exports.createBootcampCourse = async (req, res, next) => {
    try {
        const result = await schemaValidate.courseSchema.validateAsync(req.body);
        const { id } = req.params;
        const bootcamp = await Bootcamp.findOne({ _id: id }).lean();

        if (!bootcamp) {
            throw createError.NotFound();
        }

        const course = new Course(result);
        await course.save();
        res.status(201).json({
            message: "Successfully created"
        })
    } catch (err) {
        next(err);
    }
}

//Get courses by bootcamp id
exports.getBootcampCourses = async (req, res, next) => {
    try {
        const { id } = req.params;
        const bootcamp = await Bootcamp.findOne({ _id: id }).lean();
        if (!bootcamp) {
            throw createError.NotFound();
        }
        const response = Course.find({bootcamp: id}).populate('bootcamp');
        next(response); //calling middleware to customize the response
    } catch (err) {
        next(err);
    }
}

//Get bootcamp course by id
exports.getBootcampCourseById = async (req, res, next) => {
    try {
        const { id, courseId } = req.params;
        const bootcamp = await Bootcamp.findOne({ _id: id });
        if (!bootcamp) {
            throw createError.NotFound();
        }
        const course = await Course.findOne({ _id: courseId, bootcamp: id }).populate('bootcamp');
        res.status(200).json({
            data: course
        });
    } catch (err) {
        next(err);
    }
}

//Edit bootcamp course by id
exports.updateBootcampCourseById = async (req, res, next) => {
    try {
        const { id, courseId } = req.params;
        const bootcamp = await Bootcamp.findOne({ _id: id }).lean();
        if (!bootcamp) {
            throw createError.NotFound();
        }
        await Course.updateOne({ _id: courseId, bootcamp: id }, { $set: req.body });
        res.status(201).json({
            message: "Successfully updated"
        })
    } catch (err) {
        next(err);
    }
}

//Delete bootcamp course by id
exports.deleteBootcampCourse = async (req, res, next) => {
    try {
        const { id, courseId } = req.params;
        const bootcamp = await Bootcamp.findOne({ _id: id }).lean();
        const course = await Bootcamp.findOne({_id: courseId}).lean();
        if (!bootcamp || !course) {
            throw createError.NotFound();
        }
        await Course.deleteOne({_id: courseId, bootcamp: id});
        res.status(200).json({
            message: "Successfully deleted"
        })
    } catch (err) {
        next(err);
    }
}