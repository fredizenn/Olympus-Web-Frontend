<script lang="ts">
	import { createForm } from 'felte';
	import { createEventDispatcher, setContext } from 'svelte';
	import { reporter } from '@felte/reporter-svelte';
	import { validator } from '@felte/validator-yup';
	import { key } from './form';

	export let schema: any = [];
	
	// export let transform = (values: any) => values;

	export let init = {};

	let dispatch = createEventDispatcher();

	const formInfo = createForm({
		onSubmit: (values, context) => {
			dispatch('submit', { values, context });
		},
		// validate: validate,
		extend: [validator({ schema }), reporter],
		// transform: transform,
		initialValues: init
	});

	setContext(key, formInfo);

	const { form, data, errors, isValid } = formInfo;

	$: dispatch('change', { values: $data, form: formInfo });

	setTimeout(() => dispatch('ready', formInfo), 0);
</script>

<form use:form>
	<slot />
</form>
