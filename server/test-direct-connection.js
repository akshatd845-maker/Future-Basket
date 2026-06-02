/**
 * Direct MongoDB Connection (Bypass SRV)
 * Uses explicit hosts instead of DNS SRV lookup
 */

const { MongoClient } = require('mongodb');

// Based on your nslookup results:
const hosts = [
  'ac-c4svcfy-shard-00-00.idbmq06.mongodb.net:27017',
  'ac-c4svcfy-shard-00-01.idbmq06.mongodb.net:27017',
  'ac-c4svcfy-shard-00-02.idbmq06.mongodb.net:27017'
];

// Non-SRV connection string format
const uri = `mongodb://Akshat:Akshat69@${hosts.join(',')}/?retryWrites=true&w=majority&replicaSet=atlas-shard-0&authSource=admin&directConnection=true`;

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