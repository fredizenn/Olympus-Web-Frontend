<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import Form from '$lib/components/controls/form.svelte';
	import FormInput from '$lib/components/controls/formInput.svelte';
	import Loader from '$lib/components/loader.svelte';
	import Modal from '$lib/components/modal.svelte';
	import { addRoom, allocation, getRooms, roomsStore } from '$lib/services/rooms';
	import { activePageHeader, pageActionButtons, pageDescription } from '$lib/stores/layoutStore';
	import { onMount } from 'svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import * as yup from 'yup';
	// import pkg from 'lodash';
	import { v4 as uuidv4 } from 'uuid';
	import {
		allocate,
		allocationsStore,
		getAllocations,
		getRoomAllocation,
		roomAllocationStore
	} from '$lib/services/allocations';
	import { getResidents, residentsStore } from '$lib/services/residents';
	import FormSelect from '$lib/components/controls/formSelect.svelte';
	import DataTable from '$lib/components/dataTable.svelte';
	import { toCurrencyFormat } from '$lib/utils/currency';
	import {
		addMaintenanceRequest,
		getMaintenanceRequests,
		maintenanceRequestsStore,
		updateStatus
	} from '$lib/services/maintenance';
	import FormTextArea from '$lib/components/controls/formTextArea.svelte';
	import { formatDate } from '$lib/utils/date-formatter';

	// const { uniqueId } = pkg
	let loading = false;
	let showAddModal = false;
	let currentRequest: any;
	let saving = false;
	let showUpdateStatusModal = false;
	let updateModalTitle = '';
	let modalButtonLabel = '';
	let modalButtonAction: any;
	let modalDescription: any;
	let rooms: any = []
	let btnIndx: any;
	let residents: any = []
	$pageDescription = 'Manage maintenance requests.';
	$pageActionButtons = [
		{
			label: 'Add',
			icon: 'hugeicons:folder-add',
			onClick: () => (showAddModal = true)
		}
		// {
		// 	label: 'Allocation',
		// 	icon: 'hugeicons:passport-valid',
		// 	onClick: () => console.log('allocation')
		// }
	];
	const columns = [
		{
			name: 'Code',
			cell: (row: any) => row.mrCode
		},
		{
			name: 'Description',
			cell: (row: any) => row.description
		},
		{
			name: 'Reported By',
			cell: (row: any) => row.issuedBy || 'N/A'
		},
		{
			name: 'Room Number',
			cell: (row: any) => row.room.roomNumber || 'N/A'
		},
		{
			name: 'Date Reported',
			cell: (row: any) => formatDate(row.createdAt)
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
		description: yup.string().required().label('Description'),
		// issuedBy: yup.string().required().label('Issued By')
	});

	async function fetchMaintenanceRequests() {
		try {
			loading = true;
			await getMaintenanceRequests();
			loading = false;
		} catch (error) {
			loading = false;
			console.log(error);
		}
	}

	async function createMaintenanceRequest({ detail }: any) {
		saving = true;
		const { values } = detail;
		console.log({ detail });
		try {
			const res = await addMaintenanceRequest({
				...values,
				mrCode: `MTR_${uuidv4()}`,
				status: 'Pending',
				createdAt: Date.now()
			});
			saving = false;
			showAddModal = false;
			toast.success('Request created successfully.');
			await fetchMaintenanceRequests();
		} catch (e) {
			toast.error('Error adding room. Please try again later.');
		}
	}

	async function updateMaintenanceStatus(mrCode: string, status: any) {
		saving = true;
		try {
			const res = await updateStatus(mrCode, status);
			await fetchMaintenanceRequests();
			saving = false;
		} catch (e) {}
	}


	// async function fetchResidents() {
	// 	try {
	// 		loading = true;
	// 		await getResidents();
	// 		residents = $residentsStore.map((r: any) => {
	// 			return {
	// 				email: r.email,
	// 				firstName: r.firstName,
	// 				sex: r.sex,
	// 				lastName: r.lastName,
	// 				label: `${r.firstName} ${r.lastName}`,
	// 				value: r.residentId,
	// 				residentId: r.residentId
	// 			};
	// 		});

	
	// 		loading = false;
	// 	} catch (error) {
	// 		loading = false;
	// 		console.log(error);
	// 	}
	// }

	async function fetchRooms() {
		try {
			loading = true;
			await getRooms();
			rooms = $roomsStore.map((r: any) => {
				return {
					...r,
					label: r.roomNumber,
					value: r.roomId
				};
			})
			residents = rooms.map((r: any) => r.occupants).flat();
			loading = false;
		} catch (error) {
			loading = false;
			console.log(error);
		}
	}
	// onMount(async() => {
	//     console.log("hello")
	// })

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

	async function doStatusChange() {
		try {
			if (btnIndx === 0) {
				await updateMaintenanceStatus(currentRequest.mrCode, {
					...currentRequest,
					status: 'Resolved'
				});
				showUpdateStatusModal = false;
				toast.success('Request has been marked as resolved');
			} else if (btnIndx === 1) {
				await updateMaintenanceStatus(currentRequest.mrCode, {
					...currentRequest,
					status: 'Cancelled'
				});
				showUpdateStatusModal = false;
				toast.success('Request has been cancelled');
			} else {
				toast.error('Something went wrong. Please try again later');
			}
		} catch (e: any) {
			toast.error(e);
		}
	}
	// async function fetchResidents() {
	// 	try {
	// 		loading = true;
	// 		await getResidents();
	// 		residentOptions = $residentsStore.map((r: any) => {
	// 			return {
	// 				email: r.email,
	// 				firstName: r.firstName,
	// 				sex: r.sex,
	// 				lastName: r.lastName,
	// 				label: `${r.firstName} ${r.lastName}`,
	// 				value: r.residentID
	// 			}
	// 		})
	// 		console.log($residentsStore);
	// 		loading = false;
	// 	} catch (error) {
	// 		loading = false;
	// 		console.log(error);
	// 	}
	// }

	const addRoomBtns = [
		{
			text: 'Save',
			type: 'submit',
			loading: loading,
			handler: () => {}
		}
	];

	const allocationModalBtns = [
		{
			text: 'Allocate',
			type: 'submit',
			loading: saving,
			handler: () => {}
		}
	];

	onMount(async () => {
		await fetchMaintenanceRequests();
		await fetchRooms();
		// await fetchResidents();
	});
</script>

<Toaster />
<div>
	<!-- {#if loading}
		<Loader />
	{:else} -->
	<DataTable
		{loading}
		{actionButtons}
		on:buttonClicked={handleAction}
		{columns}
		bodyData={$maintenanceRequestsStore}
	/>

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
			<div class="space-y-2">
				<FormSelect name="room" valueAsObject options={rooms} showLabel label="Room" required />
				<FormInput name="issuedBy" showLabel label="Issued By" required />
				<FormInput name="description" showLabel label="Description" required />
			</div>

			<div class="w-full flex items-center py-4 justify-center">
				<Button type="submit" label={saving ? 'Saving...' : 'Save'} disabled={saving} />
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
				onClick={doStatusChange}
			/>
		</div>
	</Modal>
{/if}
