<script lang="ts">
	import { activePageHeader, pageActionButtons, pageDescription } from "$lib/stores/layoutStore";
	import BarChart from "./dashboard/barChart.svelte";
	import PieChart from "./dashboard/PieChart.svelte";

    $pageDescription = "Overview and Summary";
    $activePageHeader = "Dashboard";
    $pageActionButtons = [
        
    ]
</script>



<!-- <div class="h-[60%] w-full md:grid grid-cols-2 gap-4">
    <div class="p-2 shadow rounded">
        <BarChart />

    </div>
    <div class="p-2 shadow rounded-lg">
        <PieChart />
    </div>
</div> -->
