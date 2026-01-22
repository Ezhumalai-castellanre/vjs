// Quick test script to check Railway backend
// Run: node test-backend.js

const BACKEND_URL = 'https://vjs-production.up.railway.app';

async function testBackend() {
  console.log('🔍 Testing Railway Backend...\n');
  
  // Test 1: Root endpoint
  console.log('1️⃣ Testing root endpoint: GET /');
  try {
    const rootRes = await fetch(`${BACKEND_URL}/`);
    const rootText = await rootRes.text();
    console.log(`   Status: ${rootRes.status}`);
    console.log(`   Content-Type: ${rootRes.headers.get('content-type')}`);
    if (rootText.startsWith('{')) {
      console.log('   ✅ Returns JSON:', JSON.parse(rootText));
    } else {
      console.log('   ❌ Returns HTML:', rootText.substring(0, 100));
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }
  
  console.log('\n');
  
  // Test 2: Health endpoint
  console.log('2️⃣ Testing health endpoint: GET /health');
  try {
    const healthRes = await fetch(`${BACKEND_URL}/health`);
    const healthText = await healthRes.text();
    console.log(`   Status: ${healthRes.status}`);
    console.log(`   Content-Type: ${healthRes.headers.get('content-type')}`);
    if (healthText.startsWith('{')) {
      console.log('   ✅ Returns JSON:', JSON.parse(healthText));
    } else {
      console.log('   ❌ Returns HTML:', healthText.substring(0, 100));
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }
  
  console.log('\n');
  
  // Test 3: Bookings endpoint
  console.log('3️⃣ Testing bookings endpoint: GET /api/bookings');
  try {
    const bookingsRes = await fetch(`${BACKEND_URL}/api/bookings`);
    const bookingsText = await bookingsRes.text();
    console.log(`   Status: ${bookingsRes.status}`);
    console.log(`   Content-Type: ${bookingsRes.headers.get('content-type')}`);
    if (bookingsText.startsWith('{')) {
      console.log('   ✅ Returns JSON:', JSON.parse(bookingsText));
    } else {
      console.log('   ❌ Returns HTML:', bookingsText.substring(0, 100));
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }
  
  console.log('\n');
  console.log('📝 Summary:');
  console.log('   If all endpoints return HTML, the backend is not running correctly.');
  console.log('   Check Railway logs and redeploy if needed.');
}

testBackend();
