import { browser } from '$app/environment';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { writable } from 'svelte/store';
import { hmSysDb } from './server';

export const residentsStore = writable([]);

export interface IResident {
    firstName: string,
    lastName: string,
    email: string,
    sex: string,
    phoneNumber: string,
    roomNumber?: string,
}
export const getResidents = async () => {
	try {
		if (browser) {
			const querySnapshot = await getDocs(collection(hmSysDb, 'residents'));
			const residents: any = [];
			querySnapshot.forEach((doc) => {
				residents.push({ ...doc.data() });
			});
			residentsStore.set(residents);
		}
	} catch (error) {
		console.log(error);
	}
};

export const addResident = async (data: any) => {
    await addDoc(collection(hmSysDb, 'residents'), data);
}