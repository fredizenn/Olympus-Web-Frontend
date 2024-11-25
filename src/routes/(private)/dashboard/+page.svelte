<script lang="ts">
	import { getResidents, residentsStore } from '$lib/services/residents';
	import { activePageHeader, pageActionButtons, pageDescription } from '$lib/stores/layoutStore';
	import { onMount } from 'svelte';
	import BarChart from './barChart.svelte';
	import PieChart from './PieChart.svelte';
	import { getMaintenanceRequests, maintenanceRequestsStore } from '$lib/services/maintenance';
	import Icon from '@iconify/svelte';
	import { getPayments, paymentsStore } from '$lib/services/payment';
	import { toCurrencyFormat } from '$lib/utils/currency';
	import Loader from '$lib/components/loader.svelte';

	$pageDescription = 'Overview and Summary';
	$activePageHeader = 'Dashboard';
	$pageActionButtons = [];
	// $pageActionButtons = [
	let loadingResidents = false;
	let loadingMaintenanceRequests = false;
	let loadingPayments = false;
	let totalPayments = 0
	let numberOfResidents = 0;
	let cancelledMaintenanceRequests = 0;
	let resolvedMaintenanceRequests = 0;
	let pendingMaintenanceRequests = 0;
	let pieChartData: any[];
	// ]

	async function fetchResidents() {
		try {
			loadingResidents = true;
			await getResidents();
			numberOfResidents = $residentsStore.length;
			pieChartData = [
				{ number: $residentsStore.filter((r: any) => r.sex === 'Female').length, name: 'Female' },
				{ number: $residentsStore.filter((r: any) => r.sex === 'Male').length, name: 'Male' }
			];
			console.log({ pieChartData }, { numberOfResidents });
			loadingResidents = false;
		} catch (error) {
			loadingResidents = false;
			console.log(error);
		}
	}


	async function fetchPayments() {
        loadingPayments = true
        try {
            await getPayments();
			totalPayments = $paymentsStore.reduce((a: any, b: any) => a + b.amountPaid, 0)
            loadingPayments = false;    
        } catch (error) {
            loadingPayments = false;
            console.log(error);
        }
    }

	async function fetchMaintenanceRequests() {
		try {
			loadingMaintenanceRequests = true;
			await getMaintenanceRequests();
			pendingMaintenanceRequests = $maintenanceRequestsStore.filter(
				(r: any) => r.status === 'Pending'
			).length;
			resolvedMaintenanceRequests = $maintenanceRequestsStore.filter(
				(r: any) => r.status === 'Resolved'
			).length;
			cancelledMaintenanceRequests = $maintenanceRequestsStore.filter(
				(r: any) => r.status === 'Cancelled'
			).length;
			loadingMaintenanceRequests = false;
		} catch (error) {
			loadingMaintenanceRequests = false;
			console.log(error);
		}
	}

	onMount(async () => {
		await fetchResidents();
		await fetchMaintenanceRequests();
		await fetchPayments();
	});
</script>

<div class="h-[90%] w-full md:grid grid-cols-2 gap-4">
	<div class="p-2 shadow text-center flex flex-col rounded">
		<div class="font-semibold text-gray-500 pt-4">Total Number of Residents</div>
		<div class="flex h-full text-7xl font-semibold items-center justify-center">
			{#if loadingResidents}
				<Loader />
			{:else}
			{numberOfResidents}
			{/if}
		</div>
	</div>
	<div class="p-2 shadow rounded">
		{#if loadingResidents}
			<PieChart {pieChartData} />
		{:else}
			<PieChart {pieChartData} />
		{/if}
	</div>
	<div class="col-span-2 p-2 shadow rounded">
		<div class="font-semibold text-sm text-gray-500">Total Payments Collected</div>
		<div class="h-full flex items-center justify-center text-center text-4xl">
			{#if loadingPayments}
				<Loader />
			{:else}
			{toCurrencyFormat(totalPayments)}
			{/if}
		</div>
	</div>
	<div class="col-span-2 p-2 shadow rounded">
		<div class="font-semibold text-sm text-gray-500">Maintenance Requests</div>
		{#if loadingMaintenanceRequests}
			<Loader />
		{:else}
		<div class="grid h-full justify-center items-center grid-cols-3 divide-x">
			<div class="py-6 px-3">
				<div class="text-xs flex items-center bg-amber-100 w-1/4 text-center rounded p-0.5 justify-center">Pending<span><Icon icon="hugeicons:clock-01" class="w-4 h-4 ml-1" /></span></div>
				<div class="text-center text-3xl">{pendingMaintenanceRequests}</div>
			</div>
			<div class="py-6 px-3">
				<div class="text-xs flex items-center bg-green-100 w-1/4 text-center rounded p-0.5 justify-center">Resolved<span><Icon icon="hugeicons:setting-done-01" class="w-4 h-4 ml-1" /></span></div>
				<div class="text-center text-3xl">{resolvedMaintenanceRequests}</div>
			</div>
			<div class="py-6 px-3">
				<div class="text-xs flex items-center bg-red-100 w-1/4 text-center rounded p-0.5 justify-center">Cancelled<span><Icon icon="hugeicons:cancel-circle" class="w-4 h-4 ml-1" /></span></div>
				<div class="text-center text-3xl">{cancelledMaintenanceRequests}</div>
			</div>
		</div>
		{/if}
	</div>
</div>
