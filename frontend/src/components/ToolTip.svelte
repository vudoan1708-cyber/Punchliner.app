<script lang="ts">
  import { afterUpdate } from 'svelte';
  import tippy from 'tippy.js';

  import type { MultipleTargets, Props } from 'tippy.js/index';

  export let text: string = '';
  export let title: boolean = false;
  export let options: Partial<Props> = { content: text  };

  let toolTipRef: HTMLSpanElement | void = null;
  let tippyInstance = null;

  const init = (node) => {
    tippyInstance = tippy(node.parentNode as MultipleTargets, { content: node.innerHTML, ...options });
    return {
      destroy() {
        tippyInstance.destroy();
      },
    };
  };

  // Life Cycles
  afterUpdate(() => {
    if (!toolTipRef) return;
    tippyInstance.setContent(toolTipRef.innerHTML);
  });
</script>

<!-- <template> -->
  <span
    class="tooltip"
    bind:this={toolTipRef}
    use:init>
    {#if !!title}
      <div class="title" data-testid="title">{@html title}</div>
    {/if}
    {@html text}
  </span>
<!-- </template> -->

<style>
  .tooltip {
    display: none;
    text-align: left;
  }

  .title {
    margin: 0 0 calc(var(--margin) / 2);
    white-space: nowrap;
    font-weight: 700;
    border-bottom: var(--border-width) solid var(--color-border);
    text-align: left;
  }

  /* tippy.js styles */
  :global(.tippy-box[data-animation="fade"][data-state="hidden"]) {
    opacity: 0;
  }

  :global(.tippy-box) {
    position: relative;
    background-color: var(--color-on-primary);
    color: var(--color-primary);
    border-radius: var(--border-radius);
    font-size: var(--type-body-size);
    line-height: var(--type-body-line-height);
    border: 1px solid var(--color-primary-light);
    outline: 0;
    transition-property: transform, visibility, opacity;
  }

  :global(.tippy-box[data-placement^="top"]>.tippy-arrow) {
    bottom: 0;
  }

  :global(.tippy-box[data-placement^="top"]>.tippy-arrow:before) {
    bottom: -7px;
    left: 0;
    border-width: 8px 8px 0;
    border-top-color: initial;
    transform-origin: center top;
  }

  :global(.tippy-box[data-placement^="bottom"]>.tippy-arrow) {
    top: 0;
  }

  :global(.tippy-box[data-placement^="bottom"]>.tippy-arrow:before) {
    top: -7px;
    left: 0;
    border-width: 0 8px 8px;
    border-bottom-color: initial;
    transform-origin: center bottom;
  }

  :global(.tippy-box[data-placement^="left"]>.tippy-arrow) {
    right: 0;
  }

  :global(.tippy-box[data-placement^="left"]>.tippy-arrow:before) {
    border-width: 8px 0 8px 8px;
    border-left-color: initial;
    right: -7px;
    transform-origin: center left;
  }

  :global(.tippy-box[data-placement^="right"]>.tippy-arrow) {
    left: 0;
  }

  :global(.tippy-box[data-placement^="right"]>.tippy-arrow:before) {
    left: -7px;
    border-width: 8px 8px 8px 0;
    border-right-color: initial;
    transform-origin: center right;
  }

  :global(.tippy-box[data-inertia][data-state="visible"]) {
    transition-timing-function: cubic-bezier(.54, 1.5, .38, 1.11);
  }

  :global(.tippy-arrow) {
    width: 16px;
    height: 16px;
    border-color: inherit;
    color: var(--color-panel-background);
  }

  :global(.tippy-arrow:before) {
    content: "";
    position: absolute;
    border-color: transparent;
    border-style: solid;
  }

  :global(.tippy-content) {
    position: relative;
    padding: 5px 9px;
    z-index: 1;
  }

  /* border */
  :global(.tippy-box[data-placement^="top"]>.tippy-arrow:after) {
    border-top-color: inherit;
    border-width: 8px 8px 0;
    bottom: -8px;
    left: 0;
  }

  :global(.tippy-box[data-placement^="bottom"]>.tippy-arrow:after) {
    border-bottom-color: inherit;
    border-width: 0 8px 8px;
    top: -8px;
    left: 0;
  }

  :global(.tippy-box[data-placement^="left"]>.tippy-arrow:after) {
    border-left-color: inherit;
    border-width: 8px 0 8px 8px;
    right: -8px;
    top: 0;
  }

  :global(.tippy-box[data-placement^="right"]>.tippy-arrow:after) {
    border-width: 8px 8px 8px 0;
    left: -8px;
    top: 0;
    border-right-color: inherit;
  }

  :global(.tippy-box[data-placement^="top"]>.tippy-svg-arrow>svg:first-child:not(:last-child)) {
    top: 17px;
  }

  :global(.tippy-box[data-placement^="bottom"]>.tippy-svg-arrow>svg:first-child:not(:last-child)) {
    bottom: 17px;
  }

  :global(.tippy-box[data-placement^="left"]>.tippy-svg-arrow>svg:first-child:not(:last-child)) {
    left: 12px;
  }

  :global(.tippy-box[data-placement^="right"]>.tippy-svg-arrow>svg:first-child:not(:last-child)) {
    right: 12px;
  }

  :global(.tippy-arrow:after) {
    content: "";
    z-index: -1;
    position: absolute;
    border-color: transparent;
    border-style: solid;
  }
</style>
