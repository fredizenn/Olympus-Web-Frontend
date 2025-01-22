<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import Form from '$lib/components/controls/form.svelte';
	import FormInput from '$lib/components/controls/formInput.svelte';
	import FormSelect from '$lib/components/controls/formSelect.svelte';
	import { residentFormStep } from '$lib/stores/layoutStore';
	import { sexes } from '$lib/utils/enums';
	import { createEventDispatcher } from 'svelte';
    import * as yup from 'yup';

    const dispatcher = createEventDispatcher();
    const schema = yup.object().shape({
        firstName: yup.string().required().label('First name'),
        lastName: yup.string().required().label('Last name'),
        email: yup.string().email().required().label('Email'),
        sex: yup.string().required().label('Sex'),
        phoneNumber: yup.string().required().label('Phone number'),
        address: yup.string().required().label('Address'),
    });

    function submit ({detail}: any) {
        dispatcher('submit', detail);
        residentFormStep.set(1);
    }
</script>

<Form {schema} on:submit={submit}>
    <div class="text-xs font-semibold text-gray-400 text-center pb-6">Personal Details</div>
	<div class="md:grid grid-cols-2 gap-4">
		<FormInput name="firstName" required showLabel label="First Name" />
		<FormInput name="lastName" required showLabel label="Last Name" />
        <div class="h-full">
			<FormSelect options={sexes} name="sex" required showLabel label="Sex" />
		</div>
		<FormInput name="email" required showLabel label="Email" />
		<FormInput name="phoneNumber" required showLabel label="Phone Number" />
		<FormInput name="address" required showLabel label="Address" />	
	</div>
	<div class="flex justify-end mt-4">
		<Button otherClasses="w-full p-3" type="submit" label={'Next'} />
	</div>
	<!-- <div class="flex justify-center w-full mt-2">
        <Button otherClasses="w-full p-2" type="submit" disabled={saving} label={saving ? 'Saving...' : 'Add Resident'} />
    </div> -->
</Form>
