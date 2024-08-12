<script lang="ts" context="module">
	export interface TableColumn {
		name: string;
		cell: (row: any) => any;
		divStyle?: any;
		contentStyle?: any;
		align?: 'left' | 'center' | 'right';
		cellStyle?: (row: any) => any;
	}
	export interface IActionButton {
		label?: string;
		icon?: string;
		iconColor?: string;
		style?: string;
		tooltip?: string;
		hide?: (row: any) => any;
	}
</script>

<script lang="ts">
	import Icon from '@iconify/svelte';
	import { createEventDispatcher } from 'svelte';
	import {
		Dropdown,
		DropdownItem,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Tooltip
	} from 'flowbite-svelte';
	import noDataImage from '$lib/images/no_data.svg';
	import Loader from '$lib/components/loader.svelte';
	// import noDataImg from '../lib/images/no-data.svg';

	export let columns: TableColumn[] = [];
	export let bodyData: any[];
	export let actionButtons: IActionButton[] = [];
	// export let height = 400;
	export let hideIndexing = false;
	export let loading = false;
	// export let onAction: ((index: number, btn: IActionButton) => void) | undefined;

	const dispatch = createEventDispatcher();
	function handleDispatch(btnIndex: any, row: any) {
		dispatch('buttonClicked', { btnIndex, row });
	}

	const getColumnValue = (row: any, column: any, columnIndex: number) => {
		return column.cell(row);
	};
</script>
{#if loading}
<Loader />

{:else if bodyData?.length > 0}
	<div class="relative overflow-x-auto">
		<Table class="w-full" hoverable={true}>
			<TableHead theadClass="text-xs font-bold" class="sticky top-0 border-b bg-white">
				{#if !hideIndexing}
					<TableHeadCell>#</TableHeadCell>
				{/if}
				{#if columns.length}
					{#each columns as col}
						<TableHeadCell class="px-4 text-xs py-4 font-semibold">{col.name}</TableHeadCell>
					{/each}
				{/if}
				{#if actionButtons.length}
					<TableHeadCell class="whitespace-nowrap px-4 py-4 font-bold rtl:text-right"
						>{actionButtons.length > 1 ? 'Actions' : 'Action'}</TableHeadCell
					>
				{/if}
			</TableHead>
			<TableBody tableBodyClass="divide-y">
				{#if bodyData?.length}
					{#each bodyData as row, rowIndex}
						<TableBodyRow>
							{#if !hideIndexing}
								<TableBodyCell class="py-4 text-xs">
									<div class="alignLeft px-6 font-medium">
										<p class="mb-0">{rowIndex + 1}</p>
									</div>
								</TableBodyCell>
							{/if}
							{#each columns as column, columnIndex}
								<TableBodyCell class="py-2 text-xs">
									<div
										class="{column.contentStyle} {column.cellStyle && column.cellStyle(row)
											? column.cellStyle(row) + ' ' + 'w-2/4 rounded p-1 px-2 text-center'
											: ''}"
									>
										{getColumnValue(row, column, columnIndex)}
									</div>
								</TableBodyCell>
							{/each}
							{#if actionButtons.length > 0}
								<TableBodyCell class="flex">
									<!-- <button
										id="click"
										class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100"
									>
										<Icon icon="mage:dots" class="h-5 w-5" />
									</button> -->
									<!-- <Dropdown trigger="click"> -->
										{#each actionButtons as btn, btnIndex}
												<button
													class:hidden={btn.hide ? !btn.hide(row) : false}
													class="w-full text-xs {btn.style}"
													on:click={(_) => handleDispatch(btnIndex, row)}
												>
													<!-- <DropdownItem class="flex w-full items-center space-x-2 py-3"> -->
														{#if btn.icon}
															<Icon icon={btn.icon} class="h-5 w-5 {btn.iconColor}" />
														{/if}
														{#if btn.label}
															<span class="">{btn.label}</span>
														{/if}
														<Tooltip type="light" placement="bottom">{btn.tooltip}</Tooltip>

													<!-- </DropdownItem> -->
												</button>
										{/each}
									<!-- </Dropdown> -->
								</TableBodyCell>
							{/if}
						</TableBodyRow>
					{/each}
				{/if}
			</TableBody>
		</Table>
	</div>
{:else}
	<div class="mt-20 flex flex-col items-center justify-center">
		<img
			src={noDataImage}
			alt="No data"
			class="mx-auto h-32 w-auto items-center align-middle opacity-80"
		/>
		<!-- <div class="mt-1 text-center text-gray-600">No Data</div> -->
	</div>
{/if}

<style>
	.alignCenter {
		@apply flex items-center justify-center text-center;
	}
	.alignLeft {
		@apply flex items-center justify-start pl-2;
	}
</style>
