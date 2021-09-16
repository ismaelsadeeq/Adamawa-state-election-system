const models = require('../models');
const uuid = require('uuid');

const responseData = {
	status: true,
	message: "Completed",
	data: null
}
const createElection = async (req,res)=>{
  const data = req.body;
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
  if(!election.status ==true){
    responseData.message = "election not published";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(!election){
    responseData.message = "something went wrong";
    responseData.status = false;
    responseData.data = undefined;
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
    responseData.message = "something went wrong";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  const election = await models.election.destroy( 
  ); 
  if(!election){
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
    responseData.message = "something went wrong";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(!election){
    responseData.message = "something went wrong";
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
  if(!election.status ==true){
    responseData.message = "election not published";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(!election){
    responseData.message = "something went wrong";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.message = "completed";
  responseData.status = true;
  responseData.data = election;
  return res.json(responseData);
}
const publishElection = async (req,res)=>{
  const election = await models.election.update(
    {
      status:true
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
  if(data.totalVotes > pollingUnit.voters){
    responseData.message = "votes exceeds registered voters";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  let results = data.results
  let party
  for (let prop in results){
    let votes
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
    await models.submission.create(
      {
        id:uuid.v4(),
        pollingUnitId:pollingUnit.id,
        partyId:party.id,
        votes:results[`${prop}`]
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
  if(!data){
    responseData.message = "data is required";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  const partyExist = await models.party.findOne(
    {
      where:{
        name:data.name
      }
    }
  )
  if(partyExist){
    responseData.message = "party exist";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData);
  }
  const election = await models.election.findOne( 
  ); 
  if(typeof(data.contestantName)=="object"){
    data.contestantName = JSON.stringify(data.contestantName)
  }
  const party = await models.party.create(
    {
      id:uuid.v4(),
      electionId:election.id,
      name:data.name,
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
  console.log(typeof(data.contestantName))
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

module.exports = {
  createElection,
  getElection,
  getElectionDetailAdmin,
  getElectionDetail,
  publishElection,
  submitResult,
  createParty,
  editParty,
  deleteParty,
  deleteElection
}