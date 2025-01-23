<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/button.svelte';
	import type { IResident } from '$lib/services/residents';
	import { residentFormStep } from '$lib/stores/layoutStore';
	import { formatDate } from '$lib/utils/date-formatter';
	import Icon from '@iconify/svelte';
	export let data: IResident = {} as IResident;
	let loading = false;
    let isComplete = true;
</script>

<div class="">
	{#if loading}
		<div class="items-center justify-center overflow-hidden flex w-full">
			<Icon icon="line-md:loading-loop" class="text-green-500 w-20 h-20"/>
		</div>
	{:else if isComplete}
        <div class="items-center justify-center overflow-hidden flex w-full">
            <Icon icon="charm:circle-tick" class="text-green-500 w-16 h-16"/>
        </div>
        <div class="text-center text-sm py-4">Registration complete. You may proceed to record payment.</div>
        <div class="flex justify-end gap-4 mt-4">
			<!-- <Button otherClasses="w-1/3 p-3" type="button" label={'Skip'} /> -->

			<Button
				otherClasses="w-full p-3"
				type="button"
				label={'Go to payments'}
                onClick={() => goto('/payments')}
			/>
		</div>
    {:else}
    <div class="w-full flex justify-end">
		<button
			class="flex justify-end items-center gap-2 py-1 text-sm"
			on:click={() => residentFormStep.set(2)}>&larr; Back</button
		>
	</div>
		<div class="px-4 sm:px-0">
			<p class="mt-1 max-w-2xl font-semibold text-sm/6 text-center">Personal Details</p>
		</div>
		<div class="mt-6 border-t border-gray-100">
			<dl class="divide-y divide-gray-100">
				<div class="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
					<dt class="text-sm/6 font-medium text-gray-900">First name</dt>
					<dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
						{data?.firstName || 'N/A'}
					</dd>
				</div>
				<div class="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
					<dt class="text-sm/6 font-medium text-gray-900">Last name</dt>
					<dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
						{data?.lastName || 'N/A'}
					</dd>
				</div>
				<div class="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
					<dt class="text-sm/6 font-medium text-gray-900">Date of Birth</dt>
					<dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
						{data?.dateOfBirth || 'N/A'}
					</dd>
				</div>
				<div class="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
					<dt class="text-sm/6 font-medium text-gray-900">Sex</dt>
					<dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{data?.sex || 'N/A'}</dd>
				</div>
				<div class="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
					<dt class="text-sm/6 font-medium text-gray-900">Phone</dt>
					<dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
						{data?.phoneNumber || 'N/A'}
					</dd>
				</div>
				<div class="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
					<dt class="text-sm/6 font-medium text-gray-900">Email address</dt>
					<dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{data?.email || 'N/A'}</dd>
				</div>
			</dl>
		</div>
		<div class="px-4 sm:px-0">
			<p class="mt-1 max-w-2xl font-semibold text-center text-sm/6">Next of Kin Details</p>
		</div>
		<div class="mt-6 border-t border-gray-100">
			<dl class="divide-y divide-gray-100">
				<div class="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
					<dt class="text-sm/6 font-medium text-gray-900">Full name</dt>
					<dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
						{data?.nextOfKinFullName || 'N/A'}
					</dd>
				</div>
				<div class="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
					<dt class="text-sm/6 font-medium text-gray-900">Phone</dt>
					<dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
						{data?.phoneNumber || 'N/A'}
					</dd>
				</div>
				<div class="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
					<dt class="text-sm/6 font-medium text-gray-900">Email address</dt>
					<dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
						{data?.nextOfKinEmail || 'N/A'}
					</dd>
				</div>
				<div class="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
					<dt class="text-sm/6 font-medium text-gray-900">Relationship</dt>
					<dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
						{data?.nextOfKinRelationship || 'N/A'}
					</dd>
				</div>
			</dl>
		</div>
		<div class="px-4 sm:px-0">
			<p class="mt-1 max-w-2xl text-sm/6 font-semibold text-center">Institution of Study</p>
		</div>
		<div class="mt-6 border-t border-gray-100">
			<dl class="divide-y divide-gray-100">
				<div class="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
					<dt class="text-sm/6 font-medium text-gray-900">Name</dt>
					<dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
						{data?.institutionOfStudy || 'N/A'}
					</dd>
				</div>
				<div class="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
					<dt class="text-sm/6 font-medium text-gray-900">Programme of Study</dt>
					<dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
						{data?.programmeOfStudy || 'N/A'}
					</dd>
				</div>
				<div class="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
					<dt class="text-sm/6 font-medium text-gray-900">Study start date</dt>
					<dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
						{formatDate(data?.studyStartDate) || 'N/A'}
					</dd>
				</div>
				<div class="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
					<dt class="text-sm/6 font-medium text-gray-900">Expected end date</dt>
					<dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
						{formatDate(data?.expectedStudyEndDate) || 'N/A'}
					</dd>
				</div>
			</dl>
		</div>
		<div class="flex justify-end gap-4 mt-4">
			<!-- <Button otherClasses="w-1/3 p-3" type="button" label={'Skip'} /> -->

			<Button
				otherClasses="w-full p-3 bg-green-600"
				type="submit"
				label={'Complete Registration'}
			/>
		</div>
	{/if}
</div>
