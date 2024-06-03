import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    this.#load()
  }

  async #load() {
    try {
      const data = await fs.readFile(databasePath, 'utf-8')
      this.#database = JSON.parse(data)
    } catch (error) {
      this.#persist()
    }
  }

  async #persist() {
    await fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select (table) {
    return this.#database[table] ?? []
  }

  insert (table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()
  }

  delete (table, id) {
    if (!Array.isArray(this.#database[table])) {
      throw new Error('Table not found')
    }

    this.#database[table] = this.#database[table].filter(data => data.id !== id)
    this.#persist()
  }

  update (table, id, data) {
    if (!Array.isArray(this.#database[table])) {
      throw new Error('Table not found')
    }

    this.#database[table] = this.#database[table].map(item => {
      if (item.id === id) {
        return { ...item, ...data }
      }

      return item
    })

    this.#persist()
  }
}