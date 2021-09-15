const models = require('../models');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const responseData = {
	status: true,
	message: "Completed",
	data: null
}
const register = async (req,res)=>{
  const data = req.body;
  if(!data){
    responseData.message = "data is required";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  const accountExist = await models.user.findOne(
    {
      where:{
        PUNumber:data.PUNumber
      }
    }
  );
  if(accountExist){
    responseData.message = "account already exist sign up";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(data.password,salt)
  data.password = hash;

  const createUser = await models.user.create(
    {
      id:uuid.v4(),
      firstName:data.firstName,
      lastName:data.lastName,
      PUNumber:data.PUNumber,
      password:data.password
    }
  );
  if(!createUser){
    responseData.message = "something went wrong";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.message = "Account successfully created";
  responseData.status = true;
  responseData.data = createUser;
  return res.json(responseData);
}

const adminRegister = async (req,res)=>{
  const data = req.body;
  if(!data){
    responseData.message = "data is required";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  const accountExist = await models.user.findOne(
    {
      where:{
        email:data.email
      }
    }
  );
  if(accountExist){
    responseData.message = "account already exist sign up";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(data.password,salt)
  data.password = hash;

  const createUser = await models.user.create(
    {
      id:uuid.v4(),
      email:data.email,
      firstName:data.firstName,
      lastName:data.lastName,
      isAdmin:true,
      password:data.password
    }
  );
  if(!createUser){
    responseData.message = "you have an account sign-in";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.message = "Admin successfully created";
  responseData.status = true;
  responseData.data = createUser;
  return res.json(responseData);
}
const login = async (req,res)=>{
  const data = req.body;
  const PUNumber = data.PUNumber;
  const password = data.password;
  const user = await models.user.findOne(
    {
      where:{PUNumber:PUNumber},
    }
  );
  if(user){
    const checkPassword = bcrypt.compareSync(password, user.password);
    if (!checkPassword) {
      responseData.message = "Incorrect passsword";
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData);
    } else {
      const jwt_payload ={
        id:user.id,
      }
      await models.isLoggedOut.destroy({where:{userId:user.id}}) 
      const token = jwt.sign(jwt_payload,process.env.SECRET);
      user.password = null;
      return res.json(
        { "token":token,
          "data":user,
          "statusCode":200
        }
      )
    }
  } else {
    responseData.message = "No account found";
    responseData.status = false;
    responseData.data = null;
    return res.json(responseData);
  }
}
const adminLogin = async (req,res)=>{
  const data = req.body;
  const email = data.email;
  const password = data.password;
  const user = await models.user.findOne(
    {
      where:{email:email},
    }
  );
  if(user){
    const checkPassword = bcrypt.compareSync(password, user.password);
    if (!checkPassword) {
      responseData.message = "Incorrect passsword";
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData);
    } else {
      const jwt_payload ={
        id:user.id,
      }
      await models.isLoggedOut.destroy({where:{userId:user.id}}) 
      const token = jwt.sign(jwt_payload,process.env.SECRET);
      user.password = null;
      return res.json(
        { "token":token,
          "data":user,
          "statusCode":200
        }
      )
    }
  } else {
    responseData.message = "No account found";
    responseData.status = false;
    responseData.data = null;
    return res.json(responseData);
  }
}
const logout = async (req,res)=>{
  await models.isLoggedOut.create({id:uuid.v4(),userId:req.user.id,status:true});
  res.json("logged out");
}

module.exports = {
  login,
  adminLogin,
  register,
  adminRegister,
  logout
}