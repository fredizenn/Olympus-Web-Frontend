<!-- Table.svelte -->
<script lang="ts" context="module">
	export interface TableColumn {
		name: string;
		cell: (row: any) => any;
		divStyle?: any;
		contentStyle?: any;
		align?: 'left' | 'center' | 'right';
		cellStyle?: (row: any) => any;
		isVisible?: boolean;
	}
	export interface IActionButton {
		label?: string;
		icon?: string;
		iconColor?: string;
		style?: string;
		tooltip?: string;
		hide?: (row: any) => any;
		permission?: string;
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
		Tooltip,
		Button,
		Checkbox
	} from 'flowbite-svelte';
	// import noDataImage from '$lib/images/no_data.png';
	import { writable } from 'svelte/store';

	export let columns: TableColumn[] = [];
	export let bodyData: any[];
	export let actionButtons: IActionButton[] = [];
	export let hideIndexing = false;
	export let loading = false;
	const visibleColumns = writable(
		columns.map((col, index) => ({
			index,
			name: col.name,
			isVisible: col.isVisible ?? true
		}))
	);

	function toggleColumn(index: number) {
		visibleColumns.update((cols) => {
			const updatedCols = [...cols];
			updatedCols[index].isVisible = !updatedCols[index].isVisible;
			return updatedCols;
		});
	}

	function resetColumns() {
		visibleColumns.update((cols) => cols.map((col) => ({ ...col, isVisible: true })));
	}

	const dispatch = createEventDispatcher();
	function handleDispatch(btnIndex: any, row: any) {
		dispatch('buttonClicked', { btnIndex, row });
	}

	const getColumnValue = (row: any, column: any, columnIndex: number) => {
		return column.cell(row);
	};

	function areAllButtonsHidden(row: any) {
		return actionButtons.every((btn) => {
			const isHidden = btn.hide ? btn.hide(row) : false;
			return isHidden;
		});
	}
</script>

{#if loading}
	<div class="flex h-full items-center justify-center">
		<Icon icon="line-md:loading-loop" class="text-indigo-500 w-12 h-12" />
	</div>
{:else if bodyData?.length > 0}
	<div class="m-2 flex justify-end">
		<div class="relative">
			<Button color="light">
				<Icon icon="mdi:view-column" class="mr-2 h-5 w-5" />
				Show/Hide Columns
			</Button>
			<Dropdown class="w-56">
				<div class="p-3">
					<div class="mb-2 flex items-center justify-between">
						<span class="text-sm font-medium">Toggle Columns</span>
						<button on:click={resetColumns} class="text-xs text-blue-600 hover:underline">
							Reset
						</button>
					</div>
					{#each $visibleColumns as col}
						<div class="flex items-center gap-2 py-1">
							<Checkbox checked={col.isVisible} on:change={() => toggleColumn(col.index)} />
							<span class="text-sm">{col.name}</span>
						</div>
					{/each}
				</div>
			</Dropdown>
		</div>
	</div>

	<div class="relative h-[650px] overflow-x-auto">
		<Table striped={true} class="w-full" hoverable={true}>
			<TableHead class="sticky top-0 border-b bg-white text-black">
				{#if !hideIndexing}
					<TableHeadCell>#</TableHeadCell>
				{/if}
				{#if columns.length}
					{#each columns as col, colIndex}
						{#if $visibleColumns[colIndex].isVisible}
							<TableHeadCell class="px-6 py-6 font-semibold">{col.name}</TableHeadCell>
						{/if}
					{/each}
				{/if}
				{#if actionButtons.length}
					<TableHeadCell class="whitespace-nowrap px-6 py-6 font-bold rtl:text-right"
						>{actionButtons.length > 1 ? 'Actions' : 'Action'}</TableHeadCell
					>
				{/if}
			</TableHead>
			<TableBody tableBodyClass="divide-y">
				{#if bodyData?.length}
					{#each bodyData as row, rowIndex}
						<TableBodyRow>
							{#if !hideIndexing}
								<TableBodyCell class="py-4 text-sm">
									<div class="alignLeft px-6 font-medium">
										<p class="mb-0">{rowIndex + 1}</p>
									</div>
								</TableBodyCell>
							{/if}
							{#each columns as column, columnIndex}
								{#if $visibleColumns[columnIndex].isVisible}
									<TableBodyCell class="py-2 text-sm">
										<div
											class="{column.contentStyle} {column.cellStyle && column.cellStyle(row)
												? column.cellStyle(row) + ' ' + 'w-2/4 rounded p-1 px-2 text-center'
												: ''}"
										>
											{getColumnValue(row, column, columnIndex)}
										</div>
									</TableBodyCell>
								{/if}
							{/each}
							{#if actionButtons.length > 0}
								<!-- <TableBodyCell class="relative flex"> -->
									{#if !areAllButtonsHidden(row)}
										<div class="relative flex p-3">
											<button
												id="dropdown-btn-{rowIndex}"
												class="flex h-9 w-9 items-center ml-4 justify-center rounded-full bg-gray-100"
											>
												<Icon icon="mage:dots" class="h-5 w-5" />
											</button>
											<Dropdown
												placement="left"
												triggeredBy="#dropdown-btn-{rowIndex}"
											>
												<!-- <div class="fixed rounded-md border bg-white p-1 shadow-lg"> -->
													{#each actionButtons as btn, btnIndex}
														<!-- <Authorize expected={btn.permission}> -->
															<button
																class:hidden={btn.hide ? btn.hide(row) : false}
																class="w-full text-xs {btn.style}"
																on:click={(_) => handleDispatch(btnIndex, row)}
															>
																<DropdownItem class="flex w-full items-center space-x-2 py-3">
																	{#if btn.icon}
																		<Icon icon={btn.icon} class="h-4 w-4 {btn.iconColor}" />
																	{/if}
																	{#if btn.label}
																		<span>{btn.label}</span>
																	{/if}
																</DropdownItem>
															</button>
														<!-- </Authorize> -->
													{/each}
												<!-- </div> -->
											</Dropdown>
										</div>
									{/if}
								<!-- </TableBodyCell> -->
							{/if}
						</TableBodyRow>
					{/each}
				{/if}
			</TableBody>
		</Table>
	</div>
{:else}
	<div class="mt-20 flex flex-col items-center justify-center">
		<!-- <img
			src={noDataImage}
			alt="No data"
			class="mx-auto h-20 w-20 items-center align-middle opacity-80"
		/> -->
		<div class="mt-1 text-center font-bold text-gray-600">No Data</div>
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
