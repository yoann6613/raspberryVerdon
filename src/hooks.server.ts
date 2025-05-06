import type { Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('jwt'); // ✅ récupère depuis le cookie

	if (token) {
		try {
			const user = jwt.verify(token, process.env.JWT_SECRET as string) as { username: string };
			event.locals.user = user;
		} catch (error) {
			console.error('JWT invalide', error);
			event.locals.user = undefined;
		}
	} else {
		event.locals.user = undefined;
	}

	return resolve(event);
};
