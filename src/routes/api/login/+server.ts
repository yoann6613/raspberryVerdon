import { json } from '@sveltejs/kit';
import { connectDB } from '$lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface LoginRequest {
	username: string;
	password: string;
}

export async function POST({ request, cookies }) {
	const { username, password }: LoginRequest = await request.json();
	const db = await connectDB();
	const user = await db.collection('users').findOne({ username });

	if (!user || !(await bcrypt.compare(password, user.password))) {
		return json({ error: 'Identifiants invalides' }, { status: 401 });
	}

	const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET as string, {
		expiresIn: '1h'
	});

	// ✅ Placer le token dans un cookie HTTP-only
	cookies.set('jwt', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		path: '/',
		maxAge: 60 * 60 // 1 heure
	});

	return json({ success: true });
}
