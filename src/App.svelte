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

  const modifyControls = (lookUpName: string, changedControl: Control) => {
    const idx = controls.findIndex((control) => control.lookUpName === lookUpName);
    controls = swapArrayItems(controls, idx, changedControl);
  };

  let className: string = '';
  const hideContent = (lookUpName: string, changedControl: Control) => {
    modifyControls(lookUpName, changedControl);

    // TODO: Add the selected text to the selectedText array
    selectedText = [ ...selectedText, tempSelectedText ];
    tempSelectedText = null;

    className = changedControl.lookUpName;
  };

  const displayContent = (lookUpName: string, changedControl: Control) => {
    modifyControls(lookUpName, changedControl);

    // TODO: Remove the most recent selected text form the selectedText array
    const idx = selectedText.findIndex((text) => (!!text && text.id === tempSelectedText.id));
    if (!!selectedText[idx]) {
      selectedText.splice(idx, 1);
      tempSelectedText = null;
      console.log(selectedText)
      className = changedControl.lookUpName;
    }
  };

  let tempSelectedText: SelectedText = null;
  const textSelected = ({ detail }): void => {
    if (!!detail) {
      const selected = {
        id: uuid(detail),
        selected: detail,
        visibility: true,
      };
      tempSelectedText = { ...selected };

      const IDs = selectedText.map((text) => text.id);

      let isDuplicate: boolean = false;
      IDs.forEach(() => {
        [ , isDuplicate ] = appendingArrayWithDuplicateChecker(IDs, tempSelectedText.id);
      });
      console.log(isDuplicate)
      if (selectedText.length === 0) {
        return;
      }
      // If the selected text is a duplicate, then it has been hidden away
      // Hence, the title is `Click to show`, and likewise
      if (!!isDuplicate) modifyControls('display', {
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
      {selectedText}
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
