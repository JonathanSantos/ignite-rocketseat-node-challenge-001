import { randomUUID } from "node:crypto"

import { Database } from "./database/index.js"
import { Routes } from "./server/routes/index.js"

export const taskController = new Routes()

const database = new Database()
const TABLE_TASKS = 'tasks'

taskController.get('/tasks', async (req, res) => {
  const { title, description } = req.query ?? {}
  const tasks = database.select(TABLE_TASKS)
  const filteredTasks = tasks.filter(task => {
    if (title && !task.title.includes(title)) {
      return false
    }

    if (description && !task.description.includes(description)) {
      return false
    }

    return true
  });

  res.writeHead(200)
  res.end(JSON.stringify(filteredTasks))
});

taskController.post('/tasks', async (req, res) => {
  const { title, description } = req.body ?? {}
  const task = { 
    id: randomUUID(),
    title: title ?? '',
    description: description ?? '',
    created_at: new Date(),
    updated_at: null,
    completed_at: null
  }

  await database.insert(TABLE_TASKS, task)

  res.writeHead(201)
  res.end()
});

taskController.put('/tasks/:id', async (req, res) => {
  const { id } = req.params

  const { title, description } = req.body ?? {}
  let task = {}

  if (title) {
    task.title = title
  } else if (description) {
    task.description = description
  } else {
    res.writeHead(400)
    res.end(JSON.stringify({ message: 'The "title" or "description" attribute is required in body request'}))
    return
  }

  const hasTask = database.select(TABLE_TASKS).some(task => task.id === id)

  if (!hasTask) {
    res.writeHead(404)
    res.end(JSON.stringify({ message: 'Task not found'}))
    return
  }
  
  task.updated_at = new Date()

  await database.update(TABLE_TASKS, id, task)

  res.writeHead(200)
  res.end(JSON.stringify({ message: 'Task updated'}))
});

taskController.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params

  const hasTask = database.select(TABLE_TASKS).some(task => task.id === id)

  if (!hasTask) {
    res.writeHead(404)
    res.end(JSON.stringify({ message: 'Task not found'}))
    return
  }

  await database.delete(TABLE_TASKS, id)

  res.writeHead(204)
  res.end()
});

taskController.patch('/tasks/:id/complete', async (req, res) => {
  const { id } = req.params

  const task = database.select(TABLE_TASKS).find(task => task.id === id)

  if (!task) {
    res.writeHead(404)
    res.end(JSON.stringify({ message: 'Task not found'}))
    return
  }

  if (task.completed_at) {
    res.writeHead(400)
    res.end(JSON.stringify({ message: 'Task already completed'}))
    return
  }

  await database.update(TABLE_TASKS, id, { completed_at: new Date() })

  res.writeHead(200)
  res.end(JSON.stringify({ message: 'Task completed'}))
});