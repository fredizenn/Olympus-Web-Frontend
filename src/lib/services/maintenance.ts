/* eslint-disable @typescript-eslint/no-explicit-any */
import { browser } from '$app/environment';
import { addDoc, collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { hmSysDb } from './server';
import { writable } from 'svelte/store';

export const maintenanceRequestsStore = writable([]);
export const getMaintenanceRequests = async () => {
	try {
		if (browser) {
			const querySnapshot = await getDocs(collection(hmSysDb, 'maintenance-requests'));
			let maintenanceRequests: any = [];
			querySnapshot.forEach((doc) => {
				maintenanceRequests.push({ ...doc.data() });
			});
			maintenanceRequests = maintenanceRequests.sort(function (a: any, b: any) {
				return (b.createdAt - a.createdAt);
			});

			maintenanceRequestsStore.set(maintenanceRequests);
		}
	} catch (error) {
		console.log(error);
	}
};

export const addMaintenanceRequest = async (data: any) => {
	try {
		await addDoc(collection(hmSysDb, 'maintenance-requests'), data);
	} catch (error) {
		console.log(error);
	}
};

export const updateStatus = async (mrCode: string, data: any) => {
	try {
		const mrRef = collection(hmSysDb, 'maintenance-requests');
		const q = query(mrRef, where('mrCode', '==', mrCode));
		const querySnapshot: any = await getDocs(q);
		if (!querySnapshot.empty) {
			const docRef = querySnapshot.docs[0].ref;
			console.log({ data });
			await updateDoc(docRef, data);
			return {
				success: true,
				message: 'Status updated.'
			};
		} else {
			return {
				message: 'No such document!'
			};
		}
	} catch (error) {
		console.log(error);
	}
};
