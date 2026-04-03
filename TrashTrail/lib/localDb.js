import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');
let dbCache = null;

async function readDb() {
  if (dbCache) return dbCache;
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    dbCache = JSON.parse(data);
    return dbCache;
  } catch (error) {
    if (error.code === 'ENOENT') {
      const initialDb = { users: [], wastebags: [], anomalies: [], complaints: [] };
      await fs.writeFile(DB_PATH, JSON.stringify(initialDb, null, 2));
      dbCache = initialDb;
      return dbCache;
    }
    throw error;
  }
}

async function writeDb(data) {
  dbCache = data;
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

const localDb = {
  users: {
    async find(query = {}) {
      const db = await readDb();
      return db.users.filter(u => {
        for (let key in query) {
          if (u[key] !== query[key]) return false;
        }
        return true;
      });
    },
    async findOne(query) {
      const users = await this.find(query);
      return users[0] || null;
    },
    async findById(id) {
      const db = await readDb();
      return db.users.find(u => u.id === id || u._id === id);
    },
    async create(userData) {
      const db = await readDb();
      const newUser = {
        _id: Date.now().toString(),
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.users.push(newUser);
      await writeDb(db);
      return newUser;
    },
    async updateById(id, updates) {
      const db = await readDb();
      const index = db.users.findIndex(u => u.id === id || u._id === id);
      if (index === -1) return null;
      db.users[index] = { ...db.users[index], ...updates, updatedAt: new Date().toISOString() };
      await writeDb(db);
      return db.users[index];
    }
  },
  wastebags: {
    async find(query = {}) {
      const db = await readDb();
      return db.wastebags.filter(w => {
        for (let key in query) {
          if (w[key] !== query[key]) return false;
        }
        return true;
      });
    },
    async findOne(query) {
      const bags = await this.find(query);
      return bags[0] || null;
    },
    async findById(id) {
      const db = await readDb();
      return db.wastebags.find(w => w.id === id || w._id === id);
    },
    async create(bagData) {
      const db = await readDb();
      const newBag = {
        _id: Date.now().toString(),
        ...bagData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.wastebags.push(newBag);
      await writeDb(db);
      return newBag;
    },
    async updateById(id, updates) {
      const db = await readDb();
      const index = db.wastebags.findIndex(w => w.id === id || w._id === id);
      if (index === -1) return null;
      db.wastebags[index] = { ...db.wastebags[index], ...updates, updatedAt: new Date().toISOString() };
      await writeDb(db);
      return db.wastebags[index];
    }
  },
  anomalies: {
    async find() {
      const db = await readDb();
      return db.anomalies;
    },
    async create(data) {
      const db = await readDb();
      const newEntry = { _id: Date.now().toString(), ...data, createdAt: new Date().toISOString(), status: 'open' };
      db.anomalies.push(newEntry);
      await writeDb(db);
      return newEntry;
    },
    async updateById(id, updates) {
      const db = await readDb();
      const index = db.anomalies.findIndex(a => a._id === id);
      if (index === -1) return null;
      db.anomalies[index] = { ...db.anomalies[index], ...updates, updatedAt: new Date().toISOString() };
      await writeDb(db);
      return db.anomalies[index];
    }
  },
  complaints: {
    async find() {
      const db = await readDb();
      return db.complaints;
    },
    async create(data) {
      const db = await readDb();
      const newEntry = { _id: Date.now().toString(), ...data, createdAt: new Date().toISOString() };
      db.complaints.push(newEntry);
      await writeDb(db);
      return newEntry;
    }
  },
  async getRawData() {
    return await readDb();
  }
};

export default localDb;
