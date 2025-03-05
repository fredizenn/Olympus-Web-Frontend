<script lang="ts">
	import Button from '$lib/components/button.svelte';
  import Nav from '$lib/components/nav.svelte';
	import Sidebar, { type IMenu } from '$lib/components/sidebar.svelte';
	import { pageActionButtons, pageDescription } from '$lib/stores/layoutStore';
	import { Toaster } from 'svelte-french-toast';
	import '../../app.pcss';


  let menus: IMenu[] = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'hugeicons:home-06',
      iconColor: 'text-[#005C31]'
    },
    {
      label: 'Residents',
      path: '/residents',
      icon: 'hugeicons:user-group',
      iconColor: 'text-[#005C31]'
    },
    {
      label: 'Payments',
      path: '/payments',
      icon: 'hugeicons:payment-success-02',
      iconColor: 'text-[#005C31]'
    },
    {
      label: 'Allocations',
      path: '/allocations',
      icon: 'material-symbols:all-match-outline-rounded',
      iconColor: 'text-[#005C31]'
    },
    {
      label: 'Rooms',
      path: '/rooms',
      icon: 'hugeicons:meeting-room',
      iconColor: 'text-[#005C31]'
    },
    {
      label: 'Maintenance Requests',
      path: '/maintenance',
      icon: 'hugeicons:alert-02',
      iconColor: 'text-[#005C31]'
    },
    {
      label: 'Employees',
      path: '/employees',
      icon: 'hugeicons:work-update',
      iconColor: 'text-[#005C31]'
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: 'hugeicons:settings-01',
      iconColor: 'text-[#005C31]'
    }
  ]
</script>

<Toaster />
<!-- <div class="h-screen bg-slate-100 flex items-center justify-center"> -->
  <div class="flex mx-auto h-screen w-full overflow-auto rounded-lg">
    <div class="sticky top-0">
      <Sidebar {menus} />
    </div>
    <div class="flex w-full flex-col overflow-auto">
      <Nav />
      <div class="h-full p-4 overflow-auto bg-white">
        <div class="w-full flex py-2 justify-between">
          <div class="text-xs bg-white text-gray-500">{$pageDescription}</div>
          <div class="flex space-x-2">
            {#each $pageActionButtons as btn}
            <!-- <div> -->
              <Button otherClasses="px-4 py-2" label={btn.label} icon={btn.icon} onClick={btn.onClick} />
            <!-- </div> -->
             {/each}
          </div>
        </div>
        <slot />
      </div>
    </div>
  </div>
    
	
<!-- </div> -->
