import http from 'node:http'
import { Routes } from './routes/index.js'

export class Server {
  #server = null
  #middlewares = []
  routes = null

  use (middleware) {
    this.#middlewares.push(middleware)
    this.routes = new Routes()

    return this
  }

  router (receivedRoutes) {
    this.routes.merge(receivedRoutes)
  }

  start (portNumber = 3000, callback) {
    this.#server = http.createServer(async (req, res) => {
      const { method, url } = req

      for await (const middleware of this.#middlewares) {
        await middleware(req, res)
      }

      await this.routes.match(method, url).handler(req, res)
    });

    this.#server.listen(portNumber, () => callback && callback(portNumber))
  }
}
