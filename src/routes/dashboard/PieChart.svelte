<script lang="ts">
	import * as echarts from 'echarts';
	import { onMount } from 'svelte';
    
	export let pieChartData: any = [];
	let pieChart: any;
    let chart: echarts.ECharts;

	let option = {
		tooltip: {
			trigger: 'item'
		},
		legend: {
			top: '5%',
			left: 'center'
		},
		series: [
			{
				name: 'Number of Residents',
				type: 'pie',
				radius: ['40%', '70%'],
				avoidLabelOverlap: false,
				padAngle: 5,
				itemStyle: {
					borderRadius: 10
				},
				label: {
					show: false,
					position: 'center'
				},
				emphasis: {
					label: {
						show: true,
						fontSize: 40,
						fontWeight: 'bold'
					}
				},
				labelLine: {
					show: false
				},
				data: pieChartData.map((d: any) => ({ value: d.number, name: d.name }))
			}
		]
	};

    onMount(() => {
        chart = echarts.init(pieChart);
        chart.setOption(option);
    })
</script>


<div bind:this={pieChart} class="w-full h-full" />