<script lang="ts">
	import {
		Navbar,
		NavLi,
		NavUl,
		NavHamburger,
		Avatar,
		Dropdown,
		DropdownItem,
		DropdownHeader,
		Tooltip
	} from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import type { IMenu } from './sidebar.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Icon, { type IconifyIcon } from '@iconify/svelte';
	import { activePageHeader } from '$lib/stores/layoutStore';

	export let menus: IMenu[] = [];

	let showLayOver: boolean = false;

	function triggerMenu() {
		showLayOver = !showLayOver;
	}
	// let profileData: IUser = {
	// 	fullname: '',
	// 	initials: '',
	// 	phonenumber: ''
	// };

	// $: person = $profile;
	$: isActivePage = $page.route.id;

	// let dropDownMenu: any = [

	// 	{
	// 		label: 'My Invitations',
	// 		path: '/invitations',
	// 		icon: 'mdi:invite',
	// 		permission: '',
	// 		onClick: () => goto('/invitations')
	// 	},
	// 	{
	// 		label: 'Switch Organisation',
	// 		icon: '	mdi:nintendo-switch',
	// 		permission: '',
	// 		onClick: () => switchCompany()
	// 	},
	// 	{
	// 		label: 'Manage Subscription',
	// 		path: '/subscription',
	// 		icon: 'streamline:subscription-cashflow',
	// 		onClick: () => { goto('/subscription'); companyLogout() }
	// 	},
	// 	{
	// 		label: 'Change Password',
	// 		icon: 'mdi:key-change',
	// 		onClick: () => goto('/settings/change-password'),
	// 		permission: ''
	// 	},
	// 	// {
	// 	// 	label: 'Request Password Reset',
	// 	// 	icon: 'icon-park:change',
	// 	// 	onClick: () => goto('/private/settings/accounts/password-reset')
	// 	// },
	// 	{
	// 		label: 'Logout',
	// 		icon: 'ic:outline-logout',
	// 		onClick: () => signOut(),
	// 	}
	// ];

	// const companyPageButtons = () => {
	// 	const x = [2, 4].map(i =>dropDownMenu[i] )
	// 	return x
	// }
	// const logoutBtn = dropDownMenu[dropDownMenu.length - 1]
	let currentCompanyName: any;
	onMount(() => {
		currentCompanyName = localStorage.getItem('cmpName');
	});
</script>

<Navbar let:hidden let:toggle class="sticky w-full top-0 z-40 shadow-sm">
	<div class="flex w-full items-center justify-between">
		<div class="font-semibold py-2 text-xs capitalize text-gray-400">{$activePageHeader}</div>

		<button on:click={() => goto('/login')}><Icon icon="hugeicons:settings-01" class="w-5 h-5" /></button>
	</div>
	<!-- <div class:text-gray-500={!isCompanyPage} class="font-bold uppercase text-sm text-[#2E8DE1]"> -->

	<!-- </div> -->
	<div class="flex items-center justify-end md:order-2">
		<NavHamburger on:click={toggle} class1="w-full md:flex md:w-auto md:order-1" />
	</div>

	<NavUl {hidden} divClass="w-full lg:hidden ">
		{#if menus.length}
			{#each menus as item}
				<NavLi active={item.path === isActivePage} href={item.path}>{item.label}</NavLi>
			{/each}
		{/if}
	</NavUl>
</Navbar>

<!-- {#if showLayOver}
	<LayOverMenu />
{/if} -->
