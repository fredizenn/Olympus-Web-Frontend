/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiErrorHandler } from "$lib/utils/helpers";
import { writable } from "svelte/store";
import { client } from ".";

export interface IPayment {
	residentID: any;
	allocationID: any;
	paymentDate: Date;
	amount: number;
	amountPaid: number;
	balanceDue: number;
}

export const paymentsStore = writable<any>([]);

export const GetPayments = async () => {
	try {
		const ret = await client.get('/AllPayments');
		return ret.data;
	} catch (error) {
		apiErrorHandler(error);
	}
};

export const AddPayment = async (data: IPayment) => {
	try {
		const ret = await client.post('/payment', {
			...data
		});
		return ret.data;
	} catch (error) {
		apiErrorHandler(error);
	}
};