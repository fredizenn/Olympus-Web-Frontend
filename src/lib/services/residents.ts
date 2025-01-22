/* eslint-disable @typescript-eslint/no-explicit-any */
import { writable } from 'svelte/store';
import { client } from '.';
import { apiErrorHandler } from '$lib/utils/helpers';

export const residentsStore = writable<any>([]);

export interface IResident {
    firstName: string,
    lastName: string,
    email: string,
    sex: string,
    phoneNumber: string,
    roomNumber?: string,
}
// export const getResidents = async () => {
// 	try {
// 		if (browser) {
// 			const querySnapshot = await getDocs(collection(hmSysDb, 'residents'));
// 			const residents: any = [];
// 			querySnapshot.forEach((doc) => {
// 				residents.push({ ...doc.data() });
// 			});
// 			residentsStore.set(residents);
// 		}
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

export async function getResidents () {
	try {
		const response = await client.get('residents');
		return response.data;
	} catch (error) {
		apiErrorHandler(error);
	}
}

// export const addResident = async (data: any) => {
// 	try {
// 		await addDoc(collection(hmSysDb, 'residents'), data);
// 		return {
// 			success: true,
// 			message: 'Resident added successfully.',
// 		}
// 	} catch (error) {
// 		apiErrorHandler(error);
// 	}
// }
