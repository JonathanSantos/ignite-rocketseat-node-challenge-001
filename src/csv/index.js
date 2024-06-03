import fs from 'node:fs'

import { parse } from 'csv-parse'

const csvPath = new URL('./tasks.csv', import.meta.url)
const readStream = fs.createReadStream(csvPath)

const csvParser = parse({
  skipEmptyLines: true,
  fromLine: 2,
  delimiter: ',',
})

const lines = readStream.pipe(csvParser)

async function start () {
  for await (const line of lines) {
    const [title, description] = line
  
    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    })
  }
}

start()