const models = require('../models');
const uuid = require('uuid');

const responseData = {
	status: true,
	message: "Completed",
	data: null
}
const createState = async (req,res)=>{
  const data = req.body;
  if(!data){
    responseData.message = "data is required";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  const state = await models.state.create(
    {
      id:uuid.v4(),
      name:data.name
    }
  );
  if(!state){
    responseData.message = "something went wrong";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.message = "state successfully created";
  responseData.status = true;
  responseData.data = state;
  return res.json(responseData);
}
const createLga = async (req,res)=>{
  const data = req.body;
  const stateId = req.params.stateId
  if(!data){
    responseData.message = "data is required";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  const lga = await models.lga.create(
    {
      id:uuid.v4(),
      stateId:stateId,
      name:data.name
    }
  );
  if(!lga){
    responseData.message = "something went wrong";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.message = "lga successfully created";
  responseData.status = true;
  responseData.data = lga;
  return res.json(responseData);
}
const createPollingUnit = async (req,res)=>{
  const data = req.body;
  const lgaId = req.params.lgaId
  if(!data){
    responseData.message = "data is required";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  const pollingUnit = await models.pollingUnit.create(
    {
      id:uuid.v4(),
      lgaId:lgaId,
      puNumber:data.puNumber,
      name:data.name,
      voters:data.voters
    }
  );
  if(!pollingUnit){
    responseData.message = "something went wrong";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.message = "polling unit successfully created";
  responseData.status = true;
  responseData.data = pollingUnit;
  return res.json(responseData);
}
const editPollingUnit = async (req,res)=>{
  const data = req.body;
  const lgaId = req.params.lgaId
  const pollingUnitId = req.params.id
  if(!data){
    responseData.message = "data is required";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  const pollingUnit = await models.pollingUnit.update(
    {
      lgaId:lgaId,
      puNumber:data.puNumber,
      name:data.name,
      voters:data.voters
    },
    {
      where:{
        id:pollingUnitId
      }
    }
  );
  if(!pollingUnit){
    responseData.message = "something went wrong";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.message = "polling unit successfully edited";
  responseData.status = true;
  responseData.data = pollingUnit;
  return res.json(responseData);
}
const deletePollingUnit = async (req,res)=>{
  const pollingUnitId = req.params.id
  const pollingUnit = await models.pollingUnit.destroy(
    {
      where:{
        id:pollingUnitId
      }
    }
  );
  if(!pollingUnit){
    responseData.message = "something went wrong";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.message = "polling unit successfully deleted";
  responseData.status = true;
  responseData.data = pollingUnit;
  return res.json(responseData);
}
const getLga = async (req,res)=>{
  const stateId = req.params.id
  let pageLimit = parseInt(req.query.pageLimit);
  let currentPage = parseInt(req.query.currentPage);
  let	skip = currentPage * pageLimit;
  const lga = await models.lga.findAll(
    {
      order:[['createdAt','DESC']],
      offset:skip,
      limit:pageLimit,
      where:{
        stateId:stateId
      }
    }
  );
  if(!lga){
    responseData.message = "something went wrong";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.message = "sucessful";
  responseData.status = true;
  responseData.data = lga;
  return res.json(responseData);
}
const getLgaPu = async (req,res)=>{
  const lgaId = req.params.id

  let pageLimit = parseInt(req.query.pageLimit);
  let currentPage = parseInt(req.query.currentPage);
  let	skip = currentPage * pageLimit;

  const pollingUnit = await models.pollingUnit.findAll(
    {
      order:[['createdAt','DESC']],
      offset:skip,
      limit:pageLimit,
      where:{
        lgaId:lgaId
      }
    }
  );
  if(!pollingUnit){
    responseData.message = "something went wrong";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.message = "sucessful";
  responseData.status = true;
  responseData.data = pollingUnit;
  return res.json(responseData);
}

module.exports = {
  createState,
  createLga,
  createPollingUnit,
  editPollingUnit,
  deletePollingUnit,
  getLga,
  getLgaPu
}