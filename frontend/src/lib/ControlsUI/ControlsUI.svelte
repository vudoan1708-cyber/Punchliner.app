<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import Icon from '../../components/Icon/Icon.svelte';

  // Type
  import type { Control } from './ControlsUI';
  import type { SelectedText } from '../../types/SelectedText';

  export let controls: Control[] = [];
  export let tempSelectedText: SelectedText | null = null;

  const dispatch = createEventDispatcher();

  // Event Handler
  let menuShrinking = false;
  const onIconClicked = (which: string, props: any = null) => {
    dispatch(which, props);
  };

  $: noTextSelected = !tempSelectedText;
</script>

<!-- <template> -->
<div id="controls">
  <div id="toolbar">
    {#each controls as control}
      <span
        class="icon_wrapper"
        title={control.title}
        disabled={noTextSelected && control.disabled}
        on:click={() => { onIconClicked(`${control.lookUpName}-click`); }}>
        <Icon name={control.lookUpName} style="color: var(--color-primary);" />
      </span>
    {/each}
    <div
      class="hamburger"
      title={!menuShrinking ? "Click to expand menu" : "Click to collapse menu"}
      on:click={() => {
        menuShrinking = !menuShrinking;
        onIconClicked('hamburger-click', menuShrinking);
      }}>
      <Icon name="hamburger" style="color: var(--color-primary);" />
    </div>
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

  #toolbar .icon_wrapper[disabled="true"] {
    pointer-events: none;
  }

  #toolbar .hamburger {
    margin-top: var(--margin);
    width: fit-content;
    cursor: pointer;
  }
</style>
