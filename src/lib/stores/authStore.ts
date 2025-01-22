import { writable } from "svelte/store";

export const authenticated = writable(getUser());
interface UserProfile {
	fullName: string;
	userName: string;
}

export const profile = writable<UserProfile | null>(null);
export const token = writable<string>('');

export const logout = () => {
	if (typeof window !== 'undefined') {
		token.set('');
		profile.set(null);
		authenticated.set(false);
		localStorage.clear();
	}
};

export function getUser(): boolean {
	let token;
	if (typeof window !== 'undefined') token = localStorage.getItem('x');
	return !!token;
}


export function getProfile(): boolean {
	let profile;
	if (typeof window !== 'undefined') profile = localStorage.getItem('p');
	if (profile) {
		return true;
	} else {
		return false;
	}
}

export async function init() {
	if (typeof window !== 'undefined') {
		
		const t: string | null = localStorage.getItem('x');
		const p: string | null = localStorage.getItem('p');
		
		if (t && p) {
			await initUser(t, JSON.parse(p));
		} else {
			return 'No user found';
		}
	}
}

export function initUser(
	userToken: string,
	userProfile: UserProfile
): Promise<{ success: boolean; message: string }> {
	return new Promise((resolve, reject) => {
		try {

			token.set(userToken);
			profile.set(userProfile);

			if (typeof window !== 'undefined') {
				authenticated.set(true);
				localStorage.setItem('x', userToken);
				localStorage.setItem('p', JSON.stringify(userProfile));
			}

			resolve({
				success: true,
				message: 'User initialised successfully'
			});
		} catch (error) {
			reject(error);
		}
	});
}
