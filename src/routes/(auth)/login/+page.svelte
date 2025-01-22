<script lang="ts">
	import { goto } from "$app/navigation";
	import Button from "$lib/components/button.svelte";
	import Form from "$lib/components/controls/form.svelte";
	import FormInput from "$lib/components/controls/formInput.svelte";
	import ErrorBanner from "$lib/components/ui/errorBanner.svelte";
	import { UserLogin } from "$lib/services/auth";
	import { initUser } from "$lib/stores/authStore";
  import * as yup from 'yup';

  let loading = false;
  let error = '';
  const schema = yup.object().shape({
    userName: yup.string().required().label('Username').matches(/\S/, 'Enter valid username'),
    password: yup.string().required().label('Password').matches(/\S/, 'Enter valid password'),
  })

  async function login ({detail}: any) {
    try {
      loading = true;
      const { values } = detail;
      const res = await UserLogin(values.userName, values.password);
      if (res.isSuccess) {
        const initialize = await initUser(res.data.token, res.data.user);
        if (initialize.success) {
          goto('/dashboard');
          loading = false;
        } else {
          error = initialize.message;
          loading = false;
        }
      } else {
        error = res.message;
        loading = false;
      }
    } catch (error) {
      error = error;
    }
  }
</script>

<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
       <div class="text-center flex flex-col items-center">
        <div class="text-2xl font-bold tracking-tight">
            ShelterSync
        </div>
        <div class="text-xs">Integrated Hostel Management System</div>
    </div>
      <h2 class="mt-10 text-center font-semibold tracking-tight text-gray-400">Sign in to your account</h2>
      <ErrorBanner error={error} />
    </div>

  
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <Form schema={schema} on:submit={login}>
        <div class="space-y-6">
          <div>
            <div class="mt-2">
              <FormInput label="Username" showLabel id="username" name="userName" required />
            </div>
          </div>
    
          <div>
            <div class="flex items-center justify-between">
              <div class="text-sm flex w-full justify-end">
                <a href="#" class="flex justify-end text-xs font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
              </div>
            </div>
            <div class="mt-2">
              <FormInput label="Password" id="password" showLabel name="password" type="password" required />
            </div>
          </div>
    
          <div>
          <Button disabled={loading} type="submit" otherClasses="w-full p-3" label="Sign in" hasIcon icon={loading ? "eos-icons:loading" : "heroicons:arrow-right-20-solid"} />
          </div>
        </div>
        
      </Form>
  
    </div>
  </div>
  