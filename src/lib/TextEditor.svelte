<script lang="ts">
  import { tick, createEventDispatcher } from 'svelte';

  // Type
  import type { RecentSelection } from '../types/RecentSelection';
  import type { SelectedText } from '../types/SelectedText';
  // import type { Control } from '../lib/ControlsUI/ControlsUI';

  // Constant
  import { PLACEHOLDER } from '../helper/constants';

  // Utility
  import { uuid, getSelection, detectBrowsers } from '../helper/utilities';
  import { BROWSER } from '../helper/constants';

  // Utilities
  import { uuid } from '../helper/utilities';

  export let className: string = '';
  export let selectedText: SelectedText[] = [];
  export let isDuplicate: boolean = false;
  export let controlClicked: boolean = false;
  export let tempSelectedText: SelectedText = null;

  const dispatch = createEventDispatcher();
  const browserName = detectBrowsers();

  let editorArea: HTMLDivElement = null;
  let typedContentArea: HTMLParagraphElement = null;

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
      else replaced = `<span class="${className} ${uuid()}" data-uuid=${tempSelectedText.id}>${selection.text}</span>`;
  
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
        text: selected.text,
        start: selected.start,
        end: selected.end,
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

  $: {
    if (!!controlClicked) previewArea.innerHTML = modifyHTMLContent();
  };
  $: isSameTextSelected = isDuplicate;
</script>

<!-- <template> -->
  <div action="#" id="textEditor">
    <div id="editorWrapper">
      <div
        id="editor"
        role="textbox"
        contenteditable="true"
        bind:this={editorArea}
        on:input={onTextEditorInputted}
        on:mouseup={textSelected}
        on:keydown={onTextEditorKeyedDown}>
        <p id="textContainer" bind:this={typedContentArea}>
          <span class="placeholder-decoration" contenteditable="false"><span>{PLACEHOLDER}</span></span><br />
        </p>
      </div>
    </div>
  </div>
<!-- </template> -->

<style>
  div#textEditor {
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

  #editor {
    position: relative;
    width: 100%;
    height: 100%;
    display: block;
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
    word-wrap: break-word;
    white-space: pre-wrap;
    font-feature-settings: "liga" 0;
  }

  #editorWrapper :global(.placeholder-decoration) {
    position: relative;
    color: var(--color-primary-light);
    width: 100%;
    pointer-events: none;
    display: block;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
  }
  #editorWrapper :global(.placeholder-decoration > span) {
    position: absolute;
    pointer-events: none;
  }

  :global(.hide) {
    filter: blur(2px);
    background-color: var(--color-primary);
    color: transparent;
    pointer-events: auto;
    transition: .2s filter, .2s background-color, .2s color;
  }
  :global(.hide:hover) {
    filter: blur(0);
    background-color: initial;
    color: inherit;
  }
</style>
