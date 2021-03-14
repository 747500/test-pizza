
// -------------------------------------------------------------------------

function Route (... args) {
	this.middleware = args.pop() || null
	this.url = args.pop() || null
	this.method = args.pop() || null
}

Route.prototype = {
	method: null,
	url: null,
	middleware: null,
}

Route.prototype.matchMethod = function (req) {
 	return null === this.method || this.method === req.method.toLowerCase()
}

Route.prototype.matchUrl = function (req) {

	//console.log('~', item.url, req.url)

	return null === this.url || this.url === req.url
}

Route.prototype.match = function (req) {
	return this.matchMethod(req) && this.matchUrl(req)
}

// -------------------------------------------------------------------------

function Router () {

	[
		'get',
		'post',
		'put',
		'delete',
		// ...
	].forEach(method => {
		this[method] = function (... args) {
			const middleware = args.pop()
			const url = args.pop()
			this.use(method, url, middleware)
		}
	})

}

Router.prototype = {
	routes: [],
}

Router.prototype.use = function (... args) {
	this.routes.push(new Route(... args))
}

Router.prototype.matchRoutes = function (req) {
	return this.routes.filter(route => route.match(req))
}

Router.prototype.match = function (req, res) {

	const routes = this.matchRoutes(req)

	const next = err => {

		if (err) {
			this.http5xx(req, res, err)
			return
		}

		const route = routes.shift()

		if (route) {
			route.middleware(req, res, next)
		}
		else {
			this.http404(req, res)
		}
	}

	next()

}

Router.prototype.last = function (middleware) {
	this.http404 = middleware
}

Router.prototype.error = function (middleware) {
	this.http5xx = middleware
}

// -------------------------------------------------------------------------

export default Router
