import type { Handle } from '@sveltejs/kit';

import jwt from 'jsonwebtoken';

export const handle: Handle = async ({ event, resolve }) => {
    const authHeader = event.request.headers.get('authorization');

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        try {
            const user = jwt.verify(token, process.env.JWT_SECRET as string) as { username: string };
            event.locals.user = user;
        } catch (error) {
            return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
        }
    }

    return resolve(event);
};
