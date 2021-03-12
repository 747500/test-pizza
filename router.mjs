
function Router () {

	[
		'get',
		'post',
		'put',
		'delete',
		// ...
	].forEach(method => {
		this[method] = (... args) => {
			const middleware = args.pop() || null
			const url = args.pop() || null
			this.use(method, url, middleware)
		}
	})

}

Router.prototype = {

	routes: [],

	use (... args) {
		this.routes.push({
			middleware: args.pop() || null,
			url: args.pop() || null,
			method: args.pop() || null,
		})
	},

	matchMethod (item, req) {
	 	return null === item.method || item.method === req.method.toLowerCase()
	},

	matchUrl (item, req) {

		//console.log('~', item.url, req.url)

		return null === item.url || item.url === req.url
	},

	matchRoutes (req) {

		const list = []

		this.routes.forEach(item => {
			if (this.matchMethod(item, req) && this.matchUrl(item, req)) {
				list.push(item)
			}
		})

		return list
	},

	match (req, res) {

		const list = this.matchRoutes(req)

		const next = err => {

			if (err) {
				this.http5xx(req, res, err)
				return
			}

			const item = list.shift()

			if (item) {
				item.middleware(req, res, next)
			}
			else {
				this.http404(req, res)
			}
		}

		next()

	},

	last (middleware) {
		this.http404 = middleware
	},

	error (middleware) {
		this.http5xx = middleware
	},
}

export default Router
