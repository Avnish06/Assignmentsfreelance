const assert = require('assert');

const API_BASE = 'http://127.0.0.1:5000/api/appointments';

async function testSuite() {
  console.log('====================================================');
  console.log('RUNNING FORMAL PRACTICAL ASSESSMENT TEST SUITE');
  console.log('Project: Appointment Manager (MERN)');
  console.log('Target: ' + API_BASE);
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(title, fn) {
    try {
      await fn();
      console.log(`[PASS] ${title}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${title}`);
      console.error(`       Error: ${err.message}`);
      failed++;
    }
  }

  // 1. Starting Data & Display Check
  await test('Starting Data: Verifies initial appointments exist in DB', async () => {
    const res = await fetch(API_BASE);
    const json = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(json.success, true);
    assert(Array.isArray(json.data), 'data should be an array');
    assert(json.data.length >= 3, 'Must contain at least 3 initial appointments');

    const names = json.data.map(a => a.customerName);
    assert(names.includes('Alex Morgan'), 'Alex Morgan must be present');
    assert(names.includes('Jamie Lee'), 'Jamie Lee must be present');
    assert(names.includes('Taylor Smith'), 'Taylor Smith must be present');
  });

  // 2. Field Validation Error Handling
  await test('Validation: Rejects appointment with missing fields & returns clear error messages', async () => {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: '',
        service: '',
        dateTime: ''
      })
    });
    const json = await res.json();
    assert.strictEqual(res.status, 400, 'Status should be 400 Bad Request');
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.message, 'Validation failed');
    assert(json.errors.customerName, 'Missing customerName error message');
    assert(json.errors.service, 'Missing service error message');
    assert(json.errors.dateTime, 'Missing dateTime error message');
  });

  // 3. Add Valid Appointment
  let createdAppointmentId = null;
  const testCustomer = 'Test Candidate ' + Math.floor(Math.random() * 1000);
  await test('Add Appointment: Successfully creates an appointment with all fields', async () => {
    const payload = {
      customerName: testCustomer,
      service: 'Consultation',
      dateTime: '2026-11-20T10:00:00',
      status: 'Pending'
    };
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    assert.strictEqual(res.status, 201, 'Status should be 201 Created');
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.customerName, testCustomer);
    assert.strictEqual(json.data.service, 'Consultation');
    assert.strictEqual(json.data.status, 'Pending');
    assert(json.data._id, 'Created appointment must have an _id');
    createdAppointmentId = json.data._id;
  });

  // 4. Status Transition
  await test('Status Change: Updates appointment status to Confirmed', async () => {
    assert(createdAppointmentId, 'Previous test must provide created appointment ID');
    const res = await fetch(`${API_BASE}/${createdAppointmentId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Confirmed' })
    });
    const json = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.status, 'Confirmed');
  });

  // 5. Status Filter
  await test('Status Filter: Filters appointments by status = Confirmed', async () => {
    const res = await fetch(`${API_BASE}?status=Confirmed`);
    const json = await res.json();
    assert.strictEqual(res.status, 200);
    assert(json.data.length > 0);
    for (const appt of json.data) {
      assert.strictEqual(appt.status, 'Confirmed', `Expected status Confirmed, got ${appt.status}`);
    }
  });

  // 6. Customer Name Search (Change Request)
  await test('Customer Search: Filters appointments matching search query case-insensitively', async () => {
    const res = await fetch(`${API_BASE}?search=${encodeURIComponent(testCustomer)}`);
    const json = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(json.data.length, 1);
    assert.strictEqual(json.data[0].customerName, testCustomer);
    assert.strictEqual(json.data[0]._id, createdAppointmentId);
  });

  // 7. Persistence Check
  await test('Persistence: Verifies changes persist across fresh database query', async () => {
    const res = await fetch(API_BASE);
    const json = await res.json();
    const found = json.data.find(a => a._id === createdAppointmentId);
    assert(found, 'Created appointment must still exist in MongoDB');
    assert.strictEqual(found.status, 'Confirmed', 'Persisted status must remain Confirmed');
  });

  // 8. Cleanup test data
  await test('Cleanup: Deletes temporary test appointment', async () => {
    if (createdAppointmentId) {
      const res = await fetch(`${API_BASE}/${createdAppointmentId}`, { method: 'DELETE' });
      assert.strictEqual(res.status, 200);
    }
  });

  console.log('\n====================================================');
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) process.exit(1);
}

testSuite();

