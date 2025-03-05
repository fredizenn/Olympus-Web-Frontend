/* eslint-disable @typescript-eslint/no-explicit-any */
import { writable } from 'svelte/store';
import { client } from '.';
import { apiErrorHandler } from '$lib/utils/helpers';

export const residentsStore = writable<any>([]);

export interface IResident {
    firstName: string,
    lastName: string,
    emailAddress: string,
    sex: string,
    dateOfBirth: any,
    phoneNumber: string,
    nextOfKinFullName: string,
    nextOfKinPhoneNumber: string,
    nextOfKinEmail: string,
    nextOfKinAddress: string,
    nextOfKinRelationship: string,
    institutionOfStudy: string,
    programmeOfStudy: string,
    studyStartDate: any,
    expectedStudyEndDate: any,
}

export const residentInit: IResident = {
    firstName: '',
    lastName: '',
    emailAddress: '',
    sex: '',
    dateOfBirth: null,
    phoneNumber: '',
    nextOfKinFullName: '',
    nextOfKinPhoneNumber: '',
    nextOfKinEmail: '',
    nextOfKinAddress: '',
    nextOfKinRelationship: '',
    institutionOfStudy: '',
    programmeOfStudy: '',
    studyStartDate: null,
    expectedStudyEndDate: null,

}

export async function GetResidents () {
	try {
		const response = await client.get('/residents');
		return response.data;
	} catch (error) {
		apiErrorHandler(error);
	}
}

export async function AddResident(data: any) {
    try {
        const response = await client.post('/resident', 
            {
            ...data
        });
        return response.data;
    } catch (error) {
        apiErrorHandler(error);
    }
}

// export const addResident = async (data: any) => {
// 	try {
// 		await addDoc(collection(hmSysDb, 'residents'), data);
// 		return {
// 			success: true,
// 			message: 'Resident added successfully.',
// 		}
// 	} catch (error) {
// 		apiErrorHandler(error);
// 	}
// }
