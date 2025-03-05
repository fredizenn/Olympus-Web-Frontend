<script lang="ts">
	import ActionButton from '$lib/components/button.svelte';
	import Form from '$lib/components/controls/form.svelte';
	import FormInput from '$lib/components/controls/formInput.svelte';
	import FormSelect from '$lib/components/controls/formSelect.svelte';
	import DataTable from '$lib/components/dataTable.svelte';
	import Modal from '$lib/components/modal.svelte';
	import { AddResident, GetResidents, residentInit, residentsStore, type IResident } from '$lib/services/residents';
	import {
		activePageHeader,
		pageActionButtons,
		pageDescription,
		residentFormStep
	} from '$lib/stores/layoutStore';
	import { onDestroy, onMount } from 'svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import * as yup from 'yup';
	import pkg from 'lodash';
	import { v4 as uuidv4 } from 'uuid';
	import { roomsStore } from '$lib/services/rooms';
	import SlideOver from '$lib/components/ui/slideOver.svelte';
	import Personal from './forms/personal.svelte';
	import Nok from './forms/nok.svelte';
	import Institution from './forms/institution.svelte';
	import Summary from './forms/summary.svelte';
	import { Button } from 'flowbite-svelte';

	const { uniqueId } = pkg;
	let loading = false;
	let saving = false;
	let showAddModal = false;
	let isComplete = false;
	let residents: any = [];
	let data: IResident = {} as IResident;
	const schema = yup.object().shape({
		firstName: yup.string().required(),
		lastName: yup.string().required(),
		email: yup.string().email().required(),
		sex: yup.string().required()
	});

	const sexes = [
		{ value: 'Male', text: 'Male' },
		{ value: 'Female', text: 'Female' }
	];

	$activePageHeader = 'Residents';
	$pageDescription = 'Manage residents';
	$pageActionButtons = [
		{
			label: 'Register resident',
			icon: 'hugeicons:folder-add',
			onClick: () => (showAddModal = true)
		}
	];

	const columns = [
		{
			name: 'First Name',
			cell: (row: any) => row.firstName
		},
		{
			name: 'Last Name',
			cell: (row: any) => row.lastName
		},
		{
			name: 'Email',
			cell: (row: any) => row.emailAddress
		},
		{
			name: 'Sex',
			cell: (row: any) => row.sex
		},
		{
			name: 'Resident Number',
			cell: (row: any) => row.residentNumber
		},
		// {
		// 	name: 'Room Number',
		// 	cell: (row: any) => row.isAllocated ? row.room?.roomNumber : 'N/A',
		// },
		{
			name: 'Status',
			cell: (row: any) => (row.isAllocated ? 'Allocated' : 'Not Allocated'),
			cellStyle: (row: any) => (row.isAllocated ? 'bg-green-100 w-full' : 'bg-gray-100 w-full')
		}
	];

	async function createResident({ detail }: any) {
		saving = true;
		const { values } = detail;
		// try {
		// 	const res: any = await addResident({
		// 		...values,
		// 		residentCode: `RSD_${uuidv4()}`,
		// 		residentId: $residentsStore.length
		// 			? $residentsStore[$residentsStore.length - 1].residentId + 1
		// 			: 1
		// 	});
		// 	if (res.success) {
		// 		toast.success(res.message);
		// 		showAddModal = false;
		// 		saving = false;
		// 		await fetchResidents();
		// 	} else {
		// 		saving = false;
		// 		showAddModal = false;
		// 		toast.error('Could not add resident.');
		// 	}
		// } catch (e) {
		// 	saving = false;
		// 	showAddModal = false;
		// 	toast.error('Error adding resident. Please try again later.');
		// }
	}

	async function completeRegistration() {
		try {
			saving = true;
			const res = await AddResident(data);
			if(res.isSuccess) {
				saving = false;
				isComplete = true;
				await fetchResidents();
				toast.success(res.message);
				// showAddModal = false
			} else {
				toast.error(res.message);
				saving = false;
			}
		} catch (error) {
			saving = false;
			toast.error(String(error));
		}
	}

	async function fetchResidents() {
		try {
			loading = true;
			const res = await GetResidents();
			if (res.isSuccess) {
				residents = res.data;
				loading = false;
			} else {
				loading = false;
				toast.error(res.message);
			}
		} catch (error) {
			loading = false;
			toast.error(String(error));
		}
	}

	function onFormChange({ detail }: any) {
		data = {
			...detail.values
		};
	}

	onMount(async () => {
		await fetchResidents();
	});

	onDestroy(() => {
		residentFormStep.set(0);
		data = {} as IResident;
	});
</script>

<Toaster />
<div>
	<DataTable {loading} {columns} bodyData={residents} />
</div>
<!-- 
{#if showAddModal}
	<Modal title="Add Resident" bind:open={showAddModal}>
		<Form {schema} on:submit={createResident}>
			<div class="md:grid grid-cols-2 gap-4">
				<FormInput name="firstName" required showLabel label="First Name" />
				<FormInput name="lastName" required showLabel label="Last Name" />
				<FormInput name="email" required showLabel label="Email" />

				<div class="h-full">
					<FormSelect options={sexes} name="sex" required showLabel label="Sex" />
				</div>
			</div>
			<div class="flex justify-center w-full mt-2">
				<Button type="submit" disabled={saving} label={saving ? 'Saving...' : 'Add Resident'} />
			</div>
		</Form>
	</Modal>
{/if} -->

<SlideOver title="Resident Registration" show={showAddModal} onClose={() => {(showAddModal = false); data={ ...residentInit, }} }>
	{#if $residentFormStep === 0}
		<Personal {data} on:submit={onFormChange} />
	{:else if $residentFormStep === 1}
		<div class="w-full flex justify-end">
			<button
				class="flex justify-end items-center gap-2 py-1 text-sm"
				on:click={() => residentFormStep.set(0)}>&larr; Back</button
			>
		</div>
		<Nok {data} on:submit={onFormChange} />
	{:else if $residentFormStep === 2}
	<div class="w-full flex justify-end">
		<button
			class="flex justify-end items-center gap-2 py-1 text-sm"
			on:click={() => residentFormStep.set(1)}>&larr; Back</button
		>
	</div>
		<Institution on:submit={onFormChange} {data} />
	{:else}
	
		<Summary {completeRegistration} loading={saving} {isComplete} {data} />
	{/if}
</SlideOver>
