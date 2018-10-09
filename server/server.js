require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {ToDo} = require('./models/todo');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());


app.post('/todos', (req,res) => {
  var todo = new ToDo({
    text: req.body.text
  });

  todo.save().then( (doc)=>{ res.send(doc);}, (e)=>{res.status(400).send(e);});

});

app.get('/todos', (req,res) => {
  ToDo.find().then( (todos)=> {
    res.send({todos});
  }, (e)=> { res.status(400).send(e); });
});

app.get('/todos/:id', (req,res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id))
    return res.status(404).send({ 'error' : 'Invalid ID'});

    ToDo.findById(id).then( (doc)=> {
      if(!doc) return res.status(404).send();

      res.send({doc});
}).catch( (e) => {
  res.status(400).send();
});
});

app.delete('/todos/:id', (req,res) => {
  //get the ID
  var id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

ToDo.findByIdAndRemove(id).then( (doc)=> {
  if(!doc) {
    return res.status(404).send();
  }

  res.status(200).send({doc});
  }).catch( (e)=> {
  return res.status(400).send();
});
});


app.patch('/todos/:id', (req,res) =>{
  var id = req.params.id;
  var body = _.pick(req.body, ['text','completed']);

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  ToDo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch( ()=>{
    res.status(400).send();
  })

});

app.post('/users', (req,res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then((doc)=>{
    if(!doc) return res.status(404).send('Unable to create');

    res.send({doc});
  }, (e)=>{
    res.status(404).send(e);
  }).catch((e)=>{
    res.status(404).send(e);
  });
});

app.listen(port, () => {
  console.log("Started up at port ",port);
});
//server.js Only responsible for routes

module.exports = {app};
