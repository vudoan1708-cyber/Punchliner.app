<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  // button type: primary or secondary
  export let type = 'primary';
  // size: normal or small
  export let size = 'normal';
  // a value for the rel attribute on the button
  export let rel = null;
  // a value for the id attribute if required
  export let id = '';
  // a value for the target attribute - used when href is specified
  export let target = '_self';
  // a value for the href - button will render as an anchor element if set
  export let href = null;
  // additional style attributes if required
  export let style = null;
  // url for an icon image
  export let icon = null;
  // title attribute - hover text
  export let title = '';
  export let disabled = false;
  export let working = false;

  const linkClick = (event) => {
    if (disabled) {
      event.preventDefault();
      return false;
    }
    dispatch('click');
  };
</script>

<!-- <template> -->
  {#if !!href}
    <a
      class="button {type} {size}"
      data-testid="link"
      class:working
      class:disabled={disabled && !working}
      {rel}
      {target}
      {href}
      {id}
      on:click|stopPropagation={linkClick}
      {style}
      {disabled}
      {title}>
      {#if !!icon}
        <img
          class="icon"
          data-testid="link-icon"
          alt="icon"
          src={icon}/>
      {/if}
      <slot/>
    </a>
  {:else}
    <button
      class="button {type} {size}"
      data-testid="button"
      class:working
      class:disabled={disabled && !working}
      {id}
      on:click|stopPropagation={() => { dispatch('click'); }}
      on:focus
      on:blur
      {style}
      {disabled}
      {title}>
      {#if !!icon}
        <img
          class="icon"
          data-testid="button-icon"
          alt="icon"
          src={icon}/>
      {/if}
      <slot/>
    </button>
  {/if}
<!-- </template> -->

<style>
.button {
  font-family: var(--type-button-font);
  font-size: var(--type-button-size);
  line-height: var(--type-button-line-height);
  font-weight: var(--type-button-weight);
  border: var(--border-width) solid var(--color-primary);
  border-radius: var(--border-radius);
  text-transform: var(--type-button-transform);
  transition: all 0.2s ease-out;
  display: inline-block;
  text-decoration: none;
  cursor: pointer;
}

/* variants */
.button.primary {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
}

.button.primary:hover {
  background-color: var(--color-primary-light);
  color: var(--color-on-primary-light);
}

.button.secondary {
  background-color: var(--color-on-primary);
  color: var(--color-primary);
}

.button.secondary:hover {
  border-color: var(--color-primary-dark);
  color: var(--color-primary-light);
}

.button.disabled,
.button.disabled:hover {
  background-color: var(--color-neutral-200);
  border-color: var(--color-neutral-500);
  color: var(--color-neutral-500);
  cursor: not-allowed;
}

/* sizes */
.button.normal {
  padding: calc(var(--padding) - var(--border-width));
  min-width: calc(var(--type-button-line-height) + ( var(--padding) * 2 ));
}

.button.small {
  padding: calc((var(--padding) / 4 ) - var(--border-width));
  min-width: calc(var(--type-button-line-height) + calc(var(--padding) / 2));
}

/* working */
.button.working,
.button.working:hover {
  cursor: wait;
  color: var(--color-on-primary-light);
  background:
    repeating-linear-gradient(
      45deg,
      var(--color-primary) 25%,
      var(--color-primary) 50%,
      var(--color-primary-light) 50%,
      var(--color-primary-light) 75%
    );
  background-size: var(--type-button-line-height) var(--type-button-line-height);
  animation: stripeBackgroundPosition 0.5s linear infinite;
}

.button.secondary.working,
.button.secondary.working:hover {
  color: var(--color-primary);
  background:
    repeating-linear-gradient(
      45deg,
      var(--color-on-primary) 25%,
      var(--color-on-primary) 50%,
      var(--color-neutral-300) 50%,
      var(--color-neutral-300) 75%
    );
  background-size: var(--type-button-line-height) var(--type-button-line-height);
}

.button.working > .icon {
  filter: none;
}

@keyframes stripeBackgroundPosition {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: calc(var(--type-button-line-height) * -1) 0;
  }
}

/* icon */
.button.normal > .icon {
  height: calc(var(--type-button-line-height) * 1.5);
  margin:
    calc(var(--type-button-line-height) * -0.25)
    calc(var(--margin) / 2)
    calc(var(--type-button-line-height) * -0.25) 0;
  vertical-align: middle;
}

.button.small > .icon {
  height: var(--type-button-line-height);
  margin: 0 calc(var(--margin) / 4) 0 0;
  vertical-align: middle;
}

.button.disabled > .icon {
  filter: grayscale(1);
}
</style>
