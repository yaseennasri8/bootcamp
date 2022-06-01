const Bootcamp = require('../models/bootcamp');
const creatError = require('http-errors');
const schemaValid = require('../helper/schema.validation');

//create bootcamps
exports.createBootcamp = async (req, res, next) => {
  try {
    const result = await schemaValid.bootcampSchema.validateAsync(req.body);
    const author = req.user.user_id;
    const bootcamp = new Bootcamp({ ...result, author });
    await bootcamp.save();
    res.status(201).json({
      message: "Successfully created"
    })
  } catch (err) {
    next(err);
  }

}

//get all bootcamps
exports.getAllBootcamps = async (req, res, next) => {
  try {
    const bootcamp = Bootcamp.find();
    next(bootcamp); //calling middleware to customize the response
  } catch (err) {
    next(err);
  }
}

//get bootcamp by id
exports.getBootcampById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bootcamp = await Bootcamp.findOne({ _id: id });
    if (!bootcamp) {
      throw creatError.NotFound();
    }
    res.status(200).json({ bootcamp });
  } catch (err) {
    next(err);
  }
}

//update bootcamp
exports.updateBootcamp = async (req, res, next) => {
  try {
    const { id } = req.params;
    const author = req.user.user_id;
    const bootcamp = await Bootcamp.findOne({ _id: id });
    if (!bootcamp) {
      throw creatError.NotFound();
    }
    if (bootcamp.author.toString() !== author) {
      throw creatError.Unauthorized();
    }
    await Bootcamp.updateOne({ _id: id }, { $set: req.body });
    res.status(201).json({
      message: "Successfully updated"
    })
  } catch (err) {
    next(err);
  }
}

//delete bootcamp
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bootcamp = await Bootcamp.findOne({ _id: id });
    if (!bootcamp) {
      throw creatError.NotFound();
    }
    await Bootcamp.deleteOne({ _id: id });
    res.status(201).json({
      message: "Successfully deleted"
    })
  } catch (err) {
    next(err);
  }
}
