const localDb = require('./lib/localDb').default;
const bcrypt = require('bcryptjs');

async function verify() {
  console.log('--- FINAL SYSTEM VERIFICATION ---');
  
  // 1. Test User Creation
  const testEmail = `verify-${Date.now()}@test.com`;
  const password = await bcrypt.hash('test123', 10);
  const user = await localDb.users.create({
    name: 'Verifier',
    email: testEmail,
    password: password,
    role: 'citizen'
  });
  console.log('✔ User Creation: SUCCESS (ID:', user.id, ')');

  // 2. Test User Lookup
  const found = await localDb.users.findOne({ email: testEmail });
  if (found && found.name === 'Verifier') {
    console.log('✔ User Lookup: SUCCESS');
  } else {
    throw new Error('User Lookup Failed');
  }

  // 3. Test Session Logic (findById)
  const byId = await localDb.users.findById(user.id);
  if (byId && byId.email === testEmail) {
    console.log('✔ Session Lookup (findById): SUCCESS');
  } else {
    throw new Error('Session Lookup Failed');
  }

  // 4. Test Analytics Readiness
  const data = await localDb.getRawData();
  console.log(`✔ Database Readiness: SUCCESS (${data.users.length} users, ${data.wastebags.length} bags)`);
  
  console.log('--- ALL SYSTEMS GREEN FOR PRESENTATION ---');
}

verify().catch(err => {
  console.error('❌ VERIFICATION FAILED:', err.message);
  process.exit(1);
});
