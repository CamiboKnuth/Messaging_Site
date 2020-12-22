var portNum = 61420;

var sessions = [1, 2, 3, 8888888888];

var users = [];
var userIds = [];
var userNums = [];
var userSession = [];

var numUsers = 0;
var numCurrentUsers = 0;


var WebSocketServer = require('websocket').server;
var http = require('http');


var server = http.createServer(function(request, response){});


server.listen(portNum, '0.0.0.0',function() {});

wsServer = new WebSocketServer(
{
	httpServer: server
});

console.log('Awaiting Connection...');

wsServer.on('request', function(request)
{
	var socket = request.accept(null, request.origin);
	var currentUser = -1;
	var currentSession = -1;


	socket.on('message', function(message)
	{
		//message types: f = find, j = join, c = create, g = group message
		if (message.type === 'utf8')
		{
			message = getMessageString(message);

//finds session id
//if not found, keep trying
//if found, close first, move to main
//transfer data with 
//sessionStorage.getItem('label');
//sessionStorage.setItem('label','value');
			if(message.charAt(0) == 'f')
			{
				message = message.substring(1);

				if(sessions.includes(parseInt(message)))
				{
					console.log('Found Session #' + message);
					socket.send(1);
					socket.close();
				}
				else
				{
					console.log('Did Not Find Session #' + message);
					socket.send(0);
				}
			}
//create session message format is "c(sessionid)" no parenths or quotes
//after creation, close first, move to admin
			else if(message.charAt(0) == 'c')
			{
				message = message.substring(1);
			
				sessions.push(parseInt(message));

				socket.send(1);

				console.log('Sent Confirmation of creation, added ' + message);

				socket.close();
			}
//send join message with format "j(username),(sessionId)" no parentheses or quotes
			else if(message.charAt(0) == 'j')
			{
				message = message.substring(1);

				currentUser = numUsers;

				users.push(socket);
				userNums.push(currentUser);

				var currentId = message.substring(0, message.indexOf(','));

				userIds.push(currentId);
				currentSession = parseInt(message.substring(message.indexOf(',') + 1));
				userSession.push(currentSession);

				numUsers ++;
				numCurrentUsers ++;

				console.log('Connected: ' + numUsers + ' , ' + message.substring(0, message.indexOf(',')));
				console.log('Added User Session: ' + parseInt(message.substring(message.indexOf(',') + 1)));

				socket.send(1);

				var userList = 'u';

				for(var i = 0; i < users.length; i++)
				{
					if(userSession[i] == currentSession)
					{
						userList += userIds[i] + ':';
					}
				}

				for(var i = 0; i < users.length; i++)
				{
					if(userSession[i] == currentSession)
					{
						users[i].send(userList);
					}
				}


			}
//group messages start with g
			else if(message.charAt(0) == 'g')
			{
				console.log('group message: ' + message);

				for(var i = 0; i < users.length; i++)
				{
					if(userSession[i] == currentSession)
					{
						users[i].send(message);
					}
				}
			}
//private message starts with p
			else if(message.charAt(0) == 'p')
			{
				var recip = message.substring(1, message.indexOf(':'));

				console.log('private message from: ' + recip + ' : ' + message);

				for(var i = 0; i < users.length; i++)
				{
					if(userIds[i] == recip && userSession[i] == currentSession)
					{
						users[i].send(message);
					}
				}
			}
		}
	});

	socket.on('close', function(socket)
	{
		if(currentUser == -1)
		{
			console.log('Closed');
		}
		else
		{
//remove user
			users.splice(userNums.indexOf(currentUser), 1);
			userIds.splice(userNums.indexOf(currentUser), 1);
			userSession.splice(userNums.indexOf(currentUser), 1);
			userNums.splice(userNums.indexOf(currentUser), 1);

			numCurrentUsers --;

				var userList = 'u';

				for(var i = 0; i < users.length; i++)
				{
					if(userSession[i] == currentSession)
					{
						userList += userIds[i] + ':';
					}
				}

				for(var i = 0; i < users.length; i++)
				{
					if(userSession[i] == currentSession)
					{
						users[i].send(userList);
					}
				}

			console.log('Closed user ' + currentUser);
		}
	});
});

var getMessageString = function(message)
{
	message = JSON.stringify(message);
	return message.substring(message.indexOf('utf8Data":"') + 11, message.length - 2);
}