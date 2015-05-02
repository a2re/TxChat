/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config/environment');
// Setup server
var app = express();
var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

var io = require('socket.io')(server);

var users = {};
io.on('connection', function(socket) {

  socket.on('login', function(username) {
    if(users[username] === undefined) {
      socket.username = username;
      users[username] = socket.id;
    }
    io.emit('logged', users);
  });

  socket.on('message', function(message) {
    message.sender = socket.username;
    socket.emit('message', message);
    var dest = io.sockets.connected[users[message.chatter]];
    if(dest !== undefined) {
      io.sockets.connected[users[message.chatter]].emit('message', message);
    }
  });

  socket.on('disconnect', disconnection);
  socket.on('disconnection', disconnection);

  function disconnection() {
    delete users[socket.username];
    io.emit('disconnect', socket.username);
  }
});

// Expose app
exports = module.exports = app;
