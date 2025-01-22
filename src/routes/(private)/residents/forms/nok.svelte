<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import Form from '$lib/components/controls/form.svelte';
	import FormInput from '$lib/components/controls/formInput.svelte';
	import FormSelect from '$lib/components/controls/formSelect.svelte';
	import { sexes } from '$lib/utils/enums';
	import { createEventDispatcher } from 'svelte';
    import * as yup from 'yup';

    const dispatcher = createEventDispatcher();
    const schema = yup.object().shape({
        nextOfKinFullName: yup.string().required().label('Full name'),
        nextOfKinPhoneNumber: yup.string().required().label('Phone number'),
        relationship: yup.string().required().label('Relationship'),
        phoneNumber: yup.string().required().label('Phone number'),
        email: yup.string().required().label('Email'),
        nextOfKinAddress: yup.string().required().label('Address'),
    });

    function submit ({detail}: any) {
        dispatcher('submit', detail);
    }
</script>

<Form {schema} on:submit={submit}>
    <div class="text-xs font-semibold text-gray-400 text-center pb-6">Next of Kin Details</div>
	<div class="md:grid grid-cols-2 gap-4">
		<FormInput name="nextOfKinFullName" required showLabel label="First Name" />
		<FormInput name="nextOfKinPhoneNumber" required showLabel label="Phone Number" />
		<FormInput name="relationship" required showLabel label="Relationship to Resident" />
		<FormInput name="email" required showLabel label="Email" />
        <div class="col-span-2">
            <FormInput name="nextOfKinAddress" required showLabel label="Address" />

        </div>
	</div>
	<div class="flex justify-end mt-4">
		<Button otherClasses="w-full p-3" type="submit" label={'Next'} />
	</div>
	<!-- <div class="flex justify-center w-full mt-2">
        <Button otherClasses="w-full p-2" type="submit" disabled={saving} label={saving ? 'Saving...' : 'Add Resident'} />
    </div> -->
</Form>
