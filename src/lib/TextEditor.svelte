<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';

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

  const strippedString = (uuid: string): string => {
    const element = previewArea.querySelector(`[data-uuid="${uuid}"]`);
    if (!element) return '';

    let str = element.innerHTML;
    if (!str || str.length === 1) {
      element.remove();
      return '';
    }
    str = str.toString();
          
    // Regular expression to identify HTML tags in 
    // the input string. Replacing the identified 
    // HTML tag with a null string.
    return str.replace( /(<([^>]+)>)/ig, '');
  };

  const removeClickEvent = (uuid: string): string => {
    const hiddenElement: Element = previewArea.querySelector(`[data-uuid="${uuid}"]`);
    let strippedValue: string = '';
    if (!!hiddenElement) {
      hiddenElement.removeEventListener('click', () => { console.warn('REMOVED') });
      strippedValue = strippedString(uuid);
    }

    return strippedValue;
  }

  const appendClickEvent = () => {
    const newlyCreatedElements: NodeListOf<Element> = document.querySelectorAll('.hide');

    if (!!newlyCreatedElements) {
      Array.from(newlyCreatedElements).forEach((element, idx) => {
        element.addEventListener('click', () => {
          controlClicked = false;
          dispatch('text-click', selectedText[idx]);
        });
      });
    }
  };

  const modifySelectedStringOnTextDeletion = (
    editorActualCaretPosition: number,
    selection: SelectedText,
    eventType: string,
  ) => {
    let value: string = '';
    /* Check for delete event type to slice the selected text
      only if the caret position is right where the selected text starting position is */
    // Delete Key is pressed
    const offsetBeforeDeletion = 1;
    if (editorActualCaretPosition === selection.start + offsetBeforeDeletion) {
      if (eventType === 'deleteContentForward') {
        value = selection.text.substring(0 + offsetBeforeDeletion, selection.text.length);
        return value;
      }
    }
    if (editorActualCaretPosition === selection.end) {
      if (eventType === 'deleteContentBackward') {
        value = selection.text.substring(0, selection.text.length - offsetBeforeDeletion);
        return value;
      }
    }

    return selection.text;
  };

  const modifyHTMLContent = (numOfModifiedCharacters: number, eventType: string = ''): string => {
    let wholeContent: string = '';

    let strippedStringAtIndx: number = -1;
    for (let i = 0; i < selectedText.length; i += 1) {
      const selection: SelectedText = selectedText[i];
      const prevSelectionUpdatedEndPosition: number = !!selectedText[i - 1] ? selectedText[i - 1].end : 0;
      const curSelectionStartPosition: number = i === 0 ? 0 : selection.start;
      const nextSelectionStartPosition: number = !!selectedText[i + 1]
        ? selectedText[i + 1].start
        : editorArea.value.length;

      const editorActualCaretPosition = editorArea.selectionStart - (!!pasted ? pasted.length : numOfModifiedCharacters);

      // Update start and end position of each selection
      if (editorActualCaretPosition <= selection.start) {
        selection.start += numOfModifiedCharacters;
        selection.end += numOfModifiedCharacters;
      }

      selection.text = modifySelectedStringOnTextDeletion(
        editorActualCaretPosition, selection, eventType,
      );

      // The replaced part (stripped HTML or added HTML tag string)
      let replaced: string = '';
      if (!!selection.wasHidden) {
        replaced = removeClickEvent(selection.id);
        strippedStringAtIndx = i;
      }
      else if (!selection.text) {
        replaced = ' ';
        strippedStringAtIndx = i;
      }
      else replaced = `<span class="${className}" id="${selection.id}" data-uuid=${selection.id}>${selection.text}</span>`;

      // This either stays at one place, or is pushed however many more characters added to the start position
      const leftMost: string = editorArea.value.substring(curSelectionStartPosition >= prevSelectionUpdatedEndPosition
        ? curSelectionStartPosition
        : prevSelectionUpdatedEndPosition, selection.start);
      const rightMost: string = editorArea.value.substring(selection.end, nextSelectionStartPosition >= selection.end
        ? nextSelectionStartPosition
        : selection.end);
      wholeContent += `${leftMost}${replaced}${rightMost}`;
    }
    tempSelectedText = null;
    pasted = null;
    if (strippedStringAtIndx > -1) dispatch('tag-strip', strippedStringAtIndx);

    return wholeContent;
  };

  const characterCounts = (e: InputEvent): number => {
    if (!!pasted) return pasted.length;
    if (e.inputType.indexOf('deleteContent') > -1) return -1;
    return !!e.data ? e.data.length : 1;
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
        ? modifyHTMLContent(characterCounts(e), e.inputType)
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

    const arrowKeysPressed = (
      (e.keyCode === 37 || e.code === 'ArrowLeft') ||
      (e.keyCode === 39 || e.code === 'ArrowRight') ||
      (e.keyCode === 36 || e.code === 'Home') ||
      (e.keyCode === 35 || e.code === 'End')
    );
    if (!!arrowKeysPressed && !!e.shiftKey) {
      textSelected();
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

  // Life Cycle
  onMount(() => {
    editorArea.focus();
  })

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
