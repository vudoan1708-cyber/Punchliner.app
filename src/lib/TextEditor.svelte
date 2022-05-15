<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let editorArea: HTMLTextAreaElement = null;
  let previewArea: HTMLDivElement = null;

  // Event Handlers
  const textSelected = () => {
    previewArea.textContent = editorArea.value;

    const selected = editorArea.value.substring(editorArea.selectionStart, editorArea.selectionEnd);
    const replaced = `<span class="selected">${selected}</span>`;

    previewArea.innerHTML = previewArea.textContent.replace(selected, replaced);
    if (!!selected) dispatch('select', selected);
  };

  const onTextAreaChanged = () => {
    if (!!editorArea && !!previewArea) {
      previewArea.scrollTop = previewArea.scrollHeight;
    }
  };
</script>

<!-- <template> -->
  <form action="#" id="textEditor">
    <div id="editorWrapper">
      <textarea
        id="editor"
        wrap="soft"
        placeholder="Type here..."
        bind:this={editorArea}
        on:change={onTextAreaChanged}
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
    background: transparent;
  }

  ::-webkit-scrollbar(#preview) {
    width: 0;
  }

  :global(.selected) {
    color: white;
  }
</style>
