<script lang="ts">
	import { AddPayment, GetPayments, type IPayment } from '$lib/services/payment';
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
	import { getRooms, roomsStore } from '$lib/services/rooms';
	import { GetResidents } from '$lib/services/residents';
	import { toCurrencyFormat } from '$lib/utils/currency';
	import SlideOver from '$lib/components/ui/slideOver.svelte';
	import Loader from '$lib/components/loader.svelte';
	import { AllocateRoom, GetAllocations } from '$lib/services/allocations';

	$activePageHeader = 'Allocation Management';
	$pageDescription = 'Manage room allocations';
	let loading = false;
	let loadingResidents = false;
	let allocations: any[] = [];
	let loadingRooms = false;
	let saving = false;
	let residentOptions: any = [];
	let rooms: any = [];
	let showAddModal = false;
	let roomPrice = 0;
	const schema = yup.object().shape({
		resident: yup.object().test('Resident', function (value) {
			return !!value;
		}),
		startDate: yup.string().required(),
		room: yup.object().test('Room', function (value) {
			return !!value;
		}),
	});

	$pageActionButtons = [
		{
			label: 'New Allocation',
			icon: 'hugeicons:folder-add',
			onClick: () => (showAddModal = true)
		}
	];

	const columns = [
		{
			name: 'Resident Name',
			cell: (row: any) => row.residentName
		},
		{
			name: 'Room Number',
			cell: (row: any) => row.roomNumber
		},
		// {
		// 	name: 'Room Number',
		// 	cell: (row: any) => row?.room?.roomNumber
		// },
		
		{
			name: 'Start Date',
			cell: (row: any) => formatDate(row.startDate)
		},
		{
			name: 'End Date',
			cell: (row: any) => formatDate(row.endDate) || 'N/A'
		},
		{
			name: 'Status',
			cell: (row: any) => row.isActive ? 'Active' : 'Expired'
		}

		// {
		//     name: 'Room'
		// }
	];

	async function fetchAllocations() {
		loading = true;
		try {
			const res = await GetAllocations();
			if (res.isSuccess) {
				allocations = res.data;
				loading = false;
			} else {
				toast.error(res.message);
			}
			loading = false;
		} catch (error: any) {
			loading = false;
			toast.error(error);
		}
	}

	async function fetchRooms() {
		try {
			loadingRooms = true;
			const res = await getRooms();
			if (res.isSuccess) {

				rooms = res.data.map((r: any) => {
					return {
						...r,
						label: r.roomNumber,
						value: r.id
					};
				});
				loadingRooms = false;
			} else {
				toast.error(res.message);
			}
		} catch (error) {
			loadingRooms = false;
		}
	}

	async function fetchResidents() {
		try {
			loadingResidents = true;
			const res = await GetResidents();
			if (res.isSuccess) {
				residentOptions = res.data.map((r: any) => {
					return {
						...r,
						label: r.fullName,
						value: r.residentId,
						residentNumber: r.residentNumber
					};
				});
				loadingResidents = false;
			} else {
				toast.error(res.message);

				loadingResidents = false;
			}
		} catch (error) {
			loadingResidents = false;
			toast.error(String(error));
		}
	}

	async function handleAllocate({ detail }: any) {
		try {
			saving = true;
			const { values } = detail;
			const data: any = {
				residentId: values.resident.id,
				roomId: values.room.id,
				startDate: values.startDate,
                endDate: values.endDate
			};
			const res = await AllocateRoom(data);
			if (res?.isSuccess) {
				saving = false;
				showAddModal = false;
				await fetchAllocations();
				toast.success(res.message);
			} else {
				saving = false;
				toast.error(res.message);
			}
		} catch (e: any) {
			toast.error(e);
		}
	}


	onMount(async () => {
		await fetchAllocations();
		await fetchRooms();
		await fetchResidents();
		// await fetchResidents();
	});

	const actionButtons = [
		{
			icon: 'hugeicons:property-view',
			tooltip: 'Manage Allocations',
			iconColor: 'text-purple-600'
		}
	];

	async function handleAction() {
		try {
		} catch (e) {}
	}
</script>

<Toaster />
<div>
	<!-- {#if loading}
		<Loader />
	{:else} -->
		<DataTable {loading} on:buttonClicked={handleAction} {columns} bodyData={allocations} />
	<!-- {/if} -->
</div>

{#if showAddModal}
	<Modal title="New Allocation" bind:open={showAddModal}>
	<Form {schema} on:submit={handleAllocate}>
		<div class="space-y-4 gap-4">
			<FormSelect
				options={rooms}
				name="room"
				valueAsObject
				required
				showLabel
				label="Room"
			/>
			<FormSelect
				options={residentOptions}
				name="resident"
				valueAsObject
				required
				loading={loadingResidents}
				fields={['residentNumber']}
				showLabel
				label="Resident - Search by Resident Number"
			/>
			
			<FormInput name="startDate" type="date" required showLabel label="Start Date" />
            <FormInput name="endDate" type="date" required showLabel label="Expected End Date" />

		</div>
		<div class="flex justify-center w-full mt-4">
			<Button
				type="submit"
				disabled={saving}
				otherClasses="p-3 bg-green-600 w-full"
				label={saving ? 'Saving...' : 'Allocate'}
			/>
		</div>
	</Form>
</Modal>
{/if}
