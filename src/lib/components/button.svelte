<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Button } from 'flowbite-svelte';
	import Loader from './loader.svelte';

	export let otherClasses: string = '';
	export let onClick: (_: any) => void = () => {};
	export let type: any = 'button';
	export let disabled: any = false;
	export let label: string;
	export let hasIcon = false;
	export let icon = '';
	// export let loading = false;
</script>

<Button
	{type}
	{disabled}
	class="rounded flex bg-black items-center focus:ring-2 focus:ring-bg-indigo-400 py-1 text-xs capitalize {otherClasses}"
	on:click={onClick}
>
	<Icon {icon} class="h-4 w-4 mr-1" />
	{label}
	<!-- {#if loading}
		<Loader />
	{/if} -->
</Button>
