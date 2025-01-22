/* eslint-disable @typescript-eslint/no-explicit-any */
import { writable } from 'svelte/store';
import { client } from '.';
import { apiErrorHandler } from '$lib/utils/helpers';

export interface IEmployee {
	firstName: string;
	lastName: string;
	dateEmployed: Date;
	phoneNumber: string;
	email: string;
	salary: number;
	position: string;
}

export const employeesStore = writable<any>([]);

export const getEmployees = async () => {
	try {
		const ret = await client.get('/employees');
		return ret.data;
	} catch (error) {
		apiErrorHandler(error);
	}
};

export const addEmployee = async (data: IEmployee) => {
	try {
		const ret = await client.post('/Employee', data);
		return ret.data;
	} catch (error) {
		apiErrorHandler(error);
	}
};

export const getEmployee = async (employeeId: string) => {
	try {
		const ret = await client.get(`/Employee/${employeeId}`);
		return ret.data;
	} catch (error) {
		apiErrorHandler(error);
	}
};