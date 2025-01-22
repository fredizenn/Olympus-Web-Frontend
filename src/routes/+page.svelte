<script lang="ts">
	import { goto } from '$app/navigation';
	import { authenticated, init } from '$lib/stores/authStore';
	import { onMount } from 'svelte';

	onMount(async () => {
		if (!$authenticated) {
			goto('/login');
		} else {
			await init();
			if ($authenticated) goto('/dashboard');
		}
	});
</script>
