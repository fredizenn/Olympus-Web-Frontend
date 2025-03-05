<script lang="ts">
	import { AddPayment, GetPayments, paymentsStore } from '$lib/services/payment';
	import { activePageHeader, pageActionButtons, pageDescription } from '$lib/stores/layoutStore';
	import { onMount } from 'svelte';
	import DataTable from '$lib/components/dataTable.svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import { formatDate } from '$lib/utils/date-formatter';
	import Modal from '$lib/components/modal.svelte';
	import Form from '$lib/components/controls/form.svelte';
	import * as yup from 'yup';
	import FormInput from '$lib/components/controls/formInput.svelte';
	import FormSelect from '$lib/components/controls/formSelect.svelte';
	import Button from '$lib/components/button.svelte';
	import { toCurrencyFormat } from '$lib/utils/currency';
	import {
		addEmployee,
		employeesStore,
		getEmployees,
	} from '$lib/services/employees';

	$activePageHeader = 'Employees';
	$pageDescription = 'Manage employees';
	let loading = false;
	let saving = false;
	let deleting = false;
	let showDeleteModal = false;
	let showEditModal = false;
	let showAddModal = false;
	let currentEmployeeId = 0;
	let currentEmployeeName: any = '';
	let editInit: any = {};
	const schema = yup.object().shape({
		firstName: yup.string().required().label('First Name'),
		lastName: yup.string().required().label('Last Name'),
		dateOfEmployment: yup.string().required().label('Date of Employment'),
		phoneNumber: yup.string().required().label('Phone Number'),
		email: yup.string().email().required().label('Email'),
		salary: yup.number().required('Salary is required').label('Salary')
	});

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
			cell: (row: any) => row.emailAddress
		},
		{
			name: 'Phone Number',
			cell: (row: any) => row.phoneNumber
		},
		{
			name: 'Date of Employment',
			cell: (row: any) => formatDate(row.dateOfEmployment)
		}

		// {
		//     name: 'Room'
		// }
	];
	async function fetchEmployees() {
		loading = true;
		try {
			await getEmployees();
			loading = false;
		} catch (error) {
			loading = false;
			console.log(error);
		}
	}

	async function createEmployee({ detail }: any) {
		try {
			saving = true;
			const { values } = detail;
			const res = await addEmployee({
				...values,
				employeeId: $employeesStore.length
					? $employeesStore[$employeesStore.length - 1].employeeId + 1
					: 1
			});
			if (res?.success) {
				saving = false;
				showAddModal = false;
				await fetchEmployees();
				toast.success(res.message);
			} else {
				saving = false;
				toast.error('An error occurred');
			}
		} catch (e: any) {
			toast.error(e);
		}
	}

	async function deleteEmpl() {
		// try {
		// 	deleting = true;
		// 	const res: any = await deleteEmployee(currentEmployeeId);
		// 	if (res.success) {
		// 		deleting = false;
		// 		showDeleteModal = false;
		// 		toast.success(res.message);
		// 		await fetchEmployees();
		// 	} else {
		// 		deleting = false;
		// 		showDeleteModal = false;
		// 		toast.error(res.message);
		// 	}
		// } catch (error: any) {
		// 	deleting = false;
		// 	showDeleteModal = false;
		// 	toast.error(error);
		// }
	}

	async function editEmployee({ detail }: any) {
		// try {
		// 	saving = true;
		// 	const { values } = detail;
		// 	const res = await updateEmployee(values.employeeId, values);
		// 	if (res?.success) {
		// 		saving = false;
		// 		showEditModal = false;
		// 		await fetchEmployees();
		// 		toast.success(res.message);
		// 	} else {
		// 		saving = false;
		// 		toast.error('An error occurred');
		// 	}
		// } catch (error) {
		// 	console.log(error);
		// }
	}

	onMount(async () => {
		await fetchEmployees();
		// await fetchResidents();
	});

	const actionButtons = [
		{
			icon: 'hugeicons:user-edit-01',
			tooltip: 'Edit Employee',
			iconColor: 'text-purple-600'
		},
		{
			icon: 'hugeicons:delete-02',
			tooltip: 'Delete Employee',
			iconColor: 'text-red-600'
		}
	];

	async function handleAction({ detail }: any) {
		const { btnIndex, row } = detail;
		if (btnIndex === 0) {
			showEditModal = true;
			editInit = row;
		} else if (btnIndex === 1) {
			showDeleteModal = true;
			currentEmployeeName = row.firstName + ' ' + row.lastName;
			currentEmployeeId = row.employeeId;
		}
	}
</script>

<Toaster />
<div>
	<!-- {#if loading}
		<Loader />
	{:else} -->
	<DataTable
		{loading}
		on:buttonClicked={handleAction}
		{actionButtons}
		{columns}
		bodyData={$employeesStore}
	/>

	<!-- {/if} -->
</div>

{#if showAddModal}
	<Modal title="Add Employee" bind:open={showAddModal}>
		<Form {schema} on:submit={createEmployee}>
			<div class="md:grid grid-cols-2 gap-4">
				<FormInput name="firstName" required showLabel label="First Name" />
				<FormInput name="lastName" required showLabel label="Last Name" />
				<FormInput name="email" required showLabel label="Email" />
				<FormInput name="phoneNumber" required showLabel label="Phone Number" />
				<FormInput
					name="dateOfEmployment"
					type="date"
					required
					showLabel
					label="Date of Employment"
				/>
				<FormInput name="salary" type="number" min={1} required showLabel label="Salary" />
			</div>
			<div class="flex justify-center w-full mt-2">
				<Button type="submit" disabled={saving} label={saving ? 'Saving...' : 'Add Employee'} />
			</div>
		</Form>
	</Modal>
{/if}
{#if showEditModal}
	<Modal
		title="Edit Employee: {editInit.firstName + ' ' + editInit.lastName}"
		bind:open={showEditModal}
	>
		<Form {schema} init={editInit} on:submit={editEmployee}>
			<div class="md:grid grid-cols-2 gap-4">
				<FormInput name="firstName" required showLabel label="First Name" />
				<FormInput name="lastName" required showLabel label="Last Name" />
				<FormInput name="email" required showLabel label="Email" />
				<FormInput name="phoneNumber" required showLabel label="Phone Number" />
				<FormInput
					name="dateOfEmployment"
					type="date"
					required
					showLabel
					label="Date of Employment"
				/>
				<FormInput name="salary" type="number" min={1} required showLabel label="Salary" />
			</div>
			<div class="flex justify-center w-full mt-2">
				<Button type="submit" disabled={saving} label={saving ? 'Saving...' : 'Save'} />
			</div>
		</Form>
	</Modal>
{/if}
{#if showDeleteModal}
	<Modal title="Delete Employee: {currentEmployeeName}" bind:open={showDeleteModal}>
		<div class="text-center text-xs text-red-700 font-semibold">
			Are you sure you want to delete this employee?
		</div>
		<div class="flex justify-center w-full mt-2">
			<Button
				onClick={deleteEmpl}
				disabled={deleting}
				otherClasses="bg-red-700 text-white hover:bg-red-800"
				label={deleting ? 'Please wait...' : 'Proceed to Delete Employee'}
			/>
		</div>
	</Modal>
{/if}
