var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {ToDo} = require('./models/todo');
var {ObjectID} = require('mongodb');


var app = express();

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

app.listen(3000, () => {
  console.log("Server Started on port 3000");
});
//server.js Only responsible for routes

module.exports = {app};
