<script lang="ts" context="module">
	export interface IButton {
		text: string;
		color?:
			| 'none'
			| 'red'
			| 'yellow'
			| 'green'
			| 'purple'
			| 'blue'
			| 'light'
			| 'dark'
			| 'primary'
			| 'alternative';
		type?: ButtonType;
		icon?: string;
		handler: (_: IButton) => void
	}
</script>

<script lang="ts">
	import Icon, { type IconifyIcon } from '@iconify/svelte';

	import { Modal } from 'flowbite-svelte';
	import type { ButtonType } from 'flowbite-svelte';
	import Button from './button.svelte';
	import Loader from './loader.svelte';
	export let open = false;
	export let loading = false;
	export let title = '';
	export let size: any = 'md'
	let type: ButtonType = 'button';
	export let buttons: IButton[] = [];
</script>

<Modal {size} {title} bind:open placement="center" autoclose={false}>
	<slot />
	<!-- <svelte:fragment slot="footer">
		<Button>I accept</Button>
		<Button color="alternative">Decline</Button>
	</svelte:fragment> -->
	<div class="border-t pt-4 flex justify-end space-x-4">
		{#each buttons as button}
			<Button
				label={button.text}
				{type}
				on:click={(_) => button.handler(button)}
				disabled={loading}
			>
				{#if loading}
					<Loader />
				<!-- {:else}
					<Icon class="mr-2 -ml-1 w-5 h-5" icon={button.icon} /> -->
				{/if}
				{button.text}
			</Button>
		{/each}
	</div>
</Modal>
