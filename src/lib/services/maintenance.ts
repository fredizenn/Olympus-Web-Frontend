/* eslint-disable @typescript-eslint/no-explicit-any */
import { writable } from 'svelte/store';
import { client } from '.';
import { apiErrorHandler } from '$lib/utils/helpers';

export const maintenanceRequestsStore = writable([]);
export const getMaintenanceRequests = async () => {
	try {
		const ret = await client.get('/MaintenanceRequests');
		return ret.data;
	} catch (error) {
		apiErrorHandler(error);
	}
};

export const addMaintenanceRequest = async (data: any) => {
	try {
		const ret = await client.post('/MaintenanceRequest', {...data});
		return ret.data;
	} catch (error) {
		apiErrorHandler(error);
	}
};

