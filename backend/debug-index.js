// Create a NEW temporary file called debug-index.js
// This will help us isolate exactly where the error is occurring

import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

console.log('🔍 Starting step-by-step debugging...');

// Step 1: Test basic Express setup
app.get('/', (req, res) => {
  res.json({ message: 'Debug server running', step: 'basic-setup-ok' });
});

console.log('✅ Step 1: Basic Express setup - OK');

// Step 2: Test each route file individually
console.log('🧪 Step 2: Testing route imports one by one...');

const testRoute = async (routePath, routeName, mountPath) => {
  try {
    console.log(`\n🔍 Testing: ${routeName}`);
    console.log(`📁 Path: ${routePath}`);
    console.log(`🗺️  Mount: ${mountPath}`);
    
    const startTime = Date.now();
    const { default: router } = await import(routePath);
    const importTime = Date.now() - startTime;
    
    console.log(`⏱️  Import time: ${importTime}ms`);
    
    // Try to register the route
    app.use(mountPath, router);
    
    console.log(`✅ ${routeName} - SUCCESS`);
    return { success: true, name: routeName };
    
  } catch (error) {
    console.error(`❌ ${routeName} - FAILED`);
    console.error(`🚨 Error message: ${error.message}`);
    console.error(`📍 Error stack:\n${error.stack}`);
    return { success: false, name: routeName, error: error.message };
  }
};

// Test each route systematically
const runSystematicTest = async () => {
  const routes = [
    ['./routes/users.routes.js', 'UserRouter', '/api/v1/user'],
    ['./routes/oauth2.0.routes.js', 'OAuth2Router', '/api/v1/oauth'],
    ['./routes/stores.routes.js', 'StoreRouter', '/api/v1/store'],
    ['./routes/services.routes.js', 'ServiceRouter', '/api/v1/service'],
    ['./routes/appointments.routes.js', 'AppointmentRouter', '/api/v1/appointment']
  ];

  const results = [];
  
  for (const [path, name, mount] of routes) {
    const result = await testRoute(path, name, mount);
    results.push(result);
    
    if (!result.success) {
      console.log(`\n🛑 STOPPING AT FAILED ROUTE: ${name}`);
      console.log(`🎯 The error is in: ${path}`);
      break;
    }
    
    // Small delay for readability
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Summary
  console.log('\n📊 RESULTS SUMMARY:');
  console.log('==================');
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.name}: ${result.success ? 'OK' : result.error}`);
  });

  if (results.every(r => r.success)) {
    console.log('\n🎉 All routes imported successfully!');
    console.log('🤔 The error might be in middleware or database connection...');
    
    // Test server start
    app.listen(PORT, () => {
      console.log(`🚀 Debug server running on port ${PORT}`);
      console.log(`🔍 Visit http://localhost:${PORT} to test`);
    });
  } else {
    console.log('\n💡 NEXT STEPS:');
    console.log('1. Fix the failing route file');
    console.log('2. Look for template literal syntax errors (backticks vs quotes)');
    console.log('3. Check for malformed route patterns in controllers');
    process.exit(1);
  }
};

// Add error handlers
process.on('unhandledRejection', (err) => {
  console.error('🚨 Unhandled Rejection:', err.message);
  console.error('Stack:', err.stack);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('🚨 Uncaught Exception:', err.message);
  console.error('Stack:', err.stack);
  process.exit(1);
});

console.log('🚀 Starting systematic route testing...\n');
runSystematicTest().catch(error => {
  console.error('💥 Critical error in test runner:', error);
  process.exit(1);
});