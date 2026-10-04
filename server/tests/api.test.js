import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import app from '../src/app.js';
import { pool, testConnection } from '../src/config/db.js';

let server;
let baseUrl;


let adminToken = '';
let storeOwnerToken = '';
let userToken = '';
let createdUserId = null;
let createdStoreId = null;
let createdRatingId = null;

const request = (method, path, body = null, headers = {}) => {
    return new Promise((resolve, reject) => {
        const url = new URL(path, baseUrl);
        const reqHeaders = {
            'Content-Type': 'application/json',
            ...headers
        };

        const payload = body ? JSON.stringify(body) : null;
        if (payload) {
            reqHeaders['Content-Length'] = Buffer.byteLength(payload);
        }

        const req = http.request(url, { method, headers: reqHeaders }, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const parsed = data ? JSON.parse(data) : {};
                    resolve({ status: res.statusCode, headers: res.headers, body: parsed });
                } catch (err) {
                    resolve({ status: res.statusCode, headers: res.headers, body: data });
                }
            });
        });

        req.on('error', reject);
        if (payload) req.write(payload);
        req.end();
    });
};

describe('Roxiler Full-Stack API & Assessment Verification Suite', () => {
    before(async () => {
        const isDbConnected = await testConnection();
        assert.strictEqual(isDbConnected, true, 'Database must be reachable for integration testing');

        await new Promise((resolve) => {
            server = app.listen(0, () => {
                const port = server.address().port;
                baseUrl = `http://localhost:${port}`;
                console.log(`\n🧪 Automated Integration Test Server listening on ${baseUrl}\n`);
                resolve();
            });
        });
    });

    after(async () => {
        if (server) server.close();
        await pool.end();
    });

    
    
    
    describe('1. Authentication & Security Enforcement', () => {
        test('Admin Login succeeds with valid seed credentials', async () => {
            const res = await request('POST', '/api/auth/login', {
                email: 'admin@roxiler.com',
                password: 'Password@123'
            });

            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.body.success, true);
            assert.ok(res.body.data.token);
            assert.strictEqual(res.body.data.user.role, 'ADMIN');
            adminToken = res.body.data.token;
        });

        test('Store Owner Login succeeds with valid seed credentials', async () => {
            const res = await request('POST', '/api/auth/login', {
                email: 'owner@roxiler.com',
                password: 'Password@123'
            });

            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.body.success, true);
            assert.ok(res.body.data.token);
            assert.strictEqual(res.body.data.user.role, 'STORE_OWNER');
            storeOwnerToken = res.body.data.token;
        });

        test('Normal User Login succeeds with valid seed credentials', async () => {
            const res = await request('POST', '/api/auth/login', {
                email: 'user1@roxiler.com',
                password: 'Password@123'
            });

            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.body.success, true);
            assert.ok(res.body.data.token);
            assert.strictEqual(res.body.data.user.role, 'USER');
            userToken = res.body.data.token;
        });

        test('Login with non-existent email returns generic 401 message', async () => {
            const res = await request('POST', '/api/auth/login', {
                email: 'nonexistent_user_999@domain.com',
                password: 'Password@123'
            });

            assert.strictEqual(res.status, 401);
            assert.strictEqual(res.body.success, false);
            assert.strictEqual(res.body.message, 'Invalid email or password.');
        });

        test('Login with incorrect password returns generic 401 message', async () => {
            const res = await request('POST', '/api/auth/login', {
                email: 'admin@roxiler.com',
                password: 'WrongPassword999!'
            });

            assert.strictEqual(res.status, 401);
            assert.strictEqual(res.body.success, false);
            assert.strictEqual(res.body.message, 'Invalid email or password.');
        });

        test('Protected route rejects unauthenticated request', async () => {
            const res = await request('GET', '/api/users/profile');
            assert.strictEqual(res.status, 401);
            assert.strictEqual(res.body.success, false);
        });

        test('Protected route rejects invalid or corrupted JWT token', async () => {
            const res = await request('GET', '/api/users/profile', null, {
                Authorization: 'Bearer invalid.token.payload'
            });
            assert.strictEqual(res.status, 401);
            assert.strictEqual(res.body.success, false);
        });

        test('Role-based endpoint rejects unauthorized role (USER accessing ADMIN route)', async () => {
            const res = await request('GET', '/api/admin/dashboard', null, {
                Authorization: `Bearer ${userToken}`
            });

            assert.strictEqual(res.status, 403);
            assert.strictEqual(res.body.success, false);
        });
    });

    
    
    
    describe('2. Validation Boundaries Verification', () => {
        test('Signup fails if Name is shorter than 20 characters', async () => {
            const res = await request('POST', '/api/auth/signup', {
                name: 'Short Name',
                email: `validtest_${Date.now()}@domain.com`,
                password: 'Password@123',
                address: '123 Valid Street Address, Suite 100, City State Zip'
            });

            assert.strictEqual(res.status, 400);
            assert.strictEqual(res.body.success, false);
            assert.ok(res.body.errors.some(e => e.includes('20 and 60 characters')));
        });

        test('Signup fails if Password lacks uppercase letter or special character', async () => {
            const res = await request('POST', '/api/auth/signup', {
                name: 'Valid Long Name For Testing Purpose Only',
                email: `validtest_${Date.now()}@domain.com`,
                password: 'password123',
                address: '123 Valid Street Address, Suite 100, City State Zip'
            });

            assert.strictEqual(res.status, 400);
            assert.strictEqual(res.body.success, false);
            assert.ok(res.body.errors.some(e => e.includes('uppercase')));
        });

        test('Signup succeeds with all valid boundary inputs', async () => {
            const testEmail = `newuser_${Date.now()}@testdomain.com`;
            const res = await request('POST', '/api/auth/signup', {
                name: 'Automated Test User Account Full Name',
                email: testEmail,
                password: 'Password@123',
                address: '100 Automated Test Suite Highway, Austin TX 78701'
            });

            assert.strictEqual(res.status, 201);
            assert.strictEqual(res.body.success, true);
            assert.ok(res.body.data.token);
            assert.strictEqual(res.body.data.user.role, 'USER');
        });
    });

    
    
    
    describe('3. Admin Operations & Statistics', () => {
        test('Admin fetches Dashboard Statistics successfully', async () => {
            const res = await request('GET', '/api/admin/dashboard', null, {
                Authorization: `Bearer ${adminToken}`
            });

            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.body.success, true);
            assert.strictEqual(typeof res.body.data.totalUsers, 'number');
            assert.strictEqual(typeof res.body.data.totalStores, 'number');
            assert.strictEqual(typeof res.body.data.totalRatings, 'number');
        });

        test('Admin creates new Store Owner user account', async () => {
            const testEmail = `newowner_${Date.now()}@testdomain.com`;
            const res = await request('POST', '/api/admin/users', {
                name: 'Automated Store Owner Dedicated Account',
                email: testEmail,
                password: 'Password@123',
                address: '500 Commerce Center Parkway, Suite 200, Dallas TX',
                role: 'STORE_OWNER'
            }, {
                Authorization: `Bearer ${adminToken}`
            });

            assert.strictEqual(res.status, 201);
            assert.strictEqual(res.body.success, true);
            assert.strictEqual(res.body.data.role, 'STORE_OWNER');
            createdUserId = res.body.data.id;
        });

        test('Admin creates new Store and assigns owner', async () => {
            const res = await request('POST', '/api/admin/stores', {
                name: 'Automated Test Superstore Outlet',
                email: 'contact@testsuperstore.com',
                address: '900 Innovation Boulevard, Tech City CA 94000',
                owner_id: createdUserId
            }, {
                Authorization: `Bearer ${adminToken}`
            });

            assert.strictEqual(res.status, 201);
            assert.strictEqual(res.body.success, true);
            assert.ok(res.body.data.id);
            createdStoreId = res.body.data.id;
        });

        test('Admin lists users with search filter and sorting', async () => {
            const res = await request('GET', '/api/admin/users?search=Automated&role=STORE_OWNER&sortBy=name&sortOrder=ASC', null, {
                Authorization: `Bearer ${adminToken}`
            });

            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.body.success, true);
            assert.ok(Array.isArray(res.body.data));
            assert.ok(res.body.data.length > 0);
        });

        test('Admin lists stores with search filter and sorting', async () => {
            const res = await request('GET', '/api/admin/stores?search=Test&sortBy=name&sortOrder=ASC', null, {
                Authorization: `Bearer ${adminToken}`
            });

            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.body.success, true);
            assert.ok(Array.isArray(res.body.data));
            assert.ok(res.body.data.length > 0);
        });
    });

    
    
    
    describe('4. Store Rating, Updating, Duplicate Prevention & Privacy', () => {
        test('User browses stores list with user submitted rating', async () => {
            const res = await request('GET', '/api/stores', null, {
                Authorization: `Bearer ${userToken}`
            });

            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.body.success, true);
            assert.ok(Array.isArray(res.body.data));
        });

        test('User submits rating (5 stars) for store', async () => {
            const res = await request('POST', '/api/ratings', {
                store_id: createdStoreId,
                rating: 5
            }, {
                Authorization: `Bearer ${userToken}`
            });

            assert.strictEqual(res.status, 201);
            assert.strictEqual(res.body.success, true);
            assert.strictEqual(res.body.data.submitted_rating, 5);
        });

        test('User updates existing rating from 5 to 4 stars', async () => {
            
            const storeRes = await request('GET', '/api/stores', null, {
                Authorization: `Bearer ${userToken}`
            });

            const storeData = storeRes.body.data.find(s => s.id === createdStoreId);
            assert.ok(storeData);
            assert.ok(storeData.user_rating_id);
            createdRatingId = storeData.user_rating_id;

            const res = await request('PUT', `/api/ratings/${createdRatingId}`, {
                rating: 4
            }, {
                Authorization: `Bearer ${userToken}`
            });

            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.body.success, true);
            assert.strictEqual(res.body.data.new_rating, 4);
        });

        test('Rating input outside 1-5 integer range is rejected', async () => {
            const res = await request('POST', '/api/ratings', {
                store_id: createdStoreId,
                rating: 6
            }, {
                Authorization: `Bearer ${userToken}`
            });

            assert.strictEqual(res.status, 400);
            assert.strictEqual(res.body.success, false);
        });

        test('Public store ratings API does not leak user emails or addresses', async () => {
            const res = await request('GET', `/api/ratings/store/${createdStoreId}`);

            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.body.success, true);
            assert.ok(Array.isArray(res.body.data));

            if (res.body.data.length > 0) {
                const item = res.body.data[0];
                assert.strictEqual(item.user_email, undefined, 'Public rating response MUST NOT include user_email');
                assert.strictEqual(item.user_address, undefined, 'Public rating response MUST NOT include user_address');
                assert.ok(item.user_name, 'Public rating response includes reviewer name');
            }
        });
    });

    
    
    
    describe('5. Store Owner Dashboard & Isolation', () => {
        test('Store Owner retrieves assigned store dashboard', async () => {
            const res = await request('GET', '/api/stores/owner/dashboard', null, {
                Authorization: `Bearer ${storeOwnerToken}`
            });

            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.body.success, true);
            assert.ok(res.body.data.store);
            assert.ok(Array.isArray(res.body.data.ratedUsers));
        });
    });
});
