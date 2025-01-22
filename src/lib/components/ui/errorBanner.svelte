<script lang="ts">
	import { fade } from "svelte/transition";

    export let error: string | null = null;

</script>

{#if error}
<div in:fade out:fade class="bg-red-100 p-3 font-medium text-xs text-center w-full mx-auto rounded-md mt-4 text-red-500">{error}</div>
{/if}
