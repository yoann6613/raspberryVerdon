import { json } from '@sveltejs/kit';

export async function GET({ locals }) {
    if (!locals.user) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    return json({ message: 'Welcome, admin!', user: locals.user });
}
