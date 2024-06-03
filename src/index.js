import { Server } from "./server/index.js"
import { Middlewares } from "./server/middlewares/index.js"

import { taskController } from "./api.js"

const app = new Server()

app.use(Middlewares.JSON)

app.router(taskController)

app.start(3333, (port) => {
    console.log(`Server is running on port ${port}`)
})