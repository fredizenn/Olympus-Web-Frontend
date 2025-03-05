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
			cell: (row: any) => row.numberOfOccupants
		},
		{
			name: 'Room Price (GHC)',
			cell: (row: any) => toCurrencyFormat(row.roomFee)
		},
		{
			name: 'Vacancy Status',
			cell: (row: any) => (row.occupants.length < row.numberOfOccupants ? 'Vacant' : 'Occupied'),
			cellStyle: (row: any) =>
				row.occupants.length < row.numberOfOccupants
					? 'rounded py-0.5 bg-green-100'
					: 'rounded py-0.5 bg-red-100'
		}
	];

	$activePageHeader = 'Rooms';

	const schema = yup.object().shape({
		roomNumber: yup.string().required().label('Room Number'),
		numberOfOccupants: yup.number().min(1).required().label('Allowed Number of Residents'),
		roomFee: yup.number().min(1).required().label('Room Fee')
	});

	const allocationSchema = yup.object().shape({
		// occupants: yup.object().test('Occupants', function (value) {
		// 	return !!value;
		// }).required('Please select at least one resident to allocate.')
	});
	async function fetchRooms() {
		try {
			loading = true;
			await getRooms();
			loading = false;
		} catch (error) {
			loading = false;
			console.log(error);
		}
	}

	async function createRoom({ detail }: any) {
		saving = true;
		const { values } = detail;
		console.log({ detail });
		try {
			const res = await addRoom({
				...values,
				roomId: $roomsStore.length ? $roomsStore[$roomsStore.length - 1].roomId + 1 : 1,
				roomCode: `RM_${uuidv4()}`,
				isVacant: true,
				occupants: []
			});

			if (res.success) {
				saving = false;
				showAddModal = false;
				toast.success('Room added successfully');
				await fetchRooms();
			} else {
				saving = false;
				showAddModal = false;
				toast.success('Room added successfully');
				toast.error('Something went wrong.');
			}
		} catch (e) {
			toast.error('Error adding room. Please try again later');
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
	];

	async function allocateRoom({ detail }: any) {
		allocating = true;
		try {
			if (
				detail.values.occupants.length > 0 &&
				detail.values.occupants.length >
					currentRoom.numberOfOccupants - currentRoom.occupants.length
			) {
				toast.error(
					`Slots exceeded. Please select only ${currentRoom.numberOfOccupants - currentRoom.occupants.length} resident to complete allocation.`
				);
				allocating = false;
				return;
			}

			if (detail.values.occupants.length < 1) {
				toast.error('Please select at least one resident to allocate.');
				allocating = false;
				return;
			}

			// const res = await allocation(currentRoom.roomCode, [
			// 	...currentRoom.occupants,
			// 	detail.values.occupants
			// ]);
			// if (res?.success) {
			// 	toast.success(res.message);

			// 	allocating = false;
			// 	showAllocationModal = false;
			// 	await fetchRooms();
			// 	await fetchResidents();
			// } else {
			// 	toast.error('An error occurred. Please try again later.');
			// 	allocating = false;
			// }
		} catch (e) {
			console.log(e);
		}
	}

	// async function resetAllocation() {
	// 	resetting = true;
	// 	try {
	// 		const res = await removeAllocation(currentRoom.roomCode);
	// 		if (res?.success) {
	// 			toast.success(res.message);
	// 			roomOccupants = [];
	// 			resetting = false;
	// 			showAllocationModal = false;
	// 			await fetchRooms();
	// 			await fetchResidents();
	// 		} else {
	// 			toast.error('An error occurred. Please try again later.');
	// 			resetting = false;
	// 		}
	// 	} catch (e) {
	// 		resetting = false;
	// 		console.log(e);
	// 	}
	// }
	// onMount(async() => {
	//     console.log("hello")
	// })

	const actionButtons = [
		{
			icon: 'hugeicons:subnode-add',
			tooltip: 'Manage Allocations'
		}
	];

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

	async function fetchResidents() {
		try {
			loading = true;
			await GetResidents();
			residentOptions = $residentsStore.map((r: any) => {
				return {
					email: r.email,
					firstName: r.firstName,
					sex: r.sex,
					lastName: r.lastName,
					label: `${r.firstName} ${r.lastName}`,
					value: r.residentId,
					residentId: r.residentId
				};
			});

			const alcs = $roomsStore.map((o: any) => o.occupants);

			const allocatedResidentIds = alcs.flat().map((o: any) => o.residentId);
			
			residentOptions = $residentsStore
				.map((r: any) => ({
					email: r.email,
					firstName: r.firstName,
					sex: r.sex,
					lastName: r.lastName,
					label: `${r.firstName} ${r.lastName}`,
					value: r.residentId,
					residentId: r.residentId
				}))
				.filter((r: any) => !allocatedResidentIds.includes(r.residentId));

			loading = false;
		} catch (error) {
			loading = false;
			console.log(error);
		}
	}


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
			loading: allocating,
			handler: () => {}
		}
	];

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
	<DataTable
		{loading}
		{actionButtons}
		on:buttonClicked={handleAction}
		{columns}
		bodyData={$roomsStore}
	/>

	<!-- {/if} -->
</div>

{#if showAddModal}
	<Modal title="Add Room" bind:open={showAddModal}>
		<Form {schema} on:submit={createRoom}>
			<div class="md:grid grid-cols-2 gap-4">
				<div class="col-span-2">
					<FormInput name="roomNumber" required showLabel label="Room Number" />
				</div>
				<FormInput
					name="numberOfOccupants"
					type="number"
					showLabel
					required
					min={1}
					label="Allowed Number of Residents"
				/>
				<FormInput name="roomFee" required type="number" min={1} showLabel label="Room Fee" />
			</div>
			<div class="w-full flex mx-auto items-center justify-center align-middle py-4">
				<Button disabled={saving} type="submit" label={saving ? 'Saving...' : 'Add Room'} />
			</div>
		</Form>
	</Modal>
{/if}

{#if showAllocationModal}
	<Modal title="Allocation: Room {currentRoom.roomNumber}" bind:open={showAllocationModal}>
		{#if residentOptions.length === 0 && currentRoom.occupants.length === 0}
			<div class="text-sm font-semibold text-gray-500 text-center">
				No residents added yet or all residents have been allocated. Add residents to enable room
				allocation.
				<div class="w-full mt-2 flex justify-center">
					<Button label="Go to Residents" onClick={() => goto('/residents')} />
				</div>
			</div>
		{:else}
			{#if loading}
				<Loader />
			{:else}
				<DataTable
					columns={allocationsColumns}
					bodyData={roomOccupants}
					loading={fetchingAllocations}
				/>
			{/if}
			{#if currentRoom.occupants.length < currentRoom.numberOfOccupants}
				<Form schema={allocationSchema} on:submit={allocateRoom}>
					<FormSelect
						name="occupants"
						options={residentOptions}
						valueAsObject
						multiple
						showLabel
						label="Resident"
					/>
					<div class="w-full flex items-center py-4 justify-center">
						<Button
							type="submit"
							label={allocating ? 'Allocating...' : 'Allocate'}
							disabled={allocating}
						/>
					</div>
				</Form>
			{:else}
				<div class="w-full flex justify-center mx-auto align-middle">
					<Button
						label={resetting ? 'Resetting...' : 'Room fully booked. Click to reset allocations'}
						icon="hugeicons:alert-02"
						disabled={resetting}
						hasIcon
					/>
				</div>
			{/if}
		{/if}
	</Modal>
{/if}
