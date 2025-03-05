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

	$activePageHeader = 'Residents';
	$pageDescription = 'Manage resident fee payments';
	let loading = false;
	let loadingResidents = false;
	let paymentsList: IPayment[] = [];
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
		paymentDate: yup.string().required(),
		room: yup.object().test('Resident', function (value) {
			return !!value;
		}),
		amountPaid: yup.number().required('Amount paid is required')
	});
	const paymentMethods = [
		{
			label: 'Cash',
			value: 'Cash'
		},
		{
			label: 'Bank',
			value: 'Bank'
		},
		{
			label: 'Cheque',
			value: 'Cheque'
		},
		{
			label: 'Mobile Money',
			value: 'Mobile Money'
		}
	];

	$pageActionButtons = [
		{
			label: 'Add Payment',
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
			name: 'Resident Number',
			cell: (row: any) => row.residentNumber
		},
		// {
		// 	name: 'Room Number',
		// 	cell: (row: any) => row?.room?.roomNumber
		// },
		
		{
			name: 'Amount Paid (GHC)',
			cell: (row: any) => toCurrencyFormat(row.amountPaid)
		},
		{
			name: 'Balance Due (GHC)',
			cell: (row: any) => toCurrencyFormat(row.balanceDue)
		},
		{
			name: 'Payment Date',
			cell: (row: any) => formatDate(row.paymentDate)
		}

		// {
		//     name: 'Room'
		// }
	];
	async function fetchPayments() {
		loading = true;
		try {
			const res = await GetPayments();
			if (res.isSuccess) {
				paymentsList = res.data;
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
						value: r.roomNumber
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

	async function createPayment({ detail }: any) {
		try {
			saving = true;
			const { values } = detail;
			console.log({ values });
			const data: any = {
				residentNumber: values.resident.residentNumber,
				amountPaid: values.amountPaid,
				paymentDate: values.dateOfPayment,
				roomNumber: values.room.roomNumber,
				paymentMethod: values.paymentMethod.value
			};
			const res = await AddPayment(data);
			if (res?.isSuccess) {
				saving = false;
				showAddModal = false;
				await fetchPayments();
				toast.success(res.message);
			} else {
				saving = false;
				toast.error('An error occurred');
			}
		} catch (e: any) {
			toast.error(e);
		}
	}

	async function onRoomChange({ detail }: any) {
		console.log({detail})
		// const { occupants } = detail;
		roomPrice = detail.roomPrice;
		// residentOptions = occupants;
	}

	onMount(async () => {
		await fetchPayments();
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
		<DataTable {loading} on:buttonClicked={handleAction} {columns} bodyData={paymentsList} />
	<!-- {/if} -->
</div>

<SlideOver
	title="New Payment"
	show={showAddModal}
	onClose={() => {
		showAddModal = false;
	}}
>
	<Form {schema} on:submit={createPayment}>
		<div class="space-y-4 gap-4">
			<FormSelect
				options={rooms}
				name="room"
				onChange={onRoomChange}
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
			<div class="col-span-2">
				<FormInput readonly bind:value={roomPrice} showLabel label="Room Fee (GHC)" />
			</div>
			<FormInput name="amountPaid" type="number" min={1} required showLabel label="Amount Paid" />
			<FormInput name="paymentDate" type="date" required showLabel label="Date of Payment" />
			<FormSelect
				options={paymentMethods}
				name="paymentMethod"
				valueAsObject
				required
				showLabel
				label="Payment Method"
			/>
		</div>
		<div class="flex justify-center w-full mt-4">
			<Button
				type="submit"
				disabled={saving}
				otherClasses="p-3 bg-green-600 w-full"
				label={saving ? 'Saving...' : 'Add Payment'}
			/>
		</div>
	</Form>
</SlideOver>
