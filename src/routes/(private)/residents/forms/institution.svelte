
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
    let skip = false;
	const dispatcher = createEventDispatcher();
	const schema = yup.object().shape({
		// nextOfKinFullName: yup.string().required().label('Full name'),
		// nextOfKinPhoneNumber: yup.string().required().label('Phone number'),
		// relationship: yup.string().required().label('Relationship'),
		// phoneNumber: yup.string().required().label('Phone number'),
		// email: yup.string().required().label('Email'),
		// nextOfKinAddress: yup.string().required().label('Address')
	});

	function submit({ detail }: any) { 
        // skip ? detail = { ...detail.values, institutionOfStudy: '', programmeOfStudy: '', studyStartDate: '', expectedStudyEndDate: ''} : detail;
        
		dispatcher('submit', detail);
		residentFormStep.set(3);
        // skip = false;
	}
   
</script>

<Form {schema} init={data} on:submit={submit}>
	<div class="text-xs font-semibold text-gray-400 text-center pb-6">Institution of Study</div>
	<div class="md:grid grid-cols-2 gap-4">
		<div class="col-span-2">
			<FormInput name="institutionOfStudy" showLabel label="Institution Name" />
		</div>
		<div class="col-span-2">
			<FormInput name="programmeOfStudy" showLabel label="Programme of Study" />
		</div>
		<FormInput name="studyStartDate" type="date" showLabel label="Start Date" />
		<FormInput
			name="expectedStudyEndDate"
			type="date"
			showLabel
			label="Expected End Date"
		/>
	</div>
	<div class="flex justify-end gap-4 mt-4">
        <!-- <Button otherClasses="w-1/3 p-3" type="submit" onClick={() => skip = true}  label={'Skip'} /> -->

		<Button otherClasses="w-full p-3 bg-green-600" type="submit" label={'Save and continue'} />
	</div>
	<!-- <div class="flex justify-center w-full mt-2">
        <Button otherClasses="w-full p-2" type="submit" disabled={saving} label={saving ? 'Saving...' : 'Add Resident'} />
    </div> -->
</Form>
