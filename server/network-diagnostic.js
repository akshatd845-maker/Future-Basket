/**
 * Network Diagnostic for MongoDB Connection Issues
 * Run: node network-diagnostic.js
 */

const dns = require('dns');
const net = require('net');
const { promisify } = require('util');

const dnsResolve4 = promisify(dns.resolve4);
const dnsResolveSrv = promisify(dns.resolveSrv);

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║         MongoDB Connection Network Diagnostic                ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

// Configuration
const clusterHostname = 'cluster0.idbmq06.mongodb.net';
const shardHosts = [
  'ac-c4svcfy-shard-00-00.idbmq06.mongodb.net',
  'ac-c4svcfy-shard-00-01.idbmq06.mongodb.net',
  'ac-c4svcfy-shard-00-02.idbmq06.mongodb.net'
];
const port = 27017;

async function runDiagnostics() {
  let passed = 0;
  let failed = 0;

  // Test 1: Basic DNS Resolution
  console.log('\n[TEST 1] Basic DNS Resolution (A records)');
  try {
    const addresses = await dnsResolve4(clusterHostname);
    console.log('  ✅ Resolved', clusterHostname, '->', addresses[0]);
    passed++;
  } catch (err) {
    console.error('  ❌ DNS resolution failed:', err.message);
    failed++;
  }

  // Test 2: SRV Record Resolution
  console.log('\n[TEST 2] SRV Record Resolution');
  try {
    const srvRecords = await dnsResolveSrv('_mongodb._tcp.' + clusterHostname);
    console.log('  ✅ Found', srvRecords.length, 'SRV records:');
    srvRecords.forEach(r => console.log(`     - ${r.name}:${r.port} (priority: ${r.priority})`));
    passed++;
  } catch (err) {
    console.error('  ❌ SRV lookup failed:', err.message);
    console.error('  💡 This is likely your issue! SRV lookups may be blocked.');
    failed++;
  }

  // Test 3: Resolve shard hostnames
  console.log('\n[TEST 3] Shard Hostname Resolution');
  for (const host of shardHosts) {
    try {
      const addresses = await dnsResolve4(host);
      console.log(`  ✅ ${host} -> ${addresses[0]}`);
    } catch (err) {
      console.error(`  ❌ ${host} resolution failed`);
      failed++;
    }
  }

  // Test 4: TCP Connection Test (PORT CHECK)
  console.log('\n[TEST 4] TCP Connection to Port 27017');
  for (const host of shardHosts) {
    try {
      await testTcpConnection(host, port);
      console.log(`  ✅ ${host}:${port} - Connection OK`);
      passed++;
    } catch (err) {
      console.error(`  ❌ ${host}:${port} - ${err.message}`);
      console.error(`     💡 This means port 27017 is BLOCKED!`);
      failed++;
    }
  }

  // Test 5: Test alternate ports (some ISPs block 27017)
  console.log('\n[TEST 5] Testing Common Alternative Ports');
  const altPorts = [443, 80, 8080, 8443];
  for (const p of altPorts) {
    try {
      await testTcpConnection(shardHosts[0], p);
      console.log(`  ⚠️  ${shardHosts[0]}:${p} - Open (unusual for MongoDB)`);
    } catch {
      console.log(`  ❌ ${shardHosts[0]}:${p} - Closed (expected)`);
    }
  }

  // Summary
  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║                         SUMMARY                               ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝');
  console.log(`  Passed: ${passed}`);
  console.log(`  Failed: ${failed}`);

  if (failed > 0) {
    console.log('\n💡 RECOMMENDED FIXES:');
    console.log('  1. Disable Windows Firewall temporarily to test');
    console.log('  2. Check if VPN/Antivirus is blocking port 27017');
    console.log('  3. Contact ISP to check if port 27017 is blocked');
    console.log('  4. Try using a VPN to bypass ISP-level blocking');
    console.log('  5. Use MongoDB Atlas Data API or Atlas CLI as fallback');
  }
}

function testTcpConnection(host, port) {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    socket.setTimeout(5000);

    socket.on('connect', () => {
      socket.destroy();
      resolve();
    });

    socket.on('timeout', () => {
      socket.destroy();
      reject(new Error('Timeout'));
    });

    socket.on('error', (err) => {
      socket.destroy();
      reject(err);
    });

    socket.connect(port, host);
  });
}

runDiagnostics().catch(console.error);