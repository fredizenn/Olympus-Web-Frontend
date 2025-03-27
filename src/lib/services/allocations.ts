import { apiErrorHandler } from "$lib/utils/helpers";
import { client } from ".";

export async function GetAllocations () {
	try {
		const response = await client.get('/allocations');
		return response.data;
	} catch (error) {
		apiErrorHandler(error);
	}
}

export async function AllocateRoom (data: any) {
	try {
		const response = await client.post('/allocation', data);
		return response.data;
	} catch (error) {
		apiErrorHandler(error);
	}
}