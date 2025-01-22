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

export const getPayments = async () => {
	try {
		const ret = await client.get('/payments');
		return ret.data;
	} catch (error) {
		apiErrorHandler(error);
	}
};

export const addPayment = async (data: IPayment) => {
	try {
		const ret = await client.post('/payments', data);
		return ret.data;
	} catch (error) {
		apiErrorHandler(error);
	}
};