const fs = require('fs/promises');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

async function seed() {
  const password = await bcrypt.hash('password123', 10);
  
  const citizens = Array.from({ length: 10 }).map((_, i) => ({
    _id: `citizen-${i + 1}`,
    id: `citizen-${i + 1}`,
    name: `Citizen ${i + 1}`,
    email: `citizen${i + 1}@example.com`,
    password: password,
    role: 'citizen',
    ward: `Ward ${Math.floor(Math.random() * 5) + 1}`,
    greenScore: Math.floor(Math.random() * 500),
    totalWasteRecycled: Math.floor(Math.random() * 100),
    carbonSaved: Math.floor(Math.random() * 200),
    createdAt: new Date().toISOString()
  }));

  const admin = {
    _id: 'admin-1',
    id: 'admin-1',
    name: 'Hackathon Admin',
    email: 'admin@trashtrail.com',
    password: password,
    role: 'admin',
    createdAt: new Date().toISOString()
  };

  const wastebags = Array.from({ length: 15 }).map((_, i) => {
    const citizen = citizens[Math.floor(Math.random() * citizens.length)];
    const types = ['dry', 'wet', 'hazardous', 'mixed'];
    const statuses = ['created', 'collected', 'in_transit', 'recycled'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      _id: `bag-${i + 1}`,
      qrCode: `TT-2025-${10000 + i}`,
      citizenId: citizen.id,
      wasteType: types[Math.floor(Math.random() * types.length)],
      weightAtSource: Math.floor(Math.random() * 10) + 1,
      status: status,
      timeline: [{
        status: 'created',
        note: 'Initial registration',
        updatedBy: citizen.id,
        timestamp: new Date().toISOString()
      }],
      createdAt: new Date().toISOString()
    };
  });

  const db = {
    users: [admin, ...citizens],
    wastebags: wastebags,
    anomalies: [],
    complaints: []
  };

  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
  console.log('Local Database Seeded Successfully!');
}

seed().catch(console.error);
