<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import Icon from '../../components/Icon/Icon.svelte';

  // Type
  import type { Control } from './ControlsUI';

  export let controls: Control[] = [];

  const dispatch = createEventDispatcher();

  // Event Handler
  const onIconClicked = (which) => {
    dispatch(which);
  };
</script>

<!-- <template> -->
<div id="controls">
  <div id="toolbar">
    {#each controls as control}
      <span class="icon_wrapper" title={control.title} on:click={() => { onIconClicked(`${control.lookUpName}-click`); }}>
        <Icon name={control.lookUpName} style="color: var(--color-primary);" />
      </span>
    {/each}
  </div>
</div>
<!-- </template> -->

<style>
  #controls {
    position: relative;
    width: 100%;
    margin-top: var(--margin);
  }

  #toolbar {
    opacity: 0.5;
    transition: .5s opacity;
  }
  #toolbar:hover {
    opacity: 1;
  }

  #toolbar .icon_wrapper {
    margin-right: var(--margin);
    cursor: pointer;
  }
</style>
