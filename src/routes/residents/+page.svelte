<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import Form from '$lib/components/controls/form.svelte';
	import FormInput from '$lib/components/controls/formInput.svelte';
	import FormSelect from '$lib/components/controls/formSelect.svelte';
	import DataTable from '$lib/components/dataTable.svelte';
	import Modal from '$lib/components/modal.svelte';
	import { addResident, getResidents, residentsStore } from '$lib/services/residents';
	import { activePageHeader, pageActionButtons, pageDescription } from '$lib/stores/layoutStore';
	import { onMount } from 'svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import * as yup from 'yup';
	import pkg from 'lodash';

	const {uniqueId} = pkg
	let loading = false;
	let saving = false;
	let showAddModal = false;

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
			label: 'Add',
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
			cell: (row: any) => row.email
		},
		{
			name: 'Sex',
			cell: (row: any) => row.sex
		},
		{
			name: 'Room Number',
			cell: (row: any) => row.isAllocated ? row.roomNumber : 'Not Allocated',
		},
		{
			name: 'Status',
			cell: (row: any) => (row.isActive ? 'Active' : 'Inactive'),
			cellStyle: (row: any) => (row.isActive ? 'bg-green-100' : 'bg-red-100')
		}
	];

	async function createResident({ detail }: any) {
		loading = true;
		const { values } = detail;
		console.log({ detail });
		try {
			const res = await addResident({
				...values,
				residentID: uniqueId('rsd_')
			});
			loading = false;
		} catch (e) {
			toast.error('Error adding resident. Please try again later.');
		}
	}

	async function fetchResidents() {
		try {
			loading = true;
			await getResidents();
			console.log($residentsStore);
			loading = false;
		} catch (error) {
			loading = false;
			console.log(error);
		}
	}
	

	onMount(async () => {
		await fetchResidents();
	});
</script>

<Toaster />
<div>
	<DataTable {loading} {columns} bodyData={$residentsStore} />
</div>

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
			<div>
				<Button type="submit" label="Add Resident" />
			</div>
		</Form>
	</Modal>
{/if}
