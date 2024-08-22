<script lang="ts">
	import { getResidents, residentsStore } from '$lib/services/residents';
	import { activePageHeader, pageActionButtons, pageDescription } from '$lib/stores/layoutStore';
	import { onMount } from 'svelte';
	import BarChart from './dashboard/barChart.svelte';
	import PieChart from './dashboard/PieChart.svelte';

	$pageDescription = 'Overview and Summary';
	$activePageHeader = 'Dashboard';
	// $pageActionButtons = [
	let loadingResidents = false;
	let numberOfResidents = 0;
	let pieChartData: any []
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

	onMount(async () => {
		await fetchResidents();
	});
</script>

<div class="h-[60%] w-full md:grid grid-cols-2 gap-4">
	<div class="p-2 shadow rounded">
		<BarChart />
	</div>
	<div class="p-2 shadow rounded-lg">
        {#if loadingResidents}
		<PieChart {pieChartData} />
        {:else}
        <PieChart {pieChartData} />
        {/if}
	</div>
</div>
