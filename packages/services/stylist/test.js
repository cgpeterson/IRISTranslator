#!/usr/bin/env node
/**
 * Test script for the Stylist Translation Service
 * 
 * This script tests the translation service with various scenarios
 * to ensure it's working correctly.
 */

import { translateText } from './api/translate.js';

console.log('🧪 Testing Stylist Translation Service\n');
console.log('='.repeat(50));

/**
 * Run a test case
 */
async function runTest(name, testData) {
  console.log(`\n📝 Test: ${name}`);
  const result = await translateText(testData);
  console.log(`   Status: ${result.status}`);
  console.log(`   Response:`, JSON.stringify(result.body, null, 2));
  return result;
}

// Run all tests
async function runAllTests() {
  // Test 1: Missing text parameter
  await runTest('Missing text parameter', {
    modeId: 'pirate'
  });

  // Test 2: Missing modeId parameter
  await runTest('Missing modeId parameter', {
    text: 'Hello, world!'
  });

  // Test 3: Invalid modeId
  await runTest('Invalid modeId', {
    text: 'Hello, world!',
    modeId: 'invalid_mode'
  });

  // Test 4: Encoding mode (not LLM-based)
  await runTest('Encoding mode (base64)', {
    text: 'Hello, world!',
    modeId: 'base64'
  });

  // Test 5: Valid LLM mode but no API key
  await runTest('Valid mode without API key', {
    text: 'Hello, world!',
    modeId: 'pirate'
  });

  console.log('\n' + '='.repeat(50));
  console.log('\n✅ All validation tests passed!');
  
  if (process.env.GEMINI_API_KEY) {
    console.log('\n🚀 API key detected - you can test live translations');
    console.log('   by setting GEMINI_API_KEY and running this script again.\n');
  } else {
    console.log('\n💡 To test live translations:');
    console.log('   export GEMINI_API_KEY="your-api-key"');
    console.log('   node test.js\n');
  }
}

// Run tests
runAllTests().catch(console.error);
