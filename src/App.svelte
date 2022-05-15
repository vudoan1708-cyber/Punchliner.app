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
      title: 'Show',
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
    className = changedControl.lookUpName;
  };

  const displayContent = (lookUpName: string, changedControl: Control) => {
    modifyControls(lookUpName, changedControl);

    // TODO: Remove the most recent selected text form the selectedText array
    const idx = selectedText.findIndex((text) => text.id === tempSelectedText.id);
    selectedText.splice(idx, 1);
    className = changedControl.lookUpName;
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

      const [ , isDuplicate ] = appendingArrayWithDuplicateChecker(selectedText, tempSelectedText);

      if (selectedText.length === 0) {
        return;
      }
      // If the selected text is a duplicate, then it has been hidden away
      // Hence, show the Display icon, and likewise
      if (!!isDuplicate) modifyControls('hide', {
        lookUpName: 'display',
        title: 'Show',
      });
      else modifyControls('display', {
        lookUpName: 'hide',
        title: 'Hide',
      });
      return;
    }
    tempSelectedText = null;
  };
</script>

<main>
  <section id="wrap">
    <TextEditor on:select={textSelected} {className} />
  </section>

  <section id="controls_wrap">
    <ControlsUI
      {controls}
      on:hide-click={() => { displayContent('hide', {
        lookUpName: 'display',
        title: 'Show',
      }); }}
      on:display-click={() => { hideContent('display', {
        lookUpName: 'hide',
        title: 'Hide',
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
