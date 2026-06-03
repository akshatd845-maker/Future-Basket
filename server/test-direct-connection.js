/**
 * Direct MongoDB Connection (Bypass SRV)
 * Uses explicit hosts instead of DNS SRV lookup
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');

// Retrieve non-SRV connection string from environment
const uri = process.env.MONGO_URI_FALLBACK;

if (!uri) {
  console.error('❌ Error: MONGO_URI_FALLBACK is not defined in your environment variables.');
  process.exit(1);
}

console.log('=== Direct Connection Test ===\n');
console.log('Testing non-SRV connection...');

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 10000,
  family: 4
});

async function test() {
  try {
    await client.connect();
    console.log('✅ Connected via direct connection!');

    const admin = client.db('admin');
    const result = await admin.command({ ping: 1 });
    console.log('✅ Ping:', result);
  } catch (err) {
    console.error('❌ Failed:', err.message);
  } finally {
    await client.close();
  }
}

test();