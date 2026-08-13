const url = 'https://uatauth.idmission.com/auth/realms/identity/protocol/openid-connect/token';

const username = 'ev_integ_54170';
const password = 'HWTe#14560$';
const clientId = '54170';
const clientSecret = '6610d924-3cc3-49d7-a983-77d4346a66fc';

async function test1() {
    console.log('Testing Method 1: All in form body');
    try {
        const params = new URLSearchParams();
        params.append('grant_type', 'password');
        params.append('client_id', clientId);
        params.append('client_secret', clientSecret);
        params.append('username', username);
        params.append('password', password);

        const res = await fetch(url, {
            method: 'POST',
            body: params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        const data = await res.json();
        console.log('Method 1 Success:', data.access_token ? 'Got Token' : data);
    } catch (err) {
        console.log('Method 1 Failed:', err);
    }
}

async function test2() {
    console.log('\nTesting Method 2: Client Credentials in Basic Auth Header');
    try {
        const params = new URLSearchParams();
        params.append('grant_type', 'password');
        params.append('username', username);
        params.append('password', password);

        const authHeader = 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

        const res = await fetch(url, {
            method: 'POST',
            body: params,
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': authHeader
            }
        });
        const data = await res.json();
        console.log('Method 2 Success:', data.access_token ? 'Got Token' : data);
    } catch (err) {
        console.log('Method 2 Failed:', err);
    }
}

async function run() {
    await test1();
    await test2();
}

run();
