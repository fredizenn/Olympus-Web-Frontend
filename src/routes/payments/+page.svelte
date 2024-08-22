<script lang="ts">
	import { addPayment, getPayments, paymentsStore } from "$lib/services/payment";
	import { pageActionButtons, pageDescription } from "$lib/stores/layoutStore";
	import { onMount } from "svelte";
	import DataTable from '$lib/components/dataTable.svelte';
    import toast, { Toaster } from 'svelte-french-toast';
	import { formatDate } from "$lib/utils/date-formatter";
	import Modal from "$lib/components/modal.svelte";
	import Form from "$lib/components/controls/form.svelte";
    import * as yup from "yup";
	import FormInput from "$lib/components/controls/formInput.svelte";
	import FormSelect from "$lib/components/controls/formSelect.svelte";
	import Button from "$lib/components/button.svelte";
	import { getRooms, roomsStore } from "$lib/services/rooms";
	import { getResidents, residentsStore } from "$lib/services/residents";
	import { toCurrencyFormat } from "$lib/utils/currency";

    $pageDescription = "Manage resident fee payments";
    let loading = false
    let loadingResidents = false;
    let loadingRooms = false;
    let saving = false;
    let residentOptions: any = [];
    let rooms: any = [];
    let showAddModal = false;
    let roomFee = 0
    const schema = yup.object().shape({
        resident: yup.object().test("Resident", function (value) {
            return !!value
        }),
        dateOfPayment: yup.string().required(),
        room: yup.object().test("Resident", function (value) {
            return !!value
        }),
        amountPaid: yup.number().required("Amount paid is required"),
    })

    $pageActionButtons = [
		{
			label: 'Add',
			icon: 'hugeicons:folder-add',
			onClick: () => (showAddModal = true)
		}
	];
    
    const columns = [
        {
            name: 'Resident Name',
            cell: (row: any) => row.resident.firstName + ' ' + row.resident.lastName,
        },
        {
            name: 'Room Number',
            cell: (row: any) => row.room.roomNumber
        },
        {
            name: 'Room Fee (GHC)',
            cell: (row: any) => toCurrencyFormat(row.room.roomFee),
        }, 
        {
            name: 'Amount Paid (GHC)',
            cell: (row: any) => toCurrencyFormat(row.amountPaid)
        },
        {
            name: 'Payment Date',
            cell: (row: any) => formatDate(row.dateOfPayment),
        }, 
        
        // {
        //     name: 'Room'
        // } 
    ]
    async function fetchPayments() {
        loading = true
        try {
            await getPayments();
            loading = false;
            
        } catch (error) {
            loading = false;
            console.log(error);
        }
    }

    async function fetchRooms() {
		try {
			loadingRooms = true;
			await getRooms();
            rooms = $roomsStore.map((r: any) => {
                return {
                    ...r,
                    label: r.roomNumber,
                    value: r.roomId
                }
            });
			loadingRooms = false;
		} catch (error) {
			loadingRooms = false;
			console.log(error);
		}
	}

    async function fetchResidents() {
		try {
			loadingResidents = true;
			await getResidents();
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

			loadingResidents = false;
		} catch (error) {
			loading = false;
			console.log(error);
		}
	}

    async function createPayment({detail}: any) {
        try {
            saving = true;
            const { values } = detail;
            const res = await addPayment(values);
            if (res?.success) {
                saving = false;
                showAddModal = false;
                await fetchPayments();
                toast.success(res.message)
            } else {
                saving = false;
                toast.error("An error occurred")
            }
        } catch (e: any) {
            toast.error(e)
        }
    }

    async function onRoomChange({detail}: any) {
        console.log({detail})
        const { occupants } = detail;
        roomFee = detail.roomFee
        residentOptions = occupants
    }

    onMount(async() => {
        await fetchPayments();
        await fetchRooms();
        // await fetchResidents();
    })

    const actionButtons = [
        {
            icon: 'hugeicons:property-view',
            tooltip: 'Manage Allocations',
            iconColor: 'text-purple-600'
        }
    ];

    


    async function handleAction() {
        try {

        } catch (e) {

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
		{columns}
		bodyData={$paymentsStore}
	/>

	<!-- {/if} -->
</div>

{#if showAddModal}
<Modal title="Add Payment" bind:open={showAddModal}>
    <Form {schema} on:submit={createPayment}>
        <div class="md:grid grid-cols-2 gap-4">
            <FormSelect options={rooms} name="room" onChange={onRoomChange} valueAsObject required showLabel label="Room" />
            <FormSelect options={residentOptions} name="resident" valueAsObject required showLabel label="Resident" />
            <div class="col-span-2">
                <FormInput readonly bind:value={roomFee} showLabel label="Room Fee (GHC)" />
            </div>
            <FormInput name="amountPaid" type="number" min={1} required showLabel label="Amount Paid" />   
            <FormInput name="dateOfPayment" type="date" required showLabel label="Date of Payment" />
        </div>
        <div class="flex justify-center w-full mt-2">
            <Button type="submit" disabled={saving} label={saving ? 'Saving...' : 'Add Payment'} />
        </div>
    </Form>
</Modal>
{/if}