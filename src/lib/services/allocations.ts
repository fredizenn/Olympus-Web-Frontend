/* eslint-disable @typescript-eslint/no-explicit-any */
import { addDoc, collection, doc, getDocs, query, where } from 'firebase/firestore';
import { hmSysDb } from './server';
import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { getDoc } from 'firebase/firestore/lite';

export const allocationsStore = writable([]);
export const roomAllocationStore = writable([]);
export const getAllocations = async () => {
	try {
		if (browser) {
			const querySnapshot = await getDocs(collection(hmSysDb, 'allocations'));
			const allocations: any = [];
			querySnapshot.forEach((doc) => {
				allocations.push({ ...doc.data() });
			});
			allocationsStore.set(allocations);
		}
	} catch (error) {
		console.log(error);
	}
};

export const allocate = async (data: any) => {
	await addDoc(collection(hmSysDb, 'allocations'), data);
};

export const getRoomAllocation = async (roomCode: string) => {
	try {
		const roomRef = collection(hmSysDb, 'allocations');
        const r = query(roomRef, where('room', '==', roomCode));
        const querySnapshot: any = await getDocs(r);
        const x: any = []
        querySnapshot.forEach((doc: any) => {
            x.push(doc.data().occupants[0]);
        })
        console.log({x})
		roomAllocationStore.set(x);
	} catch (error) {
		console.log(error);
	}
};
