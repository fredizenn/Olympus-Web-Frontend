<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import Form from '$lib/components/controls/form.svelte';
	import FormInput from '$lib/components/controls/formInput.svelte';
	import FormSelect from '$lib/components/controls/formSelect.svelte';
	import type { IResident } from '$lib/services/residents';
	import { residentFormStep } from '$lib/stores/layoutStore';
	import { sexes } from '$lib/utils/enums';
	import { createEventDispatcher } from 'svelte';
	import * as yup from 'yup';

	export let data: IResident = {} as IResident;
	const dispatcher = createEventDispatcher();
	const schema = yup.object().shape({
		firstName: yup.string().required().label('First name'),
		lastName: yup.string().required().label('Last name'),
		emailAddress: yup.string().email().required().label('Email'),
		sex: yup.string().required().label('Sex'),
		phoneNumber: yup.string().required().label('Phone number'),
		address: yup.string().required().label('Address')
	});

	function submit({ detail }: any) {
		dispatcher('submit', detail);
		residentFormStep.set(1);
	}
</script>

<Form {schema} init={data} on:submit={submit}>
	<div class="text-sm font-semibold text-gray-400 text-center pb-6">Personal Details</div>
	<div class="md:grid grid-cols-2 gap-y-6">
		<div class="col-span-2">
			<FormInput name="firstName" required showLabel label="First Name" />
		</div>
		<div class="col-span-2">
			<FormInput name="lastName" required showLabel label="Last Name" />
		</div>
		<div class="col-span-2">
			<FormSelect options={sexes} name="sex" required showLabel label="Sex" />
		</div>
		<div class="col-span-2">
			<FormInput name="dateOfBirth" required showLabel label="Date of Birth" type="date" />
		</div>
		<div class="col-span-2">
			<FormInput name="emailAddress" required showLabel label="Email" />
		</div>
		<div class="col-span-2">
			<FormInput name="phoneNumber" required showLabel label="Phone Number" />
		</div>
		<div class="col-span-2">
			<FormInput name="address" required showLabel label="Address" />
		</div>
		
	</div>
	<div class="flex justify-end mt-6">
		<Button otherClasses="w-full p-3 bg-green-600" type="submit" label={'Save and continue'} />
	</div>
	<!-- <div class="flex justify-center w-full mt-2">
        <Button otherClasses="w-full p-2" type="submit" disabled={saving} label={saving ? 'Saving...' : 'Add Resident'} />
    </div> -->
</Form>
