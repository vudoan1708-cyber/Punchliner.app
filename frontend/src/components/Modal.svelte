<script lang="ts">
  /* eslint-disable camelcase */

  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import { scale, fade } from 'svelte/transition';
  import { sineInOut } from 'svelte/easing';

  const dispatch = createEventDispatcher();
  const close = () => dispatch('close');
  export let title: string = 'Modal Dialog';
  export let size: string = 'small';
  export let style: string = null;
  export let backgroundClose: boolean = false;
  export let hasScroller: boolean = true;
  export let hideClose: boolean = false;

  const small = size === 'small';
  const medium = size === 'medium';
  const large = size === 'large';

  let modal; let container;

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      close();
      return;
    }
  };

  const previously_focused = typeof document !== 'undefined' && document.activeElement;

  onMount(() => {
    document.body.appendChild(container);
  });

  onDestroy(() => {
    if (previously_focused) {
      // @ts-ignore
      previously_focused.focus();
    }
  });
</script>

<!-- <template> -->
  <svelte:window on:keydown={handleKeyDown} />

  <div
    class="modal-background"
    data-testid="modal-background"
    on:click|self={() => { if (!!backgroundClose) close(); }}
    bind:this={container}
    transition:fade={{ duration: 50 }}>
    <div
      class="modal"
      data-testid="modal-content"
      class:small
      class:medium
      class:large
      class:noScroller={!hasScroller}
      {style}
      role="dialog"
      aria-modal="true"
      bind:this={modal}
      transition:scale={{
        duration: 150, opacity: 0.5, start: 0.8, easing: sineInOut,
      }}>
      <div class="header">
        <!-- eslint-disable-next-line @ota-meshi/svelte/no-at-html-tags -->
        <h2 data-testid="title">{ @html title }</h2>
        {#if !hideClose}
          <button data-testid="close-button" on:click|stopPropagation={close} class="close">
            x
          </button>
        {/if}
      </div>
      <div class="modal-body">
        <slot />
      </div>
    </div>
  </div>
<!-- </template> -->

<style>
  .modal-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    background: rgba(0, 0, 0, .85);;
    z-index: 1000;
    display: grid;
    place-items: center;
  }

  .modal {
    width: calc(100vw - 8em);
    max-height: calc(100vh - 8em);
    overflow: auto;
    padding: var(--grid-unit);
    border-radius: var(--border-radius);
    background: var(--color-neutral-900);
    box-shadow: 0 2px 8px rgba(0, 0, 0, .75);
    border: var(--border-width) solid var(--color-primary-light);
    text-align: left;
    z-index: 1001;
    display: flex;
    flex-direction: column;
    max-width: 32em;
    min-height: 16em;
  }

  :global(.modal.noScroller) {
    overflow: visible;
  }

  @supports not (display: grid) {
    .modal

    .modal-body

    :global(.modal.noScroller) {
      overflow: visible;
    }
  }

  .modal.small {
    max-width: 32em;
    min-height: 16em;
  }

  .modal.medium {
    max-width: 64em;
    min-height: 32em;
  }

  .modal.large {
    max-width: unset;
    min-height: calc(100vh - 8em);
  }

  .modal > .header {
    display: flex;
    flex-wrap: nowrap;
    align-items: flex-start;
    justify-content: space-between;
    border-bottom: 1px solid var(--color-border);
    margin-bottom: var(--grid-unit);
  }

  :global(.modal .icon) {
    vertical-align: middle;
  }

  .modal .close {
    margin: var(--grid-unit) 0 0 var(--grid-unit);
    padding: 0 calc(var(--grid-unit) / 4);
    width: calc(var(--grid-unit) * 2);
    height: calc(var(--grid-unit) * 2);
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--color-primary-light);
    cursor: pointer;
  }

  .modal .close:hover {
    background-color: var(--color-primary);
  }

  :global(.modal>.header > h2) {
    flex-basis: 80%;
    flex-grow: 1;
    margin: calc(var(--grid-unit) / 2) 0;
  }
</style>
