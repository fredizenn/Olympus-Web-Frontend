/* eslint-disable @typescript-eslint/no-explicit-any */
import { writable } from 'svelte/store';
import { client } from '.';
import { apiErrorHandler } from '$lib/utils/helpers';

export interface IRoom {
	roomNumber: string;
	numberOfOccupants: number;
	isVacant: boolean;
	occupants: any;
	currentVacancy?: number;
}
export const roomsStore = writable<any>([]);

export const getRooms = async () => {
	try {
		const ret = await client.get('/rooms');
		return ret.data;
	} catch (error) {
		apiErrorHandler(error);
	}
};

export const addRoom = async (data: IRoom) => {
	try {
		const ret = await client.post('/rooms', data);
		return ret.data;
	} catch (error) {
		apiErrorHandler(error);
	}
};

