<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import Form from '$lib/components/controls/form.svelte';
	import FormInput from '$lib/components/controls/formInput.svelte';
	import Loader from '$lib/components/loader.svelte';
	import Modal from '$lib/components/modal.svelte';
	import { addRoom, getRooms, roomsStore } from '$lib/services/rooms';
	import { activePageHeader, pageActionButtons, pageDescription } from '$lib/stores/layoutStore';
	import { onMount } from 'svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import * as yup from 'yup';
	// import pkg from 'lodash';
	import { v4 as uuidv4 } from 'uuid';
	import { GetResidents, residentsStore } from '$lib/services/residents';
	import FormSelect from '$lib/components/controls/formSelect.svelte';
	import DataTable from '$lib/components/dataTable.svelte';
	import { toCurrencyFormat } from '$lib/utils/currency';
	import { goto } from '$app/navigation';
	import { P } from 'flowbite-svelte';

	const init = {
		roomNumber: '',
		maximumOccupants: 1,
		roomPrice: 0,
		location: 'N/A'
	}
	// const { uniqueId } = pkg
	let loading = false;
	let showAddModal = false;
	let showAllocationModal = false;
	let currentRoom: any;
	let allocating = false;
	let saving = false;
	let fetchingAllocations = false;
	let residentOptions: any = [];
	let roomOccupants: any = [];
	let rooms: any = []
	let resetting = false;
	$pageDescription = 'Manage rooms and allocations';
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
			name: 'Room Number',
			cell: (row: any) => row.roomNumber
		},
		{
			name: 'Allowed No. of Residents',
			cell: (row: any) => row.maximumOccupants
		},
		{
			name: 'Room Price (GHC)',
			cell: (row: any) => toCurrencyFormat(row.roomPrice)
		},
		{
			name: 'Vacancy Status',
			cell: (row: any) => row.vacancyStatus
		},
		{
			name: 'Full',
			cell: (row: any) => row.isFullyAllocated ? 'Yes' : 'No'
		}
	];

	$activePageHeader = 'Rooms';

	const schema = yup.object().shape({
		roomNumber: yup.string().required().label('Room Number'),
		maximumOccupants: yup.number().min(1).required().label('Allowed Number of Residents'),
		roomPrice: yup.number().min(1).required().label('Room Fee'),

	});

	async function fetchRooms() {
		try {
			loading = true;
			const res = await getRooms();
			if (res.isSuccess) {
				rooms = res.data;
				loading = false;
			} else {
				toast.error(res.message);
				loading = false;
			}
		} catch (error: any) {
			loading = false;
			toast.error(error.message);
		}
	}

	async function createRoom({ detail }: any) {
		saving = true;
		const { values } = detail;
		console.log({ detail });
		try {
			const res = await addRoom(values);

			if (res.isSuccess) {
				saving = false;
				toast.success(res.message);
				showAddModal = false;
				await fetchRooms();
			} else {
				saving = false;
				toast.error(res.message);
			}
		} catch (e: any) {
			saving = false;
			toast.error(e.message);
		}
	}

	

	function handleAction({ detail }: any) {
		showAllocationModal = true;

		currentRoom = detail.row;
		roomOccupants = detail.row.occupants;
		// const existing: any = $residentsStore?.filter((value: string) =>
		// 		$roomsStore.occupants.includes(value)
		// 	);
		// let existing = residentOptions.filter((value: any) => roomOccupants.includes(value.residentID))
		// console.log({ existing });
	}

	




	

	onMount(async () => {
		await fetchRooms();
	});
</script>

<Toaster />
<div>
	<!-- {#if loading}
		<Loader />
	{:else} -->
	<DataTable
		{loading}
		{columns}
		bodyData={rooms}
	/>

	<!-- {/if} -->
</div>

{#if showAddModal}
	<Modal title="Add Room" bind:open={showAddModal}>
		<Form {init} {schema} on:submit={createRoom}>
			<div class="md:grid grid-cols-2 gap-4">
				<div class="col-span-2">
					<FormInput name="roomNumber" required showLabel label="Room Number" />
				</div>
				<FormInput
					name="maximumOccupants"
					type="number"
					showLabel
					required
					min={1}
					label="Allowed Number of Residents"
				/>
				<FormInput name="roomPrice" required type="number" min={1} showLabel label="Room Fee" />
			</div>
			<div class="w-full flex mx-auto items-center justify-center align-middle py-4">
				<Button 				otherClasses="p-3 bg-green-600 w-full"
				disabled={saving} type="submit" label={saving ? 'Saving...' : 'Add Room'} />
			</div>
		</Form>
	</Modal>
{/if}


