<script lang="ts">
	import { getContext, createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import { key } from './form';
	import { Input } from 'flowbite-svelte';
	// import { uniqueId } from 'lodash';
	import type { InputType } from 'flowbite-svelte';
	export let name = '';
	export let label = name;
	export let showLabel = false;
	export let required = false;
	export let readonly = false;
	export let placeholder = '';
	export let showRequiredIndicator = true;
	export let otherClasses = '';
	export let type: any = 'text';

	// let id = uniqueId(name);
	let dispatch = createEventDispatcher();

	const { touched, errors, data, setData }: any = getContext(key);

	function onChange() {
		dispatch('change', { name, value: $data[name] });
		// setData(name, value)
	}

	$: hasError = $touched[name] && $errors[name]?.length;
	$: error = $errors[name]?.join(', ');
</script>

<div class="">
	<!-- <label class="flex" for={id}> -->
	<span class="text-sm space-x-1 flex">
		{#if showLabel}
			<div class="pb-1 font-medium text-xs text-gray-600">
				{label}
			</div>
		{/if}
		{#if required && showRequiredIndicator}
			<span class="text-red-600" in:fade out:fade>*</span>
		{/if}
	</span>
	<!-- </label> -->

	{#if readonly}
		<input
			class="block w-full disabled:bg-gray-100 disabled:cursor-not-allowed rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6 {otherClasses}"
			value={$data[name] || ''}
			{required}
			{readonly}
			{placeholder}
			on:change={onChange}
			{type}
			{...$$restProps}
		/>
	{:else}
		<input
			class="block w-full disabled:bg-gray-100 disabled:cursor-not-allowed rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6 {otherClasses}"
			{name}
			{required}
			{readonly}
			{placeholder}
			on:change={onChange}
			{type}
			{...$$restProps}
		/>
	{/if}

	<!-- <input class="rounded-md p-2 border-gray-300 border bg-white {otherClasses}" {name} {required} {readonly} {placeholder} on:change={onChange} {...$$restProps}/> -->
	<!-- <input class="rounded-md p-2 border-gray-300 border bg-white {otherClasses}" bind:value={$data[name]} {name} {required} {readonly} {placeholder} on:change={onChange} {...$$restProps}/> -->
	{#if hasError}
		<!-- <label class="label" for={id} in:fade out:fade> -->
		<span class="label-text-alt text-xs text-red-600" in:fade out:fade>{error}</span>
		<!-- </label> -->
	{/if}
</div>
