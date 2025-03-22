import { connectDB } from './db';
import bcrypt from 'bcrypt';

async function createAdmin() {
    const db = await connectDB();
    const users = db.collection('users');

    const existingAdmin = await users.findOne({ username: 'username' });
    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('password', 10);
        await users.insertOne({
            username: 'username',
            password: hashedPassword
        });
        console.log('Admin account created.');
    } else {
        console.log('Admin already exists.');
    }
}

createAdmin();
