var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {ToDo} = require('./models/todo');
var {ObjectID} = require('mongodb');


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
//remove todo by id
  //success
    //if no doc, send 404
    //if doc, send doc back with 200
  //error
    //400 with emopty body

});

app.listen(port, () => {
  console.log("Started up at port ",port);
});
//server.js Only responsible for routes

module.exports = {app};
