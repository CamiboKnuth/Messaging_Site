# Messaging_Site

This is some test code for a website which can be used to create anonymous messaging sessions.


Steps to run:

	1) download and install node.js

	2) open a command window and install the websocket library with "npm install websocket" (no quotes)

	3) in the directory of this repository, open a command prompt, type "ngrok http 61420" (no quotes)

	4) in the resulting pop-up window, copy the address listed after "forwarding"
		example: "http://71845700.ngrok.io" (no quotes)
		Do not close this window

	5) in the downloaded first.html file, modify the var ngrok value below to
		"var ngrok = *insert copied value here*;" (no quotes), replace http with ws
		example: "var ngrok = ws://71845700.ngrok.io;" (no quotes)

	6) open anther command prompt in this same directory, type "node server.js" (no quotes)

	7) At this point, two command prompt windows should be open: the ngrok window and the server.js
		window, which should display "Awaiting Connection..." (no quotes)

	8) Use the modified first.html file to run this web app
