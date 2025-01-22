<script lang="ts" context="module">
	export interface IMenu {
		label: string;
		path: string;
		icon: string | IconifyIcon;
		iconColor?: string;
		permission?: any;
	}
</script>

<script lang="ts">
	import {
		Sidebar,
		SidebarWrapper,
		SidebarBrand,
		SidebarItem,
		SidebarGroup
	} from 'flowbite-svelte';
	import Icon, { type IconifyIcon } from '@iconify/svelte';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';

	export let menus: IMenu[] = [];

	$: isActivePage = $page.route.id;

	$: activeUrl = $page.url.pathname;

	let activeClass = 'bg-gray-700 text-gray-200 group font-bold flex';
	let nonActiveClass = 'hover:bg-gray-50 text-gray-600';

	$: if (isActivePage) {
		let splitResult: any = isActivePage?.split('/');

		if ((splitResult?.length ?? 0) > 2) {
			isActivePage = `/${splitResult[1]}`;
		}

		// if ((splitResult?.length ?? 0) > 2) {
		// 	isActivePage = `/${splitResult[1]}/`;
		// }
	}

	$: if (activeUrl) {
		let splitResult: any = activeUrl?.split('/');
		if ((splitResult?.length ?? 0) > 2) {
			activeUrl = `/${splitResult[1]}`;
		}
	}

	let site = {
		name: '',
		href: '/',
	};
</script>

<Sidebar
	{activeClass}
	{nonActiveClass}
	{activeUrl}
	asideClass="hidden bg-white shadow lg:block w-64 h-full"
>
	<SidebarWrapper divClass=" h-full py-2">
		<SidebarGroup ulClass="space-y-3 ">
			<div class="py-6 font-semibold  tracking-tight text-xl text-center">
				ShelterSync
			</div>
			<!-- <SidebarBrand
				{site}
				aClass="flex items-center text-sm gap-2 m-4 p-2 justify-center"
				imgClass="h-12 w-auto"
    
			/> -->
			
			{#if menus.length}
				{#each menus as { label, icon, path, iconColor, permission } (label) }
					<div class="px-1" in:fade out:fade>
						<SidebarItem
							href={path}
							{label}
							class="flex items-center w-5/6 mx-auto align-middle gap-2 rounded-md px-1 py-2 pl-8 text-xs font-medium"
						>
							<svelte:fragment slot="icon">
								<Icon
									{icon}
									style="font-size: 18px"
									class={path === activeUrl ? 'text-gray-200' : 'text-gray-600 text-opacity-80'}
								/>
							</svelte:fragment>
						</SidebarItem>
					</div>
				{/each}
			{/if}
		</SidebarGroup>
	</SidebarWrapper>
</Sidebar>
