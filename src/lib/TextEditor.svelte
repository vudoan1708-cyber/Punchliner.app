<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let editorArea: HTMLTextAreaElement = null;

  // Event Handler
  const textSelected = () => {
    const selected = editorArea.value.substring(editorArea.selectionStart, editorArea.selectionEnd);

    if (!!selected) dispatch('select', selected);
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
        on:mouseup={() => { textSelected(); }} />
    </div>
    <div id="preview" style="display: none;"></div>
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
    border: 0;
    overflow-y: scroll;
    overflow-x: hidden;
    outline: none;
    resize: none;
    word-wrap: break-word;
    white-space: pre-wrap;
    font-feature-settings: "liga" 0;
  }

  #editor {
    color: var(--color-primary);
    background-color: var(--color-secondary);
    line-height: 120%;
    font-family: monospace, monospace;
    font-size: 100%;
  }
</style>
