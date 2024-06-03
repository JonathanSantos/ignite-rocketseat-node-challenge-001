import { buildRoutePath, extractQueryParams } from "./utils.js"

export class Routes {
  constructor() {
    this.routes = []
  }

  add(route) {
    const { path } = route
    const newPath = buildRoutePath(path)

    route.path = newPath

    this.routes.push(route)
    return this
  }

  get (route, handler) {
    this.add({ method: 'GET', path: route, handler })
    return this
  }

  post (route, handler) {
    this.add({ method: 'POST', path: route, handler })
    return this
  }

  delete (route, handler) {
    this.add({ method: 'DELETE', path: route, handler })
    return this
  }

  put (route, handler) {
    this.add({ method: 'PUT', path: route, handler })
    return this
  }

  patch (route, handler) {
    this.add({ method: 'PATCH', path: route, handler })
    return this
  }

  merge (receivedRoutes) {
    this.routes = [...this.routes, ...receivedRoutes.all()]
    return this
  }

  match (method, url) {
    const defaultNotFound = {
      handler: async (req, res) => {
        res
          .writeHead(404)
          .end()
      }
    }

    const route = this.routes.find(route => {
      const isMethodEqual = route.method === method
      const isUrlEqual = route.path.test(url)

      return isMethodEqual && isUrlEqual
    })

    if (route) {
      const handler = route.handler
      const routeParams = route.path.exec(url)
      const { query, ...params } = routeParams?.groups ?? { query: {} }
      const hasParams = Object.keys(params).length > 0

      return {
        ...route,
        handler: async (req, res) => {
          req.params = hasParams ? params : {}
          req.query = extractQueryParams(query)

          return handler(req, res)
        }
      }
    }

    return defaultNotFound
  }

  all () {
    return this.routes
  }
}