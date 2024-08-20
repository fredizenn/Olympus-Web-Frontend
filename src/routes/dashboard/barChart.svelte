<script lang="ts">
	import * as echarts from 'echarts';
	import { onMount } from 'svelte';
	// Create the echarts instance

    let chart: any
	onMount(() => {
		chart = echarts.init(document.getElementById('main'));

		// Draw the chart
		chart.setOption({
			title: {
				text: 'ECharts Getting Started Example'
			},
			tooltip: {},
			xAxis: {
				data: ['shirt', 'cardigan', 'chiffon', 'pants', 'heels', 'socks']
			},
			yAxis: {},
			series: [
				{
					name: 'sales',
					type: 'bar',
					data: [5, 20, 36, 10, 10, 20]
				}
			]
		});
	});
</script>

<div id="main" bind:this={chart} class="w-full h-full" />
