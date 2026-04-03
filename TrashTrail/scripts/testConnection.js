const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;

async function test() {
  console.log('Testing connection to:', uri.split('@')[1]); // Log hostname only for security
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('SUCCESS: Database is connected!');
    process.exit(0);
  } catch (err) {
    console.error('FAILURE: Could not connect.', err.message);
    process.exit(1);
  }
}

test();
