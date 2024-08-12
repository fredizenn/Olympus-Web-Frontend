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
	import * as yup from 'yup'
	// import pkg from 'lodash';
	import { v4 as uuidv4 } from 'uuid';
	import { allocate, allocationsStore, getAllocations, getRoomAllocation, roomAllocationStore } from '$lib/services/allocations';
	import { getResidents, residentsStore } from '$lib/services/residents';
	import FormSelect from '$lib/components/controls/formSelect.svelte';
	import DataTable from '$lib/components/dataTable.svelte';
	import { toCurrencyFormat } from '$lib/utils/currency';

	// const { uniqueId } = pkg
	let loading = false;
	let showAddModal = false;
	let showAllocationModal = false;
	let currentRoom: any
	let allocating = false;
	let saving = false;
	let fetchingAllocations = false;
	let residentOptions: any = []
	let roomOccupants: any = []
	$pageDescription = 'Manage rooms and allocations';
	$pageActionButtons = [
		{
			label: 'Add',
			icon: 'hugeicons:folder-add',
			onClick: () => (showAddModal = true)
		},
		// {
		// 	label: 'Allocation',
		// 	icon: 'hugeicons:passport-valid',
		// 	onClick: () => console.log('allocation')
		// }
	];
	const columns = [
		{
			name: 'Room Number',
			cell: (row: any) => row.roomNumber
		},
		{
			name: 'Allowed No. of Residents',
			cell: (row: any) => row.numberOfOccupants
		},
		{
			name: 'Room Price (GHC)',
			cell: (row: any) => toCurrencyFormat(row.roomFee),
		},
		{
			name: 'Vacancy Status',
			cell: (row: any) => (row.isVacant ? 'Vacant' : 'Occupied'),
			cellStyle: (row: any) =>
				row.isVacant ? 'rounded py-0.5 bg-green-100' : 'rounded py-0.5 bg-red-100'
		}
	];

	$activePageHeader = 'Rooms';

	const schema = yup.object().shape({
		roomNumber: yup.string().required(),
		numberOfOccupants: yup.number().min(1).required()
	})

	const allocationSchema = yup.object().shape({
		
	})
	async function fetchRooms() {
		try {
			loading = true;
			await getRooms();
			console.log($roomsStore);
			loading = false;
		} catch (error) {
			loading = false;
			console.log(error);
		}
	}

	async function createRoom({ detail }: any) {
		saving = true;
		const { values } = detail
		console.log({detail})
		try {

			const res = await addRoom({...values, roomCode: `rm_${uuidv4()}`, isVacant: true, occupants: []});
			console.log(res)
			saving = false;
			showAddModal = false;
			await fetchRooms()
		} catch (e) {
			toast.error('Error adding room. Please try again later.');
		}
	}

	const allocationsColumns = [
		{
			name: 'Resident',
			cell: (row: any) => row.firstName + ' ' + row.lastName
		},
		{
			name: 'Email',
			cell: (row: any) => row.email
		},
		{
			name: 'Sex',
			cell: (row: any) => row.sex
		}
	]

	async function allocateRoom({ detail }: any) {
		console.log({detail})
		allocating = true
		try {
			console.log({detail})
			const res = await allocation(currentRoom.roomCode, detail.values.occupants)
			allocating = false;
		} catch (e) {
		}
	}

	// onMount(async() => {
	//     console.log("hello")
	// })

	const actionButtons = [
		{
			icon: 'hugeicons:subnode-add',
			tooltip: 'Manage Allocations'
		}
	]

	function handleAction({ detail }: any) {
		console.log({ detail });
		showAllocationModal = true
		
		currentRoom = detail.row
		roomOccupants = detail.row.occupants
		console.log({roomOccupants})
	}


	async function fetchResidents() {
		try {
			loading = true;
			await getResidents();
			residentOptions = $residentsStore.map((r: any) => {
				return {
					email: r.email,
					firstName: r.firstName,
					sex: r.sex,
					lastName: r.lastName,
					label: `${r.firstName} ${r.lastName}`,
					value: r.residentID
				}
			})
			console.log($residentsStore);
			loading = false;
		} catch (error) {
			loading = false;
			console.log(error);
		}
	}

	async function fetchAllocations() {
		try {
			fetchingAllocations = true;
			await getAllocations();
			console.log($allocationsStore);
			fetchingAllocations = false;
		} catch (error) {
			fetchingAllocations = false;
			console.log(error);
		}
	}

	async function fetchRoomAllocation(roomCode: string) {
		try {
			fetchingAllocations = true;
			await getRoomAllocation(roomCode);
			console.log({$roomAllocationStore});
			
			// x = $roomAllocationStore.map((r: any) => {
			// 	return {
			// 		firstName: r.occupants[0].firstName,
			// 		lastName: r.occupants[0].lastName,
			// 		email: r.occupants[0].email,
			// 		sex: r.occupants[0].sex
			// 	}
			// })

			fetchingAllocations = false;
		} catch (e) {
			toast.error('Error fetching room allocation. Please try again later.');
		}
	}

	const addRoomBtns = [
		{
			text: 'Save',
			type: 'submit',
			loading: loading,
			handler: () => {}
		}
	]

	const allocationModalBtns = [
		{
			text: 'Allocate',
			type: 'submit',
			loading: allocating,
			handler: () => {}
		}
	]

	onMount(async () => {
		await fetchRooms();
		await fetchResidents();
	});
</script>
<Toaster />
<div>
	<!-- {#if loading}
		<Loader />
	{:else} -->
	<DataTable {loading} {actionButtons} on:buttonClicked={handleAction} {columns} bodyData={$roomsStore} />

	<!-- {/if} -->
</div>

{#if showAddModal}
	<Modal title="Add Room" bind:open={showAddModal}>
		<Form {schema} on:submit={createRoom}>
			<div class="md:grid grid-cols-2 gap-4">
				<FormInput name="roomNumber" required showLabel label="Room Number" />
				<FormInput name="numberOfOccupants" type="number" showLabel required min={1} label="Allowed Number of Residents" />
			</div>
			<div class="w-full flex mx-auto items-center justify-center align-middle py-4">
				<Button disabled={saving} type="submit" label={saving ? 'Saving...' : 'Add Room'} />
			</div>
		</Form>
	</Modal>
{/if}

{#if showAllocationModal}
	<Modal title="Allocation: Room {currentRoom.roomNumber}"  bind:open={showAllocationModal}>
		<DataTable columns={allocationsColumns} bodyData={roomOccupants} loading={fetchingAllocations}  />
		<Form schema={allocationSchema} on:submit={allocateRoom}>
			<FormSelect name="occupants" options={residentOptions} valueAsObject multiple showLabel label="Resident" />
			<div class="w-full flex items-center py-4 justify-center">
				<Button type="submit" label={allocating ? 'Allocating...' : "Allocate"} disabled={allocating} />
			</div>
		</Form>
	</Modal>
{/if}
