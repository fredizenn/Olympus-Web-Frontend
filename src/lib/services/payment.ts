/* eslint-disable @typescript-eslint/no-explicit-any */
import { browser } from "$app/environment";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { hmSysDb } from "./server";
import { writable } from "svelte/store";

export interface IPayment {
	resident: any;
	amountPaid: number;
	room: any;
	dateOfPayment: Date;
}

export const paymentsStore = writable<any>([]);

export const getPayments = async () => {
	try {
		if (browser) {
			const querySnapshot = await getDocs(collection(hmSysDb, 'payments'));
			const payments: any = [];
			querySnapshot.forEach((doc) => {
				payments.push({ ...doc.data() });
			});
			paymentsStore.set(payments);
		}
	} catch (error) {
		console.log(error);
	}
};

export const addPayment = async (data: IPayment) => {
	try {
		await addDoc(collection(hmSysDb, 'payments'), data);
		return {
			success: true,
			message: 'Payment added successfully.'
		};
	} catch (e) {
		return {
			message: e
		};
	}
};