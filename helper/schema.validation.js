const joi = require('@hapi/joi');

exports.authSchema = joi.object({
    name: joi.string(),
    email: joi.string().email().lowercase().required(),
    password: joi.string().min(2).required()
})

exports.bootcampSchema = joi.object({
    bcCode: joi.string().required(),
    name: joi.string().required()
})

exports.courseSchema = joi.object({
    cCode: joi.string().required(),
    cName: joi.string().required(),
    creditHours: joi.number().required(),
    bootcamp: joi.required()
})