<script>
  /* eslint-disable no-nested-ternary */
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let toggleState;
  export let disabled = false;
  export let nativeRendering = false;
  export let isVerticalNotHorizontal = false;
  export let style = null;
  export let id = 'toggle';
  export let size = 'normal';
  export let labelDisplayed = true;
  export let labels = [ 'yes', 'no' ];

  // Display Label
  let label;
  // DOM Ref
  let checkboxRef;

  // Once the toggle is changed, emits the change to the parent component with the boolean value
  const handleToggle = () => {
    if (!disabled) {
      dispatch('change', toggleState);
    }
  };

  $: label = toggleState === true
    ? labels[0]
    : toggleState === false
    ? labels[1]
    : '';

  $: {
    if (checkboxRef) {
      if (toggleState === undefined || toggleState === null) {
        checkboxRef.indeterminate = true;
      } else {
        checkboxRef.indeterminate = false;
      }
    }
  }
</script>

<!-- <template> -->
<section
  class="toggleBtn
    { size }
    { nativeRendering ? 'nativeRendering' : 'non-nativeRendering' }
    { isVerticalNotHorizontal ? 'verticalDisplayed' : 'horizontalDisplayed' }"
  { style }
  data-testid="toggle-button"
>
  <label class="switch { nativeRendering ? 'nativeRendering' : 'non-nativeRendering' }" >
    <input
      type="checkbox"
      for="toggle"
      class={ nativeRendering ? 'nativeRendering' : 'non-nativeRendering' }
      style="margin: 0;"
      {id}
      {disabled}
      bind:this={checkboxRef}
      bind:checked={toggleState}
      on:change={handleToggle}
      data-testid="native-checkbox-field"
    />
    {#if !nativeRendering}
      <span
        class="slider
          { disabled ? 'toggleDisabled' : 'toggleNotDisabled' }
          { isVerticalNotHorizontal ? 'verticalDisplayed' : 'horizontalDisplayed' }
          { nativeRendering ? 'nativeRendering' : 'non-nativeRendering' }
          { size }"
        data-testid="slider-toggle">
      </span>
    {/if}

    {#if labelDisplayed && (toggleState !== undefined || null)}
      <aside
        class="{ toggleState === true
          ? 'onLabel'
          : toggleState === false
          ? 'offLabel'
          : 'unsetLabel' }
          { nativeRendering ? 'nativeLabel' : 'non-nativeLabel'}
          { isVerticalNotHorizontal ? 'verticalDisplayed' : 'horizontalDisplayed' }"
        data-testid="label-content"
      >

        {#if isVerticalNotHorizontal && !nativeRendering}
          <!-- Inactive -->
          <section class="topLabel">{ labels[1] }</section>
          <!-- Active -->
          <section class="bottomLabel">{ labels[0] }</section>
        {:else}
          { label }
        {/if}
      </aside>
    {/if}
  </label>
</section>
<!-- </template> -->

<style>
  .toggleBtn {
    position: relative;
    width: fit-content;
    height: auto;
    display: flex;
    overflow: hidden;
  }

  .toggleBtn .switch {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0;
  }

  .toggleBtn .switch.non-nativeRendering {
    display: flex;
  }

  /* Text Size */
  .toggleBtn .switch aside {
    font-size: calc(var(--padding) * 1.5);
  }

  /* Dynamic colour changes based on the toggle's state in vertical display */
  .toggleBtn .switch aside.onLabel.verticalDisplayed .topLabel {
    color: var(--color-neutral-500);
  }

  .toggleBtn .switch aside.offLabel.verticalDisplayed .bottomLabel {
    color: var(--color-neutral-500);
  }

  /* Toggle Label */
  .toggleBtn .switch > aside {
    position: relative;
    text-transform: var(--type-button-transform);
    font-family: var(--type-button-font);
    font-size: var(--type-button-size);
    color: var(--color-foreground);
    font-weight: var(--type-button-weight);
    margin-left: var(--margin);
    z-index: 100;
    white-space: nowrap;
  }

  /* Render Toggle button with styles */
  .toggleBtn .switch input.non-nativeRendering {
    opacity: 0;
    width: 0;
    height: 0;
    display: none;
  }

  /* Render Toggle button without styles */
  .toggleBtn .switch input.nativeRendering {
    opacity: 1;
  }

  /* Slider rendered horizontally */
  .slider {
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: calc(var(--border-radius) * 6);
    border: 1px solid var(--color-neutral-600);
    background-color: var(--color-neutral-300);
    transition: .4s;
  }

  /* Text position based on the toggle size */
  .slider.normal + aside.verticalDisplayed .topLabel {
    transform: translateY(-50%);
  }
  .slider.normal + aside.verticalDisplayed .bottomLabel {
    transform: translateY(50%);
  }

  /* Toggle Sizes depending on the display state */
  .slider.non-nativeRendering.normal.horizontalDisplayed {
    width: calc( var( --type-button-line-height) + (6 * (var(--padding)) ) );
    height: calc( var( --type-button-line-height) + (2 * (var(--padding)) ) );
  }

  .slider.non-nativeRendering.small.horizontalDisplayed {
    width: calc( var( --type-button-line-height) + (2 * (var(--padding)) ) );
    height: calc( var(--type-button-line-height) );
  }

  .slider.non-nativeRendering.normal.verticalDisplayed {
    width: calc( var( --type-button-line-height) + (2 * (var(--padding)) ) );
    height: calc( var( --type-button-line-height) + (6 * (var(--padding)) ) );
  }

  .slider.non-nativeRendering.small.verticalDisplayed {
    width: calc( var(--type-button-line-height) );
    height: calc( var( --type-button-line-height) + (2 * (var(--padding)) ) );
  }

  .slider.toggleNotDisabled {
    cursor: pointer;
  }

  .toggleBtn:hover .slider.toggleNotDisabled.slider:before {
    background-color: var(--color-primary-light);
  }

  /* White / Blue Thumb */
  .slider:before {
    position: absolute;
    content: "";
    height: 75%;
    left: 1px;
    top: 50%;
    transform: translateY(-50%);
    border-radius: calc(var(--border-radius) * 6);
    border: 3px solid var(--color-border);
    background-color: var(--color-on-primary);
    transition: .4s;
  }

  .slider.verticalDisplayed.slider:before {
    width: 75%;
    left: 50%;
    top: 1px;
    transform: translate(-50%, 0%);
  }

  /* Sizes depending on the display state */
  .slider.normal.horizontalDisplayed.slider:before {
    width: calc( var( --type-button-line-height) + var(--padding) );
  }

  .slider.small.horizontalDisplayed.slider:before {
    width: var(--padding);
    height: 50%;
  }

  .slider.normal.verticalDisplayed.slider:before {
    height: calc( var( --type-button-line-height) + var(--padding) );
  }

  .slider.small.verticalDisplayed.slider:before {
    width: 50%;
    height: var(--padding);
  }

  /* Change the slider thumb from white to blue */
  input:checked + .slider:before {
    border: 3px solid var(--color-on-primary);
    background-color: var(--color-primary);
  }

  /* slider movement restriction be based on the size of itself */
  input:checked + .slider.normal.horizontalDisplayed.slider:before {
    transform: translate( calc( var(--type-button-line-height) + (2 * (var(--padding))) ), -50%);
  }

  input:checked + .slider.small.horizontalDisplayed.slider:before {
    transform: translate( calc( var(--type-button-line-height) ), -50%);
  }

  input:checked + .slider.normal.verticalDisplayed.slider:before {
    transform: translate( -50%,  calc( var(--type-button-line-height) + (2 * (var(--padding))) ) );
  }

  input:checked + .slider.small.verticalDisplayed.slider:before {
    -webkit-transform: translate( -50%,  calc( var(--type-button-line-height) ) );
    -ms-transform: translate( -50%,  calc( var(--type-button-line-height) ) );
    transform: translate( -50%,  calc( var(--type-button-line-height) ) );
  }

  /* Disabled state */
  input:disabled + .slider.slider:before {
    background-color: var(--color-neutral-300);
    border-color: var(--color-neutral-500);
    color: var(--color-neutral-500);
    cursor: not-allowed;
  }

  input:checked + .slider {
    background-color: var(--color-primary);
  }

  input:focus + .slider {
    box-shadow: 0 0 calc(var(--padding)/2) var(--color-foreground);
    outline-style: none;
  }

  input:indeterminate + .slider.normal.horizontalDisplayed.slider:before {
    background-color: var(--color-neutral-300);
    transform: translate( calc( var(--type-button-line-height) ), -50%);
  }

  input:indeterminate + .slider.small.horizontalDisplayed.slider:before {
    background-color: var(--color-neutral-300);
    transform: translate( var(--padding), -50% );
  }

  input:indeterminate + .slider.normal.verticalDisplayed.slider:before {
    background-color: var(--color-neutral-300);
    transform: translate( -50%, calc( var(--type-button-line-height) ) );
  }

  input:indeterminate + .slider.small.verticalDisplayed.slider:before {
    background-color: var(--color-neutral-300);
    transform: translate( -50%, var(--padding) );
  }
</style>
