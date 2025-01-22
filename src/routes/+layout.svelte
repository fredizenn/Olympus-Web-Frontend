<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.pcss';
	import { authenticated, getUser, init } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';

	onMount(async () => {
		if (!getUser()) {
			authenticated.set(false);
			goto('/login');
		}
		await init();
	});
</script>

<div class="h-screen">
	<slot />
</div>
