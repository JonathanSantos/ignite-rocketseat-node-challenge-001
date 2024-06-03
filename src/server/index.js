import http from 'node:http'
import { Routes } from './routes/index.js'

export class Server {
  #server = null
  #middlewares = []
  routes = new Routes()

  use (middleware) {
    this.#middlewares.push(middleware)

    return this
  }

  router (receivedRoutes) {
    this.routes.merge(receivedRoutes)
  }

  start (portNumber = 3000, callback) {
    this.#server = http.createServer(async (req, res) => {
      const { method, url } = req
      
      try {
        for (const middleware of this.#middlewares) {
          await middleware(req, res)
        }

        await this.routes.match(method, url).handler(req, res)
      } catch (error) {
        res.writeHead(500).end(error.message)
      }
    });

    this.#server.listen(portNumber, () => callback && callback(portNumber))
  }
}
