import { Routes } from "./server/routes/index.js";

export const taskController = new Routes();

taskController.get('/tasks', async (req, res) => {
  res.end(JSON.stringify({ tasks: [] }));
});