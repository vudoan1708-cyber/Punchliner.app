<script lang="ts">
  export let name = '';
  export let style = '';

  import type { Icon } from './types/Icon';
  import { icons } from './utils/icons';

  let icon: Icon;
  $: icon = icons.find((element: Icon) => element.name === name);
</script>

<!-- <template> -->
{#if !!icon}
  <svg class="icon" data-testid="icon" {style} viewBox={icon.viewBox}>
    {@html icon.path}
  </svg>
{/if}
<!-- </template> -->

<style>
  .icon {
    display: inline-block;
    height: 1em;
  }
</style>
