const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const schemaValidate = require('../helper/schema.validation');
const createError = require('http-errors');
const GmailMailer = require('../mailer/gmail.mailer');

//==================================================================create users via signup================================================
exports.createUsers = async (req, res, next) => {
  try {
    const result = await schemaValidate.authSchema.validateAsync(req.body);	//validation the user input by joi pakage
    const doesExist = await User.findOne({ email: result.email }).lean();
    if (doesExist) {
      throw createError.Conflict(`${result.email} is already been registered`);
    }
    const user = new User(result)

    //generate salt
    const salt = await bcrypt.genSalt(10);
    //convert the plain text into hash
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    res.status(201).json({
      message: "Successfully created"
    })
  } catch (err) {
    next(err);
  }
}

//================================================================login users===============================================================
exports.login = async (req, res, next) => {
  try {
    const result = await schemaValidate.authSchema.validateAsync(req.body);
    const user = await User.findOne({ email: result.email }).lean();
    if (!user) {
      throw createError.NotFound("User not registered");
    }
    const validation = await bcrypt.compare(result.password, user.password);
    if (!validation) {
      throw createError.Forbidden("Password didnot match");
    }

    //if validate then generate jwt
    const jwt_secret_key = process.env.JWT_SECRET_KEY;
    const token = jwt.sign(
      { user_id: user._id, email: user.email },
      jwt_secret_key,
      {
        expiresIn: "30d",
      }
    );
    // user.token = token;
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    }).status(200).json({
      data: user
    })
  } catch (err) {
    // to prevent the default error message to secure the security issue, generate the custome error 
    if (err.isJoi == true) return next(createError.BadRequest('Invalid Username/Password'));
    next(err);
  }
}

//=============================================================change password=================================================================
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { user } = req;
    if (!currentPassword || !newPassword) {
      throw createError.BadRequest("Please enter both current and new password");
    }
    const verifiedUser = await User.findOne({ email: user.email });
    const validation = await bcrypt.compare(currentPassword, verifiedUser.password);
    if (!validation) {
      throw createError.Forbidden("Password didnot match");
    }

    //generate salt to password hashing
    const salt = await bcrypt.genSalt(10);
    //convert plain text into hash
    verifiedUser.password = await bcrypt.hash(newPassword, salt);
    verifiedUser.save();
    res.status(200).json({
      message: "Password updated successfully"
    })
  } catch (err) {
    next(err);
  }
}

//================================================================forgot password==============================================================
exports.forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    if (!email) {
      throw createError.BadRequest("Email is required");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw createError.UnprocessableEntity("User with provided email not found");
    }
    const jwt_secret_key = process.env.JWT_SECRET_KEY;
    const token = jwt.sign(
      { user_id: user._id, email: user.email },
      jwt_secret_key,
      {
        expiresIn: "1h",
      }
    );
    user.passwordResetToken = token;
    await user.save();

    const gmailMailer = new GmailMailer();
    gmailMailer.sendPasswordResetGmail(email, token).catch((err) => {
      throw createError.UnprocessableEntity(`Error with dispatching email: ${err}`);
    });

    // const link = `localhost:3000/reset-password/${token}`
    res.status(200).json({
      message: "Instructions to reset password has been sent to your registered email address"
    })

  } catch (err) {
    next(err);
  }
}

//======================================================================reset password==========================================================
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token) {
      throw createError.BadRequest("Required field token was not provided");
    }
    if (!newPassword) {
      throw createError.BadRequest("Required field newPassword was not provided");
    }

    const verifiedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!verifiedUser) {
      throw createError.Forbidden();
    }
    const user = await User.findOne({ _id: verifiedUser.user_id });
    if (user.passwordResetToken.toString() !== token) {
      throw createError.BadRequest("The token provided is invalid");
    }

    //generate salt
    const salt = await bcrypt.genSalt(10);
    //convert the plain text into hash
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({
      message: "Password updated successfully"
    })

  } catch (err) {
    next(err);
  }
}

//=========================================Check HTTP Parameter Pollution(HPP) ==================================
exports.checkPollution = (req, res) => {
  try {
    const {name} = req.query;
    res.json({
      name: name
    })
  } catch (err) {
    next(err);
  }
}