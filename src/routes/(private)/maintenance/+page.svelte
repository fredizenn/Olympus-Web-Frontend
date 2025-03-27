<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import Form from '$lib/components/controls/form.svelte';
	import FormInput from '$lib/components/controls/formInput.svelte';
	import Loader from '$lib/components/loader.svelte';
	import Modal from '$lib/components/modal.svelte';
	import { addRoom, getRooms } from '$lib/services/rooms';
	import { activePageHeader, pageActionButtons, pageDescription } from '$lib/stores/layoutStore';
	import { onMount } from 'svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import * as yup from 'yup';
	// import pkg from 'lodash';
	import { v4 as uuidv4 } from 'uuid';
	import { GetResidents } from '$lib/services/residents';
	import FormSelect from '$lib/components/controls/formSelect.svelte';
	import DataTable from '$lib/components/dataTable.svelte';
	import { toCurrencyFormat } from '$lib/utils/currency';
	import {
		addMaintenanceRequest,
		getMaintenanceRequests,
		maintenanceRequestsStore
	} from '$lib/services/maintenance';
	import FormTextArea from '$lib/components/controls/formTextArea.svelte';
	import { formatDate } from '$lib/utils/date-formatter';
	import { getEmployees } from '$lib/services/employees';

	// const { uniqueId } = pkg
	let loading = false;
	let showAddModal = false;
	let loadingStaff = false;
	let loadingResidents = false;
	let staff: any = [];
	let loadingRooms = false;
	let currentRequest: any;
	let saving = false;
	let showUpdateStatusModal = false;
	let updateModalTitle = '';
	let modalButtonLabel = '';
	let modalButtonAction: any;
	let modalDescription: any;
	let rooms: any = [];
	let btnIndx: any;
	let residents: any = [];
	let list: any = [];

	$activePageHeader = 'Maintenance Requests';
	$pageDescription = 'Manage maintenance requests.';
	$pageActionButtons = [
		{
			label: 'Add',
			icon: 'hugeicons:folder-add',
			onClick: () => (showAddModal = true)
		}
	];
	const columns = [
		{
			name: 'Room Number',
			cell: (row: any) => row.roomNumber
		},
		{
			name: 'Description',
			cell: (row: any) => row.description
		},
		{
			name: 'Reported By',
			cell: (row: any) => row.resident
		},
		{
			name: 'Assigned To',
			cell: (row: any) => row.assignedEmployee || 'N/A'
		},
		{
			name: 'Date Reported',
			cell: (row: any) => formatDate(row.requestDate)
		},
		{
			name: 'Status',
			cell: (row: any) => row.status,
			cellStyle: (row: any) => {
				if (row.status === 'Resolved') {
					return 'rounded w-full py-0.5 bg-green-100';
				} else if (row.status === 'Pending') {
					return 'w-full rounded py-0.5 bg-yellow-100';
				} else {
					return 'w-full rounded py-0.5 bg-red-100';
				}
			}
		}
	];

	$activePageHeader = 'Maintenance Requests';

	const schema = yup.object().shape({
		description: yup.string().required().label('Description')
	});

	async function fetchMaintenanceRequests() {
		try {
			loading = true;
			const res = await getMaintenanceRequests();
			if (res.isSuccess) {
				list = res.data;
				loading = false;
			} else {
				loading = false;
				toast.error(res.message);
			}
		} catch (error: any) {
			loading = false;
			toast.error(error.message);
		}
	}

	async function createMaintenanceRequest({ detail }: any) {
		saving = true;
		const { values } = detail;
		const data = {
			description: values.description,
			residentNumber: values.resident.residentNumber,
			roomNumber: values.room.roomNumber,
			employeeId: values?.employee?.id
		};
		try {
			const res = await addMaintenanceRequest(data);
			if (!res.isSuccess) {
				toast.error(res.message);
				saving = false;
				return
			}
			saving = false;
			showAddModal = false;
			toast.success(res.message);
			await fetchMaintenanceRequests();
		} catch (e: any) {
			toast.error(e.message);
			saving = false;
		}
	}

	// async function updateMaintenanceStatus(mrCode: string, status: any) {
	// 	saving = true;
	// 	try {
	// 		const res = await updateStatus(mrCode, status);
	// 		await fetchMaintenanceRequests();
	// 		saving = false;
	// 	} catch (e) {}
	// }

	async function fetchRooms() {
		try {
			loadingRooms = true;
			const res = await getRooms();
			if (!res.isSuccess) {
				loadingRooms = false;
				return
			}
			rooms = res.data.map((r: any) => {
				return {
					...r,
					label: r.roomNumber,
					value: r.roomNumber
				};
			});
			loading = false;
		} catch (error: any) {
			loading = false;
			toast.error(error.message);
		}
	}

	async function fetchEmployees() {
		try {
			loadingStaff = true;
			const res = await getEmployees();
			if (!res.isSuccess) {
				loadingStaff = false;
				return
			}
			staff = res.data.map((s: any) => {
				return {
					value: s.id,
					label: s.firstName + ' ' + s.lastName
				}
			});
			loadingStaff = false;
		} catch (error: any) {
			loadingStaff = false;
			toast.error(error.message);
		}
	}

	async function fetchResidents() {
		try {
			loadingResidents = true;
			const res = await GetResidents();
			if (!res.isSuccess) {
				loadingResidents = false;
				return
			}
			residents = res.data.map((r: any) => {
				return {
					...r,
					label: r.firstName + ' ' + r.lastName,
					value: r.residentNumber
				};
			});
			loadingResidents = false;
		} catch (error: any) {
			loadingResidents = false;
			toast.error(error.message);
		}
	}

	const actionButtons = [
		{
			icon: 'hugeicons:setting-done-01',
			tooltip: 'Mark as Resolved',
			iconColor: 'text-green-600',
			hide: (row: any) => (row.status !== 'Pending' ? false : true)
		},
		{
			icon: 'hugeicons:cancel-circle',
			tooltip: 'Cancel request',
			iconColor: 'text-red-600',
			hide: (row: any) => (row.status !== 'Pending' ? false : true)
		}
	];

	function handleAction({ detail }: any) {
		console.log({ detail });
		btnIndx = detail.btnIndex;
		currentRequest = detail.row;
		modalDescription = { ...currentRequest };
		showUpdateStatusModal = true;
		switch (btnIndx) {
			case 0:
				updateModalTitle = 'Mark as Resolved';
				modalButtonLabel = 'Proceed to mark this request as resolved';

				break;
			case 1:
				updateModalTitle = 'Cancel Request';

				modalButtonLabel = 'Proceed to mark this request as cancelled';

				break;
		}
		showUpdateStatusModal = true;
	}

	// async function doStatusChange() {
	// 	try {
	// 		if (btnIndx === 0) {
	// 			await updateMaintenanceStatus(currentRequest.mrCode, {
	// 				...currentRequest,
	// 				status: 'Resolved'
	// 			});
	// 			showUpdateStatusModal = false;
	// 			toast.success('Request has been marked as resolved');
	// 		} else if (btnIndx === 1) {
	// 			await updateMaintenanceStatus(currentRequest.mrCode, {
	// 				...currentRequest,
	// 				status: 'Cancelled'
	// 			});
	// 			showUpdateStatusModal = false;
	// 			toast.success('Request has been cancelled');
	// 		} else {
	// 			toast.error('Something went wrong. Please try again later');
	// 		}
	// 	} catch (e: any) {
	// 		toast.error(e);
	// 	}
	// }

	onMount(async () => {
		await fetchMaintenanceRequests();
		await fetchRooms();
		await fetchEmployees();
		await fetchResidents();
	});
</script>

<Toaster />
<div>
	<!-- {#if loading}
		<Loader />
	{:else} -->
	<DataTable {loading} {actionButtons} on:buttonClicked={handleAction} {columns} bodyData={list} />

	<!-- {/if} -->
</div>

<!-- {#if showAddModal}
	<Modal title="Add Room" bind:open={showAddModal}>
		<Form {schema} on:submit={createRoom}>
			<div class="md:grid grid-cols-2 gap-4">
				<FormInput name="roomNumber" required showLabel label="Room Number" />
				<FormInput
					name="numberOfOccupants"
					type="number"
					showLabel
					required
					min={1}
					label="Allowed Number of Residents"
				/>
			</div>
			<div class="w-full flex mx-auto items-center justify-center align-middle py-4">
				<Button disabled={saving} type="submit" label={saving ? 'Saving...' : 'Add Room'} />
			</div>
		</Form>
	</Modal>
{/if} -->

{#if showAddModal}
	<Modal title="Maintenance Request" bind:open={showAddModal}>
		<Form {schema} on:submit={createMaintenanceRequest}>
			<div class="space-y-4">
				<FormSelect name="room" valueAsObject loading={loadingRooms} options={rooms} showLabel label="Room" required />
				<FormSelect
					name="resident"
					valueAsObject
					options={residents}
					loading={loadingResidents} 
					showLabel
					label="Resident"
					required
				/>
				<FormInput name="description" showLabel label="Description" required />
				<FormSelect
					name="employee"
					valueAsObject
					options={staff}
					loading={loadingResidents} 

					showLabel
					label="Assign To"
					required
				/>
			</div>

			<div class="w-full flex items-center py-4 mt-2 justify-center">
				<Button type="submit" label={saving ? 'Saving...' : 'Save'} otherClasses="bg-green-600 p-3 w-full" disabled={saving} />
			</div>
		</Form>
	</Modal>
{/if}

{#if showUpdateStatusModal}
	<Modal title={updateModalTitle} bind:open={showUpdateStatusModal}>
		<div class="flex flex-col mx-auto align-middle w-2/3 justify-center">
			<dl class="divide-y divide-gray-100">
				<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
					<dt class="text-sm font-medium">Description</dt>
					<dd class="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
						{modalDescription?.description}
					</dd>
				</div>
				<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
					<dt class="text-sm font-medium">Issued By</dt>
					<dd class="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
						{modalDescription?.issuedBy}
					</dd>
				</div>
			</dl>
			<Button
				label={saving ? 'Please wait...' : modalButtonLabel}
				hasIcon
				icon="hugeicons:alert-02"
				disabled={saving}
				type="button"
			/>
		</div>
	</Modal>
{/if}
