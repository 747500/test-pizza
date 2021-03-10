

import http from 'http'
import fs from 'fs'

function send5xx (req, res, err) {

	res.writeHead(500, {
	  'Content-Type': 'text/plain'
	})


	res.end(err.toString())

}

function send404 (req, res, err) {

	res.writeHead(404, {
	  'Content-Type': 'text/plain'
	})


	res.end('File Not Found')

}

function sendJson (req, res, data) {

	res.writeHead(200, {
	  'Content-Type': 'application/json'
	})


	res.end(JSON.stringify(data, false, 2))

}



const server = http.createServer((req, res) => {

	console.log(
		req.method,
		req.url,
		//req.headers,
	)

	const postData = []

	if ('POST' === req.method) {
		req.on('data', chunk => {
			postData.push(chunk.toString())
		})
	}

	if ('/' === req.url) {

		fs.readFile('public/index.html', (err, data) => {
			if (err) {
				console.error(err)
				send5xx(req, res, err)
				return
			}

			res.writeHead(200, {
			  'Content-Type': 'text/html'
			})

			res.end(data)

			return
		})
	}
	else
	if ('/api/ingredients' === req.url) {
		sendJson(req, res, [
			{ _id: 1, text: 'Сыр' },
			{ _id: 2, text: 'Пеперони' },
			{ _id: 3, text: 'Мясо' },
			{ _id: 4, text: 'Лук' },
			{ _id: 5, text: 'Ананас' },
		])
		return
	}
	else
	if ('POST' === req.method && '/api/pizza' === req.url) {
		req.on('end', () => {
			console.log('* new custom pizza: ', JSON.parse(postData.join()))
			sendJson(req, res, { status: 'Ok' })
		})
	}
	else {
		send404(req, res)
	}
})

server.listen(1337, '127.0.0.1', () => {
	console.log('listen')
})
