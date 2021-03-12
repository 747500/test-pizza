

const methods = [
	'get',
	'post',
	'put',
	'delete'
]

function Router () {

	console.log('* Router this', this)

	methods.forEach(method => {
		this[method] = (... args) => {
			this.addRoute({
				method,
				middleware: args.pop() || null,
				url: args.pop() || null
			})
		}
	})

	this.use = (... args) => {
		this.addRoute({
			method: null,
			middleware: args.pop() || null,
			url: args.pop() || null
		})
	}

}

Router.prototype = {

	list: [],

	addRoute (obj) {
		console.log('* addRoute', obj)
		this.list.push(obj)
	},

	matchMethod (item, req) {
	 	return null === item.method || item.method === req.method.toLowerCase()
	},

	matchUrl (item, req) {

		//console.log('~', item.url, req.url)

		return null === item.url || item.url === req.url
	},

	match (req, res) {

		req.list = []

		this.list.forEach(item => {
			if (this.matchMethod(item, req) && this.matchUrl(item, req)) {
				req.list.push(item)
			}
		})

		//console.log('! req', req)

		const next = err => {
			const item = req.list.shift()
			if (item) {
				if (item.middleware) {
					item.middleware(req, res, next)
				}
				else {
					next()
				}
			}
			else {
				if (this.http404) {
					this.http404(req, res)
					return
				}
				console.log('? 404')
			}
		}
		next()

	},

	last (middleware) {
		this.http404 = middleware
	},

}

export default Router
