/* eslint-disable @typescript-eslint/no-explicit-any */
import { browser } from "$app/environment";
import { addDoc, collection, deleteDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { hmSysDb } from "./server";
import { writable } from "svelte/store";

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
		if (browser) {
			const querySnapshot = await getDocs(collection(hmSysDb, 'employees'));
			const employees: any = [];
			querySnapshot.forEach((doc) => {
				employees.push({ ...doc.data() });
			});
			employeesStore.set(employees);
		}
	} catch (error) {
		console.log(error);
	}
};

export const addEmployee = async (data: IEmployee) => {
	try {
		await addDoc(collection(hmSysDb, 'employees'), data);
		return {
			success: true,
			message: 'Employee added successfully.'
		};
	} catch (e) {
		return {
			message: e
		};
	}
};

export const updateEmployee = async (employeeId: string, data: any) => {
	try {
		const empl = collection(hmSysDb, 'employees');
		const q = query(empl, where('employeeId', '==', employeeId));
		const querySnapshot: any = await getDocs(q);
		if (!querySnapshot.empty) {
			const docRef = querySnapshot.docs[0].ref;
			await updateDoc(docRef, data);
			return {
				success: true,
				message: 'Employee updated.'
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

export const deleteEmployee = async (employeeId: number) => {
    try {
        const empl = collection(hmSysDb, 'employees');
        const q = query(empl, where('employeeId', '==', employeeId));
        const querySnapshot: any = await getDocs(q);
        if (!querySnapshot.empty) {
        await deleteDoc(querySnapshot.docs[0].ref);
        return {
            success: true,
            message: 'Employee deleted.'
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