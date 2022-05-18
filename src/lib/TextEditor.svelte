<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  // Type
  import type { RecentSelection } from '../types/RecentSelection';
  import type { SelectedText } from '../types/SelectedText';

  export let className: string = '';
  export let selectedText: SelectedText[] = [];
  export let tempSelectedText: SelectedText = null;
  export let controlClicked: boolean = false;

  const dispatch = createEventDispatcher();

  let editorArea: HTMLTextAreaElement = null;
  let previewArea: HTMLDivElement = null;

  let recentSelection: RecentSelection = null;

  const appendClickEvent = () => {
    const newlyCreatedElements = document.querySelectorAll('.hide');

    if (!!newlyCreatedElements) {
      Array.from(newlyCreatedElements).forEach((element, idx) => {
        element.addEventListener('click', () => {
          controlClicked = false;
          dispatch('text-click', selectedText[idx]);
        });
      });
    }
  };

  const strippedString = (uuid: string): string => {
    let str = previewArea.querySelector(`[data-uuid="${uuid}"]`)?.innerHTML;
    if (!str) return '';
    str = str.toString();
          
    // Regular expression to identify HTML tags in 
    // the input string. Replacing the identified 
    // HTML tag with a null string.
    return str.replace( /(<([^>]+)>)/ig, '');
  };

  const modifyHTMLContent = (numOfAddedCharacters: number): string => {
    let wholeContent: string = '';

    let strippedStringAtIndx: number = -1;
    for (let i = 0; i < selectedText.length; i += 1) {
      const selection: SelectedText = selectedText[i];
      const curSelectionPosition: number = i === 0 ? 0 : selection.start;
      const nextSelectionPosition: number = !!selectedText[i + 1] ? selectedText[i + 1].start : editorArea.value.length;
  
      let replaced: string = '';
      if (!!selection.wasHidden) {
        replaced = strippedString(selection.id);
        strippedStringAtIndx = i;
      }
      else replaced = `<span class="${className}" id="${selection.id}" data-uuid=${selection.id}>${selection.text}</span>`;
      if (editorArea.selectionStart <= selection.start) {
        selection.start += numOfAddedCharacters;
        selection.end += numOfAddedCharacters;
      }
      // This either stays at one place, or one character before the newly added start position
      const leftMost: string = editorArea.value.substring(curSelectionPosition, selection.start);
      const rightMost: string = editorArea.value.substring(selection.end, nextSelectionPosition);
      wholeContent += `${leftMost}${replaced}${rightMost}`;
    }
    tempSelectedText = null;
    if (strippedStringAtIndx > -1) dispatch('tag-strip', strippedStringAtIndx);

    return wholeContent;
  };

  const characterCounts = (num: number): number => {
    if (pasted) return pasted.length;
    return num;
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

  let isWritting: boolean = false;
  const onTextAreaChanged = (e) => {
    if (!isWritting) isWritting = true;
    if (!!editorArea && !!previewArea) {
      previewArea.innerHTML = (!!recentSelection && selectedText.length > 0)
        ? modifyHTMLContent(characterCounts(!!e.data ? e.data.length : 1))
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

  const onTextAreaMouseMoved = () => {
    if (!!isWritting) {
      isWritting = false;
      appendClickEvent();
    }
  };

  let pasted: string = null;
  const onTextAreaPasted = (e) => {
    // @ts-ignore
    pasted = (e.clipboardData || window.clipboardData).getData('text');
  };

  $: {
    if (!!controlClicked) {
      previewArea.innerHTML = modifyHTMLContent(0);
      appendClickEvent();
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
        on:input={onTextAreaChanged}
        on:scroll={onTextAreaScrolled}
        on:click={textSelected}
        on:keyup={onTextAreaKeyboardEvent}
        on:mousemove={onTextAreaMouseMoved}
        on:paste={onTextAreaPasted} />
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

  #editor {
    color: transparent;
    caret-color: var(--color-primary);
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
