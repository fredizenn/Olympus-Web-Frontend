
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
        nextOfKinFullName: yup.string().required().label('Full name'),
        nextOfKinPhoneNumber: yup.string().required().label('Phone number'),
        nextOfKinRelationship: yup.string().required().label('Relationship'),
        nextOfKinEmail: yup.string().required().label('Email'),
        nextOfKinAddress: yup.string().required().label('Address'),
    });

    function submit ({detail}: any) {
        dispatcher('submit', detail);
        residentFormStep.set(2);
    }
</script>

<Form {schema} init={data} on:submit={submit}>
    <div class="text-sm font-semibold text-gray-400 text-center pb-6">Next of Kin Details</div>
	<div class="md:grid grid-cols-2 gap-4">
		<FormInput name="nextOfKinFullName" required showLabel label="Full Name" />
		<FormInput name="nextOfKinPhoneNumber" required showLabel label="Phone Number" />
		<FormInput name="nextOfKinRelationship" required showLabel label="Relationship to Resident" />
		<FormInput name="nextOfKinEmail" required showLabel label="Email" />
        <div class="col-span-2">
            <FormInput name="nextOfKinAddress" required showLabel label="Address" />

        </div>
	</div>
	<div class="flex justify-end mt-4">
		<Button otherClasses="w-full p-3 bg-green-600" type="submit" label={'Save and continue'} />
	</div>
	<!-- <div class="flex justify-center w-full mt-2">
        <Button otherClasses="w-full p-2" type="submit" disabled={saving} label={saving ? 'Saving...' : 'Add Resident'} />
    </div> -->
</Form>
