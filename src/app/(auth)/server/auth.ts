import { SESSION_COOKIE_NAME, verifySessionToken } from './session';
import { cookies } from 'next/headers';
export async function getSession() {
    const cookieStore = await cookies();

    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const accessToken = cookieStore.get('accessToken')?.value;

    if(!sessionToken || !accessToken) {
        return null;
    }
     return verifySessionToken(sessionToken);
}