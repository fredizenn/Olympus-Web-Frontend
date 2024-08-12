/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	addDoc,
	arrayUnion,
	collection,
	doc,
	getDocs,
	query,
	updateDoc,
	where
} from 'firebase/firestore';
import { writable } from 'svelte/store';
import { hmSysDb } from './server';
import { browser } from '$app/environment';

export interface IRoom {
	roomNumber: string;
	numberOfOccupants: number;
	isVacant: boolean;
	occupants: any;
	currentVacancy?: number;
}
export const roomsStore = writable([]);

export const getRooms = async () => {
	try {
		if (browser) {
			const querySnapshot = await getDocs(collection(hmSysDb, 'rooms'));
			const rooms: any = [];
			querySnapshot.forEach((doc) => {
				rooms.push({ ...doc.data() });
			});
			roomsStore.set(rooms);
		}
	} catch (error) {
		console.log(error);
	}
};

export const addRoom = async (data: IRoom) => {
	const ret = await addDoc(collection(hmSysDb, 'rooms'), data);
	console.log({ ret });
};

export const allocation = async (roomCode: string, data: any) => {
	try {
		const roomRef = collection(hmSysDb, 'rooms');
		const q = query(roomRef, where('roomCode', '==', roomCode));
		const querySnapshot: any = await getDocs(q);
		if (!querySnapshot.empty) {
			const docRef = querySnapshot.docs[0].ref;
			await updateDoc(docRef, { occupants: arrayUnion(data[0]) });
		} else {
			console.log('No such document!');
		}
		// console.log({itemRef})
		// const ret = await updateDoc(itemRef, data);
		// console.log({ret})
	} catch (e) {
		console.log(e);
	}
};
