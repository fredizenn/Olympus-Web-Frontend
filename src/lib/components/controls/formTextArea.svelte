<script lang="ts">
	import { getContext, createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import { key } from './form';
	import { Input, Textarea } from 'flowbite-svelte';
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

<div class="form-control">
	<!-- <label class="flex" for={id}> -->
	<span class="text-sm flex">
		{#if showLabel}
			<div class="pb-1 text-gray-400">
				{label}
			</div>
		{/if}
		{#if required && showRequiredIndicator}
			<span class="text-red-600" in:fade out:fade>*</span>
		{/if}
	</span>
	<!-- </label> -->

	{#if readonly}
		<Textarea
			size="sm"
			class="w-full rounded border text-sm border-gray-300 px-2 py-1 text-black shadow shadow-gray-50 outline-transparent placeholder:text-gray-500/80 focus:outline-none focus:outline-transparent {otherClasses}"
			value={$data[name] || ''}
			{required}
			{readonly}
			{placeholder}
			on:change={onChange}
			{type}
			{...$$restProps}
		/>
	{:else}
		<Textarea
			class="w-full rounded border border-gray-300 px-3 py-2 text-black shadow shadow-gray-50 outline-transparent placeholder:text-gray-500/80 focus:outline-none focus:outline-transparent {otherClasses}"
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
