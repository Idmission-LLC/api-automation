const fs = require('fs');
const path = require('path');

const b64 = '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';
const buffer = Buffer.from(b64, 'base64');

const dir = path.join(__dirname, 'images');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(path.join(dir, 'idFront.jpg'), buffer);
fs.writeFileSync(path.join(dir, 'idBack.jpg'), buffer);
fs.writeFileSync(path.join(dir, 'selfie.jpg'), buffer);
console.log('Images generated successfully.');
