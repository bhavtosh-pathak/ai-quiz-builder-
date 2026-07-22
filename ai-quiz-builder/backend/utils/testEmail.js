
/**
 * Standalone diagnostic script — tests the Brevo email path in isolation,
 * bypassing register/login/frontend entirely, so any failure points
 * straight at the real cause instead of getting lost in the full request
 * flow.
 *
 * Usage (from the backend/ folder):
 *   node utils/testEmail.js your_real_email@example.com
 */
require('dotenv').config();
const sendOTPEmail = require('../services/emailService');

const testEmail = process.argv[2];

if (!testEmail) {
  console.log('Usage: node utils/testEmail.js your_real_email@example.com');
  process.exit(1);
}

console.log('--- Environment check ---');
console.log('BREVO_API_KEY:', process.env.BREVO_API_KEY ? `set (starts with "${process.env.BREVO_API_KEY.slice(0, 10)}...")` : '❌ MISSING');
console.log('BREVO_SENDER_EMAIL:', process.env.BREVO_SENDER_EMAIL || '❌ MISSING');
console.log('BREVO_SENDER_NAME:', process.env.BREVO_SENDER_NAME || '(not set — will default to "AI Quiz Builder")');
console.log('-------------------------');
console.log(`Sending a test OTP email to ${testEmail} ...`);

sendOTPEmail(testEmail, '123456')
  .then(() => {
    console.log('✅ SUCCESS — Brevo accepted the request.');
    console.log('Check the inbox (and spam folder) for', testEmail);
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ FAILED:', err.message);
    console.error('(Scroll up — the detailed Brevo API response, if any, was logged above by emailService.js)');
    process.exit(1);
  });