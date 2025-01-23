<script lang="ts">
	import { residentFormStep } from "$lib/stores/layoutStore";
	import Icon from "@iconify/svelte";
    import { fly } from "svelte/transition";
    export let title = "Panel title";  // Title of the slide-over panel
    export let show = false;           // Control visibility from parent component
    export let onClose: any; 
    export let icon: string = ''               // Function to close the slide-over panel
  
    // Close the panel when clicking outside
    function closePanel() {
      if (onClose) onClose();
      residentFormStep.set(0);
    }
  </script>
  
  {#if show}
    <div class="relative z-40" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <!-- Background backdrop -->
      <button type="button" class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" on:click={closePanel} aria-label="Close panel" on:keydown={(e) => e.key === 'Enter' && closePanel()}></button>
  
      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <!-- Slide-over panel -->
            <div class="pointer-events-auto w-screen max-w-md" transition:fly="{{ x: 500, duration: 500 }}">
                <div class="flex h-full flex-col overflow-y-auto bg-white py-6 shadow-xl">
                <div class="px-4 sm:px-6">
                  <div class="flex items-start justify-between">
                    <h2 class="text-base flex items-center font-semibold leading-6 text-gray-900" id="slide-over-title">{title}<Icon icon={icon} class="ml-1 w-5 h-5" /></h2>
                    <div class="ml-3 flex h-7 items-center">
                      <button type="button" on:click={closePanel} class="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        <span class="absolute -inset-2.5"></span>
                        <span class="sr-only">Close panel</span>
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="relative mt-6 overflow-auto flex-1 px-4 sm:px-6">
                  <slot></slot> <!-- Slot for custom content -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
  