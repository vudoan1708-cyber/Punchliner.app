<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';

  // Type
  import type { RecentSelection } from '../types/RecentSelection';
  import type { SelectedText } from '../types/SelectedText';

  // Utility
  import { deepClone, stringDiffOnce } from '../helper/utilities';

  export let className: string = 'hide';
  export let selectedText: SelectedText[] = [];
  export let menuShrinking: boolean = false;
  export let disabled: boolean = false;
  export let content: string = '';
  export let isContentLoaded: boolean = false;
  export let newContentAdded: boolean = false;
  export let tempSelectedText: SelectedText | null = null;
  export let controlClicked: boolean = false;

  const dispatch = createEventDispatcher();

  let editorArea: HTMLTextAreaElement | null = null;
  let editorWrapper: HTMLFormElement | null = null;
  let previewArea: HTMLDivElement | null = null;

  let recentSelection: RecentSelection | null = null;

  const replaceHTMLTags = (str: string): string => str.replace( /(<([^>]+)>)/ig, '');

  const strippedString = (uuid: string, eventType: string): string => {
    const element = previewArea?.querySelector(`[data-uuid="${uuid}"]`);
    if (!element) return '';

    let str = element.innerHTML;
    if (!str) {
      return '';
    }
    if (str.length === 1 && eventType.indexOf('deleteContent') > -1) {
      element.remove();
      return '';
    }
    str = str.toString();
          
    // Regular expression to identify HTML tags in 
    // the input string. Replacing the identified 
    // HTML tag with a null string.
    return replaceHTMLTags(str);
  };

  const clickFn = (idx) => {
    controlClicked = false;
    dispatch('text-click', selectedText[idx]);
  }

  const removeClickEvent = (uuid: string, eventType: string): string => {
    const hiddenElement: Element = previewArea.querySelector(`[data-uuid="${uuid}"]`);
    let strippedValue: string = '';
    if (!!hiddenElement) {
      hiddenElement.removeEventListener('click', clickFn);
      strippedValue = strippedString(uuid, eventType);
    }

    return strippedValue;
  }

  const appendClickEvent = () => {
    const newlyCreatedElements: NodeListOf<Element> = document.querySelectorAll('.hide');

    if (!!newlyCreatedElements) {
      Array.from(newlyCreatedElements).forEach((element, idx) => {
        element.removeEventListener('click', clickFn);
        element.addEventListener('click', () => { clickFn(idx); });
      });
    }
  };

  const modifySelectedStringOnTextDeletion = (
    editorActualCaretPosition: number,
    numOfModifiedCharacters: number,
    selection: SelectedText,
    eventType: string,
  ) => {
    let value: string = '';
    const textDiffBeforeDeletion = selectedText.length > 0 ? stringDiffOnce(editorArea.value, previewArea.textContent) : null;
    /* Check for delete event type to slice the selected text
      only if the caret position is right where the selected text starting position is */
    // Delete Key is pressed
    const offsetBeforeDeletion = Math.abs(numOfModifiedCharacters);
    if (editorActualCaretPosition === selection.start &&
      (!!textDiffBeforeDeletion && textDiffBeforeDeletion.diff.str2 !== ' ')) {
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

  const findCaretPosition = (numOfModifiedCharacters: number, eventType: string) => {
    if (!!pasted) return editorArea.selectionStart - pasted.length;
    if (eventType === 'deleteContentForward') return editorArea.selectionStart;
    if (eventType === 'deleteContentBackward') return editorArea.selectionStart;
    return editorArea.selectionStart - numOfModifiedCharacters;
  };

  const caretOnEitherEndOfText = (
    eventType: string,
    editorActualCaretPosition: number,
    numOfModifiedCharacters:number,
    selection: SelectedText,
  ) => (
    eventType.indexOf('deleteContent') > -1
      && (editorActualCaretPosition === selection.start
        || editorActualCaretPosition === selection.end - Math.abs(numOfModifiedCharacters))
  );

  const caretInBetweenSelectedTexts = (
    eventType: string,
    editorActualCaretPosition: number,
    numOfModifiedCharacters:number,
    selection: SelectedText,
    nextSelection: SelectedText,
  ) => (
    eventType.indexOf('deleteContent') > -1
      && (editorActualCaretPosition >= selection.end - Math.abs(numOfModifiedCharacters)
        && editorActualCaretPosition <= nextSelection?.start)
  );

  const caretInBetweenASelectedText = (
    eventType: string,
    editorActualCaretPosition: number,
    selection: SelectedText,
  ) => (
    eventType.indexOf('deleteContent') > -1
      && editorActualCaretPosition >= selection.start
      && editorActualCaretPosition <= selection.end
  );

  const modifyHTMLContent = (numOfModifiedCharacters: number, eventType: string = ''): string => {
    let wholeContent: string = '';

    let strippedStringAtIndx: number = -1;
    let startOfInterval: SelectedText = null;
    for (let i = 0; i < selectedText.length; i += 1) {
      const selection: SelectedText = selectedText[i];
      const prevSelectionUpdatedEndPosition: number = !!selectedText[i - 1] ? selectedText[i - 1].end : 0;
      const curSelectionStartPosition: number = i === 0 ? 0 : selection.start;
      let nextSelectionStartPosition: number = !!selectedText[i + 1]
        ? selectedText[i + 1].start
        : editorArea.value.length;

      const editorActualCaretPosition = findCaretPosition(numOfModifiedCharacters, eventType);
      if (editorActualCaretPosition <= selection.start) {
        // If deleting when there is only one selected piece of string || when there is no deleting at all
        if ((eventType.indexOf('deleteContent') < 0
          || eventType.indexOf('deleteContent') > -1 && selectedText.length === 1)) {
            if (!caretOnEitherEndOfText(eventType, editorActualCaretPosition, numOfModifiedCharacters, selection)) {
              selection.start += numOfModifiedCharacters;
            }
          }
        // If caret is placed at the start or end of text, keep the text starting pos still
        // whilst moving the other ones behind, if any
        else if (!!caretOnEitherEndOfText(eventType, editorActualCaretPosition, numOfModifiedCharacters, selection)) {
          if (i < selectedText.length - 1) {
            selectedText[i + 1].start += numOfModifiedCharacters;
            nextSelectionStartPosition = selectedText[i + 1].start;
          }
        }
        else if (eventType.indexOf('deleteContent') > -1) {
          if (i < selectedText.length - 1) {
            selection.start += numOfModifiedCharacters;
            selectedText[i + 1].start += numOfModifiedCharacters;
            nextSelectionStartPosition = selectedText[i + 1].start;
          }
        }
        selection.end += numOfModifiedCharacters;
      } else if (!!caretInBetweenSelectedTexts(
          eventType,
          editorActualCaretPosition,
          numOfModifiedCharacters,
          !startOfInterval ? selection : startOfInterval, selectedText[i + 1]
        )) {
        if (!caretOnEitherEndOfText(eventType, editorActualCaretPosition, numOfModifiedCharacters, selectedText[i + 1])) {
          // This is to only re-assign value to this variable ONCE, to compare it with the rest blocks of selection
          if (!startOfInterval) startOfInterval = deepClone(selection);
          selectedText[i + 1].start += numOfModifiedCharacters;
          nextSelectionStartPosition = selectedText[i + 1].start;
        }
      } else if (!!caretInBetweenASelectedText(eventType, editorActualCaretPosition, selection)) {
        selection.end += numOfModifiedCharacters;
      }

      selection.text = modifySelectedStringOnTextDeletion(
        editorActualCaretPosition, numOfModifiedCharacters, selection, eventType,
      );

      // The replaced part (stripped HTML or added HTML tag string)
      let replaced: string = '';
      if (!!selection.wasHidden || !selection.text) {
        replaced = removeClickEvent(selection.id, eventType);
        strippedStringAtIndx = i;
      } else replaced = `<span class="${className}" id="${selection.id}" data-uuid="${selection.id}">${selection.text}</span>`;
      // This either stays at one place, or is pushed however many more characters added to the start position
      const leftMost: string = editorArea.value.substring(curSelectionStartPosition >= prevSelectionUpdatedEndPosition
        ? curSelectionStartPosition
        : prevSelectionUpdatedEndPosition, selection.start);
      const rightMost: string = editorArea.value.substring(selection.end, nextSelectionStartPosition >= selection.end
        ? nextSelectionStartPosition
        : selection.end);
      wholeContent += `${leftMost}${replaced}${rightMost}`;
    }
    recentSelection = null;
    tempSelectedText = null;
    pasted = null;
    if (strippedStringAtIndx > -1) dispatch('tag-strip', strippedStringAtIndx);

    return wholeContent;
  };

  const characterCounts = (e: InputEvent): number => {
    if (!!pasted) return pasted.length;
    if (e.inputType.indexOf('deleteContent') > -1) return !recentSelection ? -1 : -recentSelection.text.length;
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
      return;
    }
    dispatch('select', null);
  };

  let isWritting: boolean = false;
  const onTextAreaChanged = (e) => {
    if (!isWritting) isWritting = true;
    if (!!editorArea && !!previewArea) {
      previewArea.innerHTML = (selectedText.length > 0)
        ? modifyHTMLContent(characterCounts(e), e.inputType)
        : editorArea.value;
      previewArea.scrollTop = editorArea.scrollTop;

      newContentAdded = true;
    }
  };

  const onTextAreaScrolled = (e) => {
    previewArea.scrollTop = e.target.scrollTop;
  };

  const onTextAreaKeyUpEvent = (e) => {
    if ((e.keyCode === 66 || e.code === 'KeyB') && !!e.ctrlKey) {
      dispatch('ctrlB');
      return;
    }
    if ((e.keyCode === 0 || e.code === 'Digit0' || e.code === 'Numpad0') && !!e.ctrlKey) {
      e.preventDefault();
      dispatch('ctrlZero');
      return;
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
  const onTextAreaKeyDownEvent = (e) => {
    if ((e.keyCode === 83 || e.code === 'KeyS') && !!e.ctrlKey) {
      e.preventDefault();
      dispatch('ctrlS');
    }
  };

  const onTextAreaMouseMoved = () => {
    if (!!isWritting && selectedText.length > 0) {
      isWritting = false;
      appendClickEvent();
    }
  };

  const onTextAreaBlurred = () => {
    dispatch('blur');
  }

  let pasted: string = null;
  const onTextAreaPasted = (e) => {
    // @ts-ignore
    pasted = (e.clipboardData || window.clipboardData).getData('text');
  };

  const displayNewContent = () => {
    editorArea.value = replaceHTMLTags(content);
    previewArea.innerHTML = content;
    isContentLoaded = false;
    appendClickEvent();
  };

  // Life Cycle
  onMount(() => {
    editorArea.focus();
    displayNewContent();
  })

  $: if (!!controlClicked) {
    previewArea.innerHTML = modifyHTMLContent(0);
    appendClickEvent();
  };
  $: if (!!isContentLoaded && !!editorArea && !!previewArea) {
    displayNewContent();
  };
  $: if (!!editorWrapper) {
    if (!!menuShrinking) {
      editorWrapper.style.height = '330px';
    } else {
      editorWrapper.style.height = '';
    }
  }
</script>

<!-- <template> -->
  <form action="#" id="textEditor" bind:this={editorWrapper}>
    <div id="editorWrapper">
      <textarea
        id="editor"
        wrap="soft"
        placeholder="Type here..."
        class:disabled
        {disabled}
        bind:this={editorArea}
        on:input={onTextAreaChanged}
        on:scroll={onTextAreaScrolled}
        on:click={textSelected}
        on:keyup={onTextAreaKeyUpEvent}
        on:keydown={onTextAreaKeyDownEvent}
        on:mousemove={onTextAreaMouseMoved}
        on:paste={onTextAreaPasted}
        on:blur={onTextAreaBlurred} />
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
    transition: height .2s;
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

  #editorWrapper textarea.disabled {
    cursor: not-allowed;
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
