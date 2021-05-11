const mongoose = require("mongoose");
const Joi = require("joi");
const randStr = require("randomstring");
const User = mongoose.model(
  "tblUsers",
  new mongoose.Schema({
    title: { type: String, required: true },
    fullName: { type: String, required: true, uppercase: true },
    postalCode: { type: String, required: true },
    homeAddress: { type: String, required: true, uppercase: true },
    phone: { type: String, required: true, min: 10, max: 15 },
    dateOfBirth: { type: String, required: true, min: 10, max: 15 },
    email: { type: String, required: true },
    password: { type: String, required: true, minlength: 6, maxlength: 15 },
    dataAdded: { type: "date", default: Date.now },
    isActive: { type: Boolean, default: true },
    AccountNo: { type: String, required: true, default: "000223232" },
  })
);

const UserPicture = mongoose.model(
  "tblUsersPictures",
  new mongoose.Schema({
    email: { type: String, required: true },
    imageURI: { type: String, required: true },
    dataAdded: { type: "date", default: Date.now },
    isActive: { type: Boolean, default: true },
  })
);

function validatePicture(PictureDetail) {
  const Schema = {
    email: Joi.string().max(50).required(),
    imageURI: Joi.string().required(),
  };
  return Joi.validate(PictureDetail, Schema);
}

function validateLoginRequest(loginDetail) {
  const Schema = {
    email: Joi.string().required(),
    password: Joi.string().min(6).max(15).required(),
  };
  return Joi.validate(loginDetail, Schema);
}
function validateUser(user) {
  const Schema = {
    title: Joi.string().max(5).required(),
    fullName: Joi.string().required(),
    postalCode: Joi.string().required(),
    homeAddress: Joi.string().max(50).required(),
    phone: Joi.string().max(17).min(11).required(),
    dateOfBirth: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().min(6).max(15).required(),
  };
  return Joi.validate(user, Schema);
}
async function logIn(request, resp) {
  try {
    const validateReq = validateLoginRequest(request.body);
    if (validateReq.error) return resp.status(400).send(`error ${validateReq.error} occurred`);

    let retLogin = await User.findOne({
      email: request.body.email,
      password: request.body.password,
    });
    console.log(retLogin);
    if (retLogin != null) return resp.status(200).send(retLogin);
    return resp.status(400).send("Invalid userName or passwords");
  } catch (ex) {
    console.log(ex);
    return resp.status(400).send("Invalid userName or passwords");
  }
}
async function getUserByEmail(request, resp) {
  console.log(request.params.email);
  let getUsr = await User.findOne({ email: request.params.email });
  if (getUsr.error)
    return resp.status(400).send(getUsr.error.details[0].message);
  return resp.status(200).send(getUsr);
}

async function validateUserByEmail(email) {
  let getUsr = await User.findOne({ email: email });
  if (getUsr.error) return;
  return getUsr;
}

async function getAllUsers(req, resp) {
  try {
    let getUsr = await User.find();
    return resp.status(200).send(getUsr);
  } catch (ex) {
    console.log(ex);
    return "error occurred";
  }
}
async function createNewUser(request, resp) {
  try {
    let validateReq = await validateUser(request.body);
    if (validateReq.error)
      return resp.status(400).send(validateReq.error.details[0].message);
  } catch (ex) {
    console.log(ex);
  }
  try {
    //check Email does not exist before
    let retUser = await User.findOne({ email: request.body.email }); //.pretty();
    if (retUser != null) {
      return resp.status(400).send("Email already exists");
    }
  } catch (ex) {
    console.log(ex);
  }
  
  try {
    const createNew = await CreateUser(request.body);
    if (createNew != null) {
      return resp
        .status(200)
        .send(`New user with record id ${createNew} was created successfully`);
    }
    return resp.status(400).send("Unable to create user at the moment");
  } catch (ex) {
    console.log(ex);
  }
}
async function uploadUserPicture(request, resp) {
  try {
    let validateReq = await validatePicture(request.body);
    if (validateReq.error)
      return resp.status(400).send(validateReq.error.details[0].message);
  } catch (ex) {
    console.log(ex);
  }

  try {
    //confirm this is a valid user
    let retUser = await User.findOne({ email: request.body.email }); //.pretty();
    if (retUser == null) {
      return resp.status(400).send(`user with email address ${request.body.email} does not exist`);
    }
  } catch (ex) {
    console.log(ex);
  }
  //check image has not already been uploaded for this user, if yes, delete so the old image can be updated
  let retUser = await UserPicture.findOne({ email: request.body.email }); //.pretty();
  if (retUser != null) {
    await UserPicture.deleteOne({ email: request.body.email });
  }

  //upload new image for user
  const newPicture = new UserPicture({
    email: request.body.email,
    imageURI: request.body.imageURI,
  });
  const saveRec = await newPicture.save();
  if(!saveRec.error) return resp.send(`Image uploaded successfully for ${request.body.email}`);
  return resp.status(400).send(`Server is unable to upload image at the moment for ${saveRec.error}`);
}

async function updatePassword(req, resp) {
  let yourString = randStr.generate(8);
  const updateRec = await User.updateOne(
    { email: req.params.email.trim() },
    { $set: { password: yourString } },
    { upsert: true }
  );
  if (updateRec) return resp.status(200).send("password updated successfully");
  return resp
    .status(400)
    .send("Unable to update recover password at the moment");
}

async function CreateUser(reqBody) {
  const newUser = new User({
    title: reqBody.title,
    fullName: reqBody.fullName,
    postalCode: reqBody.postalCode,
    homeAddress: reqBody.homeAddress,
    phone: reqBody.phone,
    dateOfBirth: reqBody.dateOfBirth,
    email: reqBody.email,
    password: reqBody.password,
    dataAdded: Date.now(),
    isActive: true,
    AccountNo: reqBody.AccountNo,
  });
  const saveRec = await newUser.save();
  return saveRec._id;
}

//insert title into mongodb and fetch
async function getTitle(request, response) {
  try {
    let query = await titles.find().sort("_id");
    return response.status(200).send(query);
  } catch (ex) {
    console.log(ex);
  }
}
async function createTitle(request, response) {
  console.log(request);
  const logOBj = new titles({
    title: request.body.title,
    isActive: true,
  });
  try {
    const doLog = await logOBj.save();
    if(doLog) return response.send("Title created successfully");
    return response.status(400).send(`user ${request.name} does not exist`);
  } catch (ex){
    console.log(ex.message);
    return response.status(400).send(`user ${request.name}does not exist`);
  }
}

module.exports.validateUser = validateUser;
module.exports.logIn = logIn;
module.exports.createNewUser = createNewUser;
module.exports.updatePassword = updatePassword;
module.exports.uploadUserPicture = uploadUserPicture;
module.exports.getUserByEmail = getUserByEmail;
module.exports.getAllUsers = getAllUsers;
module.exports.validateUserByEmail = validateUserByEmail;
module.exports.getTitle = getTitle;
module.exports.createTitle = createTitle;