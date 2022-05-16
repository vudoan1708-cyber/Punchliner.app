<script lang="ts">
  import TextEditor from "./lib/TextEditor.svelte";
  import ControlsUI from "./lib/ControlsUI/ControlsUI.svelte";

  // Type
  import type { Control } from './lib/ControlsUI/ControlsUI';
  import type { SelectedText } from './types/SelectedText';

  // Utilities
  import { uuid, appendingArrayWithDuplicateChecker, swapArrayItems } from './helper/utilities';

  let selectedText: SelectedText[] = [];

  let controls: Control[] = [
    {
      lookUpName: 'display',
      title: 'Click to hide',
    },
  ];
  let controlClicked: boolean = false;

  const modifyControls = (lookUpName: string, changedControl: Control) => {
    const idx = controls.findIndex((control) => control.lookUpName === lookUpName);
    controls = swapArrayItems(controls, idx, changedControl);
  };

  let className: string = '';
  const hideContent = (lookUpName: string, changedControl: Control) => {
    modifyControls(lookUpName, changedControl);

    // TODO: Add the selected text to the selectedText array
    selectedText = [ ...selectedText, tempSelectedText ];

    className = changedControl.lookUpName;
    controlClicked = true;
  };

  const displayContent = (lookUpName: string, changedControl: Control) => {
    modifyControls(lookUpName, changedControl);

    // TODO: Remove the most recent selected text form the selectedText array
    const idx = selectedText.findIndex((text) => (!!text && text.id === tempSelectedText.id));
    if (!!selectedText[idx]) {
      selectedText.splice(idx, 1);

      className = changedControl.lookUpName;
      controlClicked = true;
    }
  };

  let tempSelectedText: SelectedText = null;
  let isSameTextSelected: boolean = false;
  const textSelected = ({ detail }): void => {
    if (!!detail) {
      const selected = {
        id: uuid(`${detail.text} ${detail.start} ${detail.end}`),
        selected: detail.text,
      };
      tempSelectedText = { ...selected };

      const IDs = selectedText.map((text) => text.id);

      IDs.forEach(() => {
        [ , isSameTextSelected ] = appendingArrayWithDuplicateChecker(IDs, tempSelectedText.id);
      });

      if (selectedText.length === 0) {
        return;
      }
      // If the selected text is a duplicate, then it has been hidden away
      // Hence, the title is `Click to show`, and likewise
      if (!!isSameTextSelected) modifyControls('display', {
        lookUpName: 'hide',
        title: 'Click to show',
      });
      else modifyControls('hide', {
        lookUpName: 'display',
        title: 'Click to hide',
      });
      return;
    }
    tempSelectedText = null;
    modifyControls('hide', {
      lookUpName: 'display',
      title: 'Click to hide',
    });
  };
</script>

<main>
  <section id="wrap">
    <TextEditor
      {className}
      {isSameTextSelected}
      bind:tempSelectedText
      bind:controlClicked
      on:select={textSelected} />
  </section>

  <section id="controls_wrap">
    <ControlsUI
      {controls}
      {tempSelectedText}
      on:hide-click={() => { displayContent('hide', {
        lookUpName: 'display',
        title: 'Click to hide',
      }); }}
      on:display-click={() => { hideContent('display', {
        lookUpName: 'hide',
        title: 'Click to show',
      }); }} />
  </section>
</main>

<style>
  main {
    position: relative;
    margin: 0 auto 0 auto;
    padding: 50px 0 0 0;
    width: 800px;
  }

  #wrap {
    position: relative;
    width: 100%;
    padding: var(--padding) 0;
    border-top: 1px solid #003300;
    border-bottom: 1px solid #003300;
  }

  #controls_wrap {
    position: relative;
    width: 100%;
  }
</style>
