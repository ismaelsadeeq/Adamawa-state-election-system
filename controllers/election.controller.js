const models = require('../models');
const uuid = require('uuid');

const responseData = {
	status: true,
	message: "Completed",
	data: null
}
const createElection = async (req,res)=>{
  const data = req.body;
  const user = req.user
  if(!user.isAdmin){
    responseData.message = "user is not an admin";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(!data){
    responseData.message = "data is required";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  let date = new Date();
  date = date.toLocaleDateString()
  const electionExist = await models.election.findOne()
  if(electionExist){
    responseData.message = "there is an election currently going on";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  const election = await models.election.create(
    {
      id:uuid.v4(),
      name:data.name,
      date:date,
      status:false
    }
  );
  if(!election){
    responseData.message = "something went wrong";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.message = "Election successfully created";
  responseData.status = true;
  responseData.data = election;
  return res.json(responseData);
}
const getElection = async (req,res)=>{
  const election = await models.election.findOne( 
  ); 
  if(!election){
    responseData.message = "No election at the moment";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(election.status == false){
    responseData.message = "election not published";
    responseData.status = false;
    responseData.data = election;
    return res.json(responseData);
  }
  responseData.message = "completed";
  responseData.status = true;
  responseData.data = election;
  return res.json(responseData);
}
const deleteElection = async (req,res)=>{
  const user = req.user
  if(!user.isAdmin){
    responseData.message = "user is not an admin";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  const election = await models.election.destroy(
    { 
      where:{
        status:true
      }
    }
  ); 
  const electionTwo = await models.election.destroy(
    { 
      where:{
        status:false
      }
    }
  );
  if(!election && !electionTwo){
    responseData.message = "something went wrong";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.message = "election deleted";
  responseData.status = true;
  responseData.data = election;
  return res.json(responseData);
}
const getElectionDetailAdmin = async (req,res)=>{
  const user = req.user
  const election = await models.election.findOne(
    {
      include:[
        {
          model:models.party
        }
      ]
    }
  ); 
  if(!user.isAdmin){
    responseData.message = "user is not an admin";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(!election){
    responseData.message = "No election at the moment";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.message = "completed";
  responseData.status = true;
  responseData.data = election;
  return res.json(responseData);
}
const getElectionDetail = async (req,res)=>{
  const election = await models.election.findOne(
    {
      include:[
        {
          model:models.party
        }
      ]
    }
  ); 
  if(!election){
    responseData.message = "No election at the moment";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(election.status == false){
    responseData.message = "election not published";
    responseData.status = false;
    responseData.data = election;
    return res.json(responseData);
  }
  responseData.message = "completed";
  responseData.status = true;
  responseData.data = election;
  return res.json(responseData);
}
const publishElection = async (req,res)=>{
  const user = req.user;
  if(!user.isAdmin){
    responseData.message = "user is not an admin";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  const election = await models.election.update(
    {
      status:true
    },
    {
      where:{
        status:false
      }
    }
  );
  if(!election){
    responseData.message = "something went wrong";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.message = "election published";
  responseData.status = true;
  responseData.data = election;
  return res.json(responseData);
}
const unPublishElection = async (req,res)=>{
  const user = req.user;
  if(!user.isAdmin){
    responseData.message = "user is not an admin";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  const election = await models.election.update(
    {
      status:false
    },
    {
      where:{
        status:true
      }
    }
  );
  if(!election){
    responseData.message = "something went wrong";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.message = "election un-published";
  responseData.status = true;
  responseData.data = election;
  return res.json(responseData);
}

const submitResult = async (req,res)=>{
  const data = req.body;
  const user = req.user;
  if(!data){
    responseData.message = "data is required";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  const pollingUnit = await models.pollingUnit.findOne(
    {
      where:{
        puNumber:user.PUNumber
      }
    }
  );
  const lga = await models.lga.findOne(
    {
      where:{
        id:pollingUnit.lgaId
      }
    }
  );
  const submissionExist = await models.submission.findOne(
    {
      where:{
        pollingUnitId:pollingUnit.id
      }
    }
  );
  if(submissionExist){
    responseData.message = "result already submitted";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(parseInt(data.totalVotes) > parseInt(pollingUnit.voters)){
    responseData.message = "votes exceeds registered voters";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  let results = data.results
  let party
  for (let prop in results){
    let votes;
    party = await models.party.findOne(
      {
        where:{
          id:prop
        }
      }
    );
    votes = parseInt(party.votes) + parseInt(results[`${prop}`])
    await models.party.update(
      {
        votes:votes
      },
      {
        where:{
          id:party.id
        }
      }
    );
    const election = await models.election.findOne()
    await models.submission.create(
      {
        id:uuid.v4(),
        pollingUnitId:pollingUnit.id,
        partyId:party.id,
        votes:results[`${prop}`],
        electionId:election.id
      }
    )
  }
  responseData.message = "result submitted";
  responseData.status = true;
  responseData.data = data;
  return res.json(responseData);
}

const createParty = async (req,res)=>{
  const data = req.body;
  const user = req.user
  if(!user.isAdmin){
    responseData.message = "user is not an admin";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(!data){
    responseData.message = "data is required";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  const election = await models.election.findOne( 
  ); 
  const partyExist = await models.party.findOne(
    {
      where:{
        name:data.partyName,
        electionId:election.id
      }
    }
  )
  if(partyExist){
    responseData.message = "party exist";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(typeof(data.contestantName)=="object"){
    data.contestantName = JSON.stringify(data.contestantName)
  }
  const party = await models.party.create(
    {
      id:uuid.v4(),
      electionId:election.id,
      name:data.partyName,
      contestantName:data.contestantName,
      votes:"0"
    }
  );
  if(!party){
    responseData.message = "something went wrong";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.message = "party successfully created";
  responseData.status = true;
  responseData.data = party;
  return res.json(responseData);
}

const editParty = async (req,res)=>{
  const data = req.body;
  const partyId = req.params.id
  if(typeof(data.contestantName)=="object"){
    data.contestantName = JSON.stringify(data.contestantName)
  }
  const party = await models.party.update(
    {
      name:data.name,
      contestantName:data.contestantName
    },
    {
      where:{
        id:partyId
      }
    }
  );
  if(!party){
    responseData.message = "something went wrong";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.message = "party successfully edited";
  responseData.status = true;
  responseData.data = party;
  return res.json(responseData);
}
const deleteParty = async (req,res)=>{
  const data = req.body;
  const partyId = req.params.id
  const party = await models.party.destroy(
    {
      where:{
        id:partyId
      }
    }
  );
  if(!party){
    responseData.message = "something went wrong";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.message = "party successfully deleted";
  responseData.status = true;
  responseData.data = party;
  return res.json(responseData);
}

const getElectionDetailUser = async (req,res)=>{
  const user = req.user;
  const electionId = await models.election.findOne()
  if(!electionId){
    responseData.message = "No election at the moment";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  const pollingUnit = await models.pollingUnit.findOne(
    {
      where:{
        puNumber:user.PUNumber
      }
    }
  );
  const submissionExist = await models.submission.findOne(
    {
      where:{
        pollingUnitId:pollingUnit.id,
        electionId:electionId.id
      }
    }
  );
  if(submissionExist){
    responseData.message = "result already submitted";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  const election = await models.election.findOne(
    {
      include:[
        {
          model:models.party
        }
      ]
    }
  ); 
  if(!election){
    responseData.message = "No election at the moment";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.message = "completed";
  responseData.status = true;
  responseData.data = election;
  return res.json(responseData);
}
const getElectionParties = async (req,res)=>{
  const election = await models.election.findOne(
  );
  if(election){
    const parties = await models.party.findAll(
      {
        where:{
          electionId:election.id
        }
      }
    )
    responseData.message = "completed";
    responseData.status = true;
    responseData.data = parties;
    return res.json(responseData);
  }
  responseData.message = "no election";
  responseData.status = true;
  responseData.data = undefined;
  return res.json(responseData);
}
module.exports = {
  createElection,
  getElection,
  getElectionDetailAdmin,
  getElectionDetailUser,
  getElectionDetail,
  publishElection,
  unPublishElection,
  submitResult,
  createParty,
  editParty,
  deleteParty,
  deleteElection,
  getElectionParties
}