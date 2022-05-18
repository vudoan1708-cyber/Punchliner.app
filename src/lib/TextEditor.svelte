<script lang="ts">
  import { tick, createEventDispatcher } from 'svelte';

  // Type
  import type { RecentSelection } from '../types/RecentSelection';
  import type { SelectedText } from '../types/SelectedText';
  // import type { Control } from '../lib/ControlsUI/ControlsUI';

  // Utilities
  import { uuid } from '../helper/utilities';

  export let className: string = '';
  export let selectedText: SelectedText[] = [];
  export let isDuplicate: boolean = false;
  export let controlClicked: boolean = false;
  export let tempSelectedText: SelectedText = null;

  const dispatch = createEventDispatcher();

  let editorArea: HTMLTextAreaElement = null;
  let previewArea: HTMLDivElement = null;

  let recentSelection: RecentSelection = null;

  const strippedString = (uuid: string): string => {
    let str = previewArea.querySelector(`[data-uuid="${uuid}"]`).innerHTML;
    if ((str === null) || (str === '')) return '';
    str = str.toString();
          
    // Regular expression to identify HTML tags in 
    // the input string. Replacing the identified 
    // HTML tag with a null string.
    return str.replace( /(<([^>]+)>)/ig, '');
  };

  const modifyHTMLContent = (): string => {
    let wholeContent: string = '';

    for (let i = 0; i < selectedText.length; i += 1) {
      const selection: RecentSelection = selectedText[i];
      const nextSelectionPosition: number = !!selectedText[i + 1] ? selectedText[i + 1].start : editorArea.value.length;

      let replaced: string = '';
      if (!!isSameTextSelected) replaced = strippedString(tempSelectedText.id);
      else replaced = `<span class="${className}" id="${uuid()}" data-uuid=${tempSelectedText.id}>${selection.text}</span>`;
  
      const leftMost = i === 0 ? editorArea.value.substring(i, selection.start) : '';
      const rightMost = editorArea.value.substring(selection.end, nextSelectionPosition);
      wholeContent += `${leftMost}${replaced}${rightMost}`;
    }
    tempSelectedText = null;

    return wholeContent;
  };

  // Event Handlers
  const textSelected = () => {
    controlClicked = false;
    const selected = editorArea.value.substring(editorArea.selectionStart, editorArea.selectionEnd);

    if (!!selected) {
      recentSelection = {
        text: selected,
        start: editorArea.selectionStart,
        end: editorArea.selectionEnd,
      };
      dispatch('select', recentSelection);
    }
  };

  const onTextAreaChanged = () => {
    if (!!editorArea && !!previewArea) {
      previewArea.innerHTML = !!recentSelection
        ? previewArea.innerHTML + editorArea.value.substring(previewArea.textContent.length, editorArea.value.length)
        : editorArea.value;
      previewArea.scrollTop = editorArea.scrollTop;
    }
  };

  const onTextAreaScrolled = (e) => {
    previewArea.scrollTop = e.target.scrollTop;
  };

  const onTextAreaKeyboardEvent = (e) => {
    if ((e.keyCode === 66 || e.code === 'KeyB') && !!e.ctrlKey) {
      dispatch('ctrlB');
    }
  };

  $: {
    if (!!controlClicked) previewArea.innerHTML = modifyHTMLContent();
  };
  $: isSameTextSelected = isDuplicate;
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
        on:mouseup={textSelected}
        on:keyup={onTextAreaKeyboardEvent} />
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
    pointer-events: auto;
    cursor: pointer;
    transition: .2s filter, .2s background-color, .2s color;
  }
  :global(.hide:hover) {
    filter: blur(0);
    background-color: initial;
    color: inherit;
  }
</style>
