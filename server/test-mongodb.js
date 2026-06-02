/**
 * MongoDB Connection Diagnostic Script
 * Run: node test-mongodb.js
 */

const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI || 'mongodb+srv://Akshat:Akshat69@cluster0.idbmq06.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

console.log('=== MongoDB Connection Diagnostic ===\n');
console.log('URI (password hidden):', uri.replace(/:[^:@]+@/, ':****@'));

async function diagnose() {
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
    family: 4, // Force IPv4
    directConnection: false
  });

  try {
    console.log('\n[1] Attempting to connect to MongoDB Atlas...');
    await client.connect();
    console.log('✅ SUCCESS: Connected to MongoDB!');

    const admin = client.db('admin');
    const result = await admin.command({ ping: 1 });
    console.log('✅ Ping result:', result);

  } catch (err) {
    console.error('\n❌ CONNECTION FAILED');
    console.error('Error name:', err.name);
    console.error('Error code:', err.code);
    console.error('Error message:', err.message);

    // Specific diagnostics
    if (err.message.includes('ECONNREFUSED')) {
      console.error('\n💡 DIAGNOSIS: Connection refused - likely firewall/ISP/VPN blocking port 27017');
    } else if (err.message.includes('authentication')) {
      console.error('\n💡 DIAGNOSIS: Authentication failed - check username/password');
    } else if (err.message.includes('ENOTFOUND') || err.message.includes('querySrv')) {
      console.error('\n💡 DIAGNOSIS: DNS/SRV lookup failed - check network/DNS settings');
    }

  } finally {
    await client.close();
  }
}

diagnose();