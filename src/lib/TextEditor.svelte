<script lang="ts">
  import { tick, createEventDispatcher } from 'svelte';

  // Type
  import type { RecentSelection } from '../types/RecentSelection';
  import type { SelectedText } from '../types/SelectedText';
  // import type { Control } from '../lib/ControlsUI/ControlsUI';

  // Constant
  import { PLACEHOLDER } from '../helper/constants';

  // Utility
  import { uuid, getSelection } from '../helper/utilities';

  export let className: string = '';
  export let tempSelectedText: SelectedText = null;
  export let isDuplicate: boolean = null;
  // export let selectedText: SelectedText[] = [];
  export let controlClicked: boolean = false;

  const dispatch = createEventDispatcher();

  let editorArea: HTMLDivElement = null;
  let typedContentArea: HTMLParagraphElement = null;

  let recentSelection: RecentSelection = null;

  const placeCaretAtEnd = (el: HTMLElement) => {
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

  const replaceTagsWithBackslash = (childNodes: NodeListOf<ChildNode>): string => {
    let newValue: string = '';
    let i = 0;
    while (i <= childNodes.length) {
      const node = childNodes[i];
      if (!!node) {
        if (node.nodeName === 'P' || node.nodeName === 'BR' || node.nodeName === 'DIV') {
          newValue += `${node.textContent}\n`;
        }
      }
      i += 1;
    }
    return newValue;
  };

  const strippedString = (uuid: string): string => {
    let str = typedContentArea.querySelector(`[data-uuid="${uuid}"]`).innerHTML;
    if ((str === null) || (str === '')) return '';
    str = str.toString();
          
    // Regular expression to identify HTML tags in 
    // the input string. Replacing the identified 
    // HTML tag with a null string.
    return str.replace( /(<([^>]+)>)/ig, '');
  };

  const modifyHTMLContent = (selection: RecentSelection): string => {
    let replaced: string = '';
    if (!!isSameTextSelected) replaced = strippedString(tempSelectedText.id);
    else replaced = `<span class="${className} ${uuid()}" data-uuid=${tempSelectedText.id}>${selection.text}</span>`;

    const leftMost = editorArea.textContent.substring(0, selection.start);
    const rightMost = editorArea.textContent.substring(selection.end, editorArea.textContent.length);
    tempSelectedText = null;

    return `${leftMost}${replaced}${rightMost}`;
  };

  // Event Handlers
  const onTextEditorInputted = (): void => {
    if (!!typedContentArea && typedContentArea.textContent.trim().indexOf(PLACEHOLDER) > -1) {
      typedContentArea.removeChild(document.getElementsByClassName('placeholder-decoration')[0]);
      return;
    }
    if (!typedContentArea.textContent) {
      const newPlaceholder = `<span class="placeholder-decoration" contenteditable="false"><span>${PLACEHOLDER}</span></span><br />`;
      typedContentArea.innerHTML = newPlaceholder;
    }
  };

  const textSelected = () => {
    controlClicked = false;
    const selected: RecentSelection =  getSelection();
    console.log(selected);
    if (!!selected) {
      recentSelection = {
        _self_: selected._self_,
        text: selected.text,
        start: selected.start,
        end: selected.end,
      };
      dispatch('select', selected);
    }
  };

  const onTextEditorKeyedDown = async (e) => {
    if (e.keyCode === 13 || e.code === 'Enter') {
      if (typedContentArea.textContent.trim().indexOf(PLACEHOLDER) > -1) {
        e.preventDefault();
        return;
      }
      await tick();
      const replaced = replaceTagsWithBackslash(editorArea.childNodes);
      typedContentArea.innerHTML = replaced;
      setTimeout(() => {
        for (let n = editorArea.childNodes.length - 1; n >= 0; n -= 1) {
          if (n > 0) editorArea.removeChild(editorArea.childNodes[n]);
        }
      }, 0.25);
      placeCaretAtEnd(document.getElementById('textContainer'));
    }
  };

  $: {
    if (!!controlClicked) typedContentArea.innerHTML = modifyHTMLContent(recentSelection);
  }
  $: isSameTextSelected = isDuplicate;
</script>

<!-- <template> -->
  <div action="#" id="textEditor">
    <div id="editorWrapper">
      <div
        id="editor"
        wrap="soft"
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
    user-select: none;
    -webkit-user-modify: read-only
  }
  #editorWrapper :global(.placeholder-decoration > span) {
    position: absolute;
    pointer-events: none;
  }

  :global(.hide) {
    filter: blur(2px);
    background-color: var(--color-primary);
    color: transparent;
    transition: .2s filter, .2s background-color, .2s color;
  }
  :global(.hide:hover) {
    filter: blur(0);
    background-color: initial;
    color: inherit;
  }
</style>
