import { runAllAutomatedTests } from '../src/lib/test-suite';

console.log('====================================================');
console.log('  CC-TOOLKIT AUTOMATED VERIFICATION TEST RUNNER     ');
console.log('====================================================\n');

const summary = runAllAutomatedTests();

let currentSuite = '';
for (const test of summary.results) {
  if (test.suite !== currentSuite) {
    currentSuite = test.suite;
    console.log(`\n📁 [${currentSuite}]`);
  }
  const icon = test.passed ? '✅ PASS' : '❌ FAIL';
  console.log(`  ${icon} : ${test.testName} (${test.durationMs}ms)`);
  if (!test.passed && test.message) {
    console.log(`         Error: ${test.message}`);
  }
}

console.log('\n----------------------------------------------------');
console.log(`Total Tests : ${summary.total}`);
console.log(`Passed      : ${summary.passed}`);
console.log(`Failed      : ${summary.failed}`);
console.log('----------------------------------------------------');

if (summary.failed > 0) {
  console.error(`\n❌ TEST SUITE FAILED (${summary.failed} failures)`);
  process.exit(1);
} else {
  console.log('\n✨ ALL TESTS PASSED SUCCESSFULLY! (100% PASS RATE)');
  process.exit(0);
}
