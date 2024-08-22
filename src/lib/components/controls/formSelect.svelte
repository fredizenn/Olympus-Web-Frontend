<script lang="ts">
	import { createEventDispatcher, getContext, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { key } from './form';
	import Svelecte from 'svelecte';
	import { ValidationMessage } from '@felte/reporter-svelte';

	export let name = '';
	export let label = name;
	export let showLabel = false;
	export let required = false;
	export let placeholder = '';
	export let text = ''
	export let options: any = [];
	export let multiple = false;
	export let valueAsObject = false;
	export let renderButton = false;
	const dispatch = createEventDispatcher();
	const { touched, errors, data }: any = getContext(key);
	
	// export function onChange({detail}: any) {
	// 	dispatch('change', { detail });
	// }

	export let onChange: (_: any) => void = () => {};
	// $: hasError = Array.isArray($touched[name] && $errors[name]) ? $touched[name] && $errors[name].length : $touched[name] && $errors[name];
	// $: hasError =  $touched[name] && $errors[name].length;
	// $: error = $errors[name]

</script>

<div class="relative">
	<div class="flex">
		{#if showLabel}
		<div class="pb-1 text-sm text-gray-400">
			{label}
		</div>
	{/if}
	{#if required}
		<span class="text-red-600" in:fade out:fade>*</span>
	{/if}
	</div>
	
	<Svelecte
		bind:value={$data[name]}
		{name}
		{options}
		{required}
		{placeholder}
		on:change={onChange}
		searchable
		{multiple}
		{valueAsObject}
		{...$$restProps}
		class="leading-loose"
	/>
	
	<ValidationMessage for={name} let:messages={message}>
		{#if !valueAsObject}
			
		<!-- <span class="label-text-alt text-xs text-red-600" in:fade out:fade>{error}</span>
		{:else} -->
		<span class="label-text-alt text-xs text-red-600" in:fade out:fade>{message || ""}</span>
		{/if}
	</ValidationMessage>
</div>
