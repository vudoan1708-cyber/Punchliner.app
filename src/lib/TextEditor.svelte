<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  // Type
  import type { RecentSelection } from '../types/RecentSelection';

  export let className: string = '';

  const dispatch = createEventDispatcher();

  let editorArea: HTMLTextAreaElement = null;
  let previewArea: HTMLDivElement = null;

  let recentSelection: RecentSelection = null;
  // Event Handlers
  const textSelected = () => {
    const selected = editorArea.value.substring(editorArea.selectionStart, editorArea.selectionEnd);
    recentSelection = {
      text: selected,
      start: editorArea.selectionStart,
      end: editorArea.selectionEnd,
    };
    dispatch('select', selected);
  };

  const onTextAreaChanged = () => {
    if (!!editorArea && !!previewArea) {
      previewArea.textContent = editorArea.value;
      previewArea.scrollTop = editorArea.scrollTop;
    }
  };

  const onTextAreaScrolled = (e) => {
    previewArea.scrollTop = e.target.scrollTop;
  };

  $: {
    if (!!className) {
      const replaced = `<span class="${className}">${recentSelection.text}</span>`;

      const leftMost = editorArea.value.substring(0, recentSelection.start);
      const rightMost = editorArea.value.substring(recentSelection.end, editorArea.value.length);

      previewArea.innerHTML = `${leftMost}${replaced}${rightMost}`;
    }
  }
</script>

<!-- <template> -->
  <form action="#" id="textEditor">
    <div id="editorWrapper">
      <textarea
        id="editor"
        wrap="soft"
        placeholder="Type here..."
        bind:this={editorArea}
        on:input={onTextAreaChanged}
        on:scroll={onTextAreaScrolled}
        on:mouseup={() => { textSelected(); }} />
      <div id="preview" bind:this={previewArea}></div>
    </div>
  </form>
<!-- </template> -->

<style>
  form#textEditor {
    position: relative;
    margin: 0;
    padding: 0;
    height: 600px;
  }

  #editorWrapper {
    position: relative;
    width: 100%;
    height: 100%;
    color: var(--color-primary);
    background-color: var(--color-secondary);
    overflow: visible;
    font-size: 12pt;
  }

  #editor,
  #preview {
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    color: var(--color-primary);
    background-color: var(--color-secondary);
    line-height: 120%;
    font-family: monospace, monospace;
    font-size: 100%;
    border: 0;
    overflow-y: scroll;
    overflow-x: hidden;
    outline: none;
    resize: none;
    word-wrap: break-word;
    white-space: pre-wrap;
    font-feature-settings: "liga" 0;
  }

  #preview {
    position: absolute;
    top: 2px;
    left: 2px;
    pointer-events: none;
    /* background: transparent; */
    background-color: rgba(0, 0, 0, 0.5);
    padding-bottom: 35px;
  }

  #preview::-webkit-scrollbar {
    display: none;
  }

  :global(.hide) {
    filter: blur(2px);
    background-color: var(--color-primary);
    color: transparent;
  }
  :global(.display) {
    filter: blur(0);
    background-color: var(--color-secondary);
    color: inherit;
  }
</style>
