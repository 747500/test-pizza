

import http from 'http'
import fs from 'fs'

import Router from './router.mjs'

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

const router = new Router()

router.use((req, res, next) => {
	res.on('finish', () => {
		console.log(
			req.method,
			req.url,
			res.statusCode
			//req.headers,
		)
	})

	next()
})

router.post((req, res, next) => {

	req.postData = []

	if ('POST' === req.method) {
		req.on('data', chunk => {
			req.postData.push(chunk.toString())
		})
	}

	next()
})

router.get('/', (req, res, next) => {

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
})

router.get('/api/ingredients', (req, res, next) => {

	sendJson(req, res, [
		{ _id: 1, text: 'Сыр' },
		{ _id: 2, text: 'Пеперони' },
		{ _id: 3, text: 'Мясо' },
		{ _id: 4, text: 'Лук' },
		{ _id: 5, text: 'Ананас' },
	])

})

router.post('/api/pizza', (req, res, next) => {

	req.on('end', () => {
		console.log('* new custom pizza: ', JSON.parse(req.postData.join()))
		sendJson(req, res, { status: 'Ok' })
	})

})

router.last((req, res) => {
	send404(req, res)
})

const server = http.createServer((req, res) => router.match(req, res))

server.listen(1337, '127.0.0.1', () => {
	console.log('listen')
})
