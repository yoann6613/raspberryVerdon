import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(303, '/api/login');
  }

  return {
    user: locals.user
  };
};
