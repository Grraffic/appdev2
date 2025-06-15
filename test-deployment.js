/**
 * Deployment Test Script
 * 
 * Tests the deployed API on Render to ensure all endpoints are working correctly
 */

const https = require('https');
const http = require('http');

const BASE_URL = 'https://appdev2-qc9f.onrender.com';

/**
 * Make HTTP request
 */
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const requestOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      timeout: 30000 // 30 second timeout
    };

    const req = protocol.request(url, requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

/**
 * Test authentication endpoint
 */
async function testAuthentication() {
  console.log('🔐 Testing Authentication...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/auth/signin`, {
      method: 'POST',
      body: {
        email: 'admin@bookapi.com',
        password: 'admin123'
      }
    });

    if (response.status === 200 && response.data.token) {
      console.log('✅ Authentication successful');
      console.log(`   Token received: ${response.data.token.substring(0, 50)}...`);
      return response.data.token;
    } else {
      console.log('❌ Authentication failed');
      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(response.data)}`);
      return null;
    }
  } catch (error) {
    console.log('❌ Authentication error:', error.message);
    return null;
  }
}

/**
 * Test books endpoint
 */
async function testBooks(token) {
  console.log('\n📚 Testing Books Endpoint...');
  
  if (!token) {
    console.log('❌ No token available, skipping books test');
    return;
  }

  try {
    const response = await makeRequest(`${BASE_URL}/api/books`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 200) {
      console.log('✅ Books endpoint successful');
      console.log(`   Found ${Array.isArray(response.data) ? response.data.length : 0} books`);
      
      if (Array.isArray(response.data) && response.data.length > 0) {
        console.log(`   Sample book: "${response.data[0].title}" by ${response.data[0].author}`);
      }
    } else {
      console.log('❌ Books endpoint failed');
      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    console.log('❌ Books endpoint error:', error.message);
  }
}

/**
 * Test book creation
 */
async function testBookCreation(token) {
  console.log('\n📖 Testing Book Creation...');
  
  if (!token) {
    console.log('❌ No token available, skipping book creation test');
    return;
  }

  try {
    const response = await makeRequest(`${BASE_URL}/api/books`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        title: 'Deployment Test Book',
        author: 'Test Author'
      }
    });

    if (response.status === 201) {
      console.log('✅ Book creation successful');
      console.log(`   Created book: "${response.data.title}" by ${response.data.author}`);
      console.log(`   Book ID: ${response.data._id}`);
      return response.data._id;
    } else {
      console.log('❌ Book creation failed');
      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(response.data)}`);
      return null;
    }
  } catch (error) {
    console.log('❌ Book creation error:', error.message);
    return null;
  }
}

/**
 * Test service health
 */
async function testServiceHealth() {
  console.log('🏥 Testing Service Health...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/auth/signin`, {
      method: 'HEAD'
    });

    if (response.status < 500) {
      console.log('✅ Service is responding');
      console.log(`   Status: ${response.status}`);
    } else {
      console.log('⚠️ Service health check failed');
      console.log(`   Status: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Service health check error:', error.message);
  }
}

/**
 * Main test function
 */
async function runDeploymentTests() {
  console.log('🚀 Starting Deployment Tests');
  console.log(`📡 Testing API at: ${BASE_URL}`);
  console.log('=' .repeat(50));

  // Test service health first
  await testServiceHealth();

  // Wait a bit for potential cold start
  console.log('\n⏳ Waiting for potential cold start...');
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Test authentication
  const token = await testAuthentication();

  // Test books endpoint
  await testBooks(token);

  // Test book creation
  const bookId = await testBookCreation(token);

  console.log('\n' + '=' .repeat(50));
  console.log('🏁 Deployment Tests Complete');
  
  if (token && bookId) {
    console.log('🎉 All tests passed! API is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Check the logs above for details.');
  }

  console.log('\n📋 Test Summary:');
  console.log(`   Authentication: ${token ? '✅ Pass' : '❌ Fail'}`);
  console.log(`   Books Endpoint: ${token ? '✅ Pass' : '❌ Fail'}`);
  console.log(`   Book Creation: ${bookId ? '✅ Pass' : '❌ Fail'}`);

  console.log('\n💡 Next Steps:');
  console.log('   1. Test with Postman or similar tool');
  console.log('   2. Verify MongoDB Atlas dashboard shows new data');
  console.log('   3. Check Render logs for any errors');
  console.log(`   4. Access your API at: ${BASE_URL}`);
}

// Run tests if this file is executed directly
if (require.main === module) {
  runDeploymentTests().catch(console.error);
}

module.exports = { runDeploymentTests };
