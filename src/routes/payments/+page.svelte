<script lang="ts">
	import { getPayments, paymentsStore } from "$lib/services/payment";
	import { pageDescription } from "$lib/stores/layoutStore";
	import { onMount } from "svelte";
	import DataTable from '$lib/components/dataTable.svelte';
    import toast, { Toaster } from 'svelte-french-toast';
	import { formatDate } from "$lib/utils/date-formatter";

    $pageDescription = "Manage resident fee payments";
    let loading = false

    const columns = [
        {
            name: 'Resident Name',
            cell: (row: any) => row.resident.firstName + ' ' + row.resident.lastName,
        }, 
        {
            name: 'Payment Date',
            cell: (row: any) => formatDate(row.dateOfPayment),
        }, 
        {
            name: 'Amount',
            cell: (row: any) => row.amountPaid
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

    onMount(async() => {
        await fetchPayments();
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