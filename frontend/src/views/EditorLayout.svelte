<script lang="ts">
  import { navigate } from 'svelte-navigator';
  
  import TextEditor from "../lib/TextEditor.svelte";
  import ControlsUI from "../lib/ControlsUI/ControlsUI.svelte";

  // Type
  import type { Control } from '../lib/ControlsUI/ControlsUI';
  import type { SelectedText } from '../types/SelectedText';

  // Utilities
  import { uuid, appendingArrayWithDuplicateChecker, swapArrayItems } from '../helper/utilities';
  import { cookiestore } from '../helper/storage';

  let selectedText: SelectedText[] = [];

  let controls: Control[] = [
    {
      lookUpName: 'display',
      title: 'Click to hide',
    },
    {
      lookUpName: 'save',
      title: 'Click to save document',
    },
  ];
  let controlClicked: boolean = false;

  const orderByStartingPosition = (array: SelectedText[]) => array.sort((a, b) => a.start - b.start);

  const modifyControls = (lookUpName: string, changedControl: Control) => {
    const idx = controls.findIndex((control) => control.lookUpName === lookUpName);
    controls = swapArrayItems(controls, idx, changedControl);
  };

  let className: string = '';
  const hideContent = (lookUpName: string, changedControl: Control) => {
    modifyControls(lookUpName, changedControl);

    selectedText = orderByStartingPosition([ ...selectedText, tempSelectedText ]);
    className = changedControl.lookUpName;
    controlClicked = true;
  };

  const displayContent = (lookUpName: string, changedControl: Control, selected: SelectedText) => {
    modifyControls(lookUpName, changedControl);
    
    const idx = selectedText.findIndex((text) => (!!text && text.id === selected.id));
    if (!!selectedText[idx]) {
      selectedText[idx].wasHidden = selected.wasHidden;
      controlClicked = true;
    }
  };

  const idGenerator = (detail) => uuid(`${detail.text.replace(/[\r\n]/gm, '').trim()} ${detail.start} ${detail.end}`);

  // Event Handlers
  let tempSelectedText: SelectedText = null;
  let isDuplicate: boolean = false;
  const textSelected = ({ detail }): void => {
    if (!!detail) {
      const IDs = selectedText.map((text) => text.id);

      const newID = idGenerator(detail);
      if (IDs.length > 0) {
        IDs.forEach(() => {
          [ , isDuplicate ] = appendingArrayWithDuplicateChecker(IDs, newID);
        });
      } else isDuplicate = false;

      const selected: SelectedText = {
        id: newID,
        text: detail.text,
        start: detail.start,
        end: detail.end,
        wasHidden: isDuplicate,
      };
      tempSelectedText = { ...selected };

      if (selectedText.length === 0) {
        return;
      }
      // If the selected text is a duplicate, then it has been hidden away
      // Hence, switching the lookup name to `hide` and the title to `Click to show`, and likewise
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

  const triggerShortcutToHideText = (text: SelectedText) => {
    if (!!isDuplicate) displayContent('hide', {
      lookUpName: 'display',
      title: 'Click to hide',
    }, text);
    else hideContent('display', {
      lookUpName: 'hide',
      title: 'Click to show',
    });
  };

  const triggerMouseClickToDisplayText = ({ detail }) => {
    const IDs = selectedText.map((text) => text.id);

    IDs.forEach(() => {
      [ , isDuplicate ] = appendingArrayWithDuplicateChecker(IDs, detail.id);
    });
    detail.wasHidden = isDuplicate;
    triggerShortcutToHideText(detail);
  };

  const removeSelectedText = ({ detail }) => {
    selectedText = selectedText.filter((__, idx) => idx !== detail);
  };

  const invalidLocation = (pathname, search) => {
    const userId = cookiestore.get('userId');
    const sessionId = cookiestore.get('session');

    const [ userIdSearchVal, sessionIdSeachVal ] = search.split('&');

    return pathname.includes('/editor')
      && (!search || (userIdSearchVal.split('=')[1] !== userId || sessionIdSeachVal.split('=')[1] !== sessionId));
  };

  (() => {
    const { pathname, search } = window.location;
    if (invalidLocation(pathname, search)) {
      navigate('/account/login?error_message=Session%20ID%20or%20user%20ID%20does%20not%20match');
    }
  })();
</script>

<main>
  <section id="wrap">
    <TextEditor
      {className}
      {selectedText}
      bind:tempSelectedText
      bind:controlClicked
      on:select={textSelected}
      on:ctrlB={() => { triggerShortcutToHideText(tempSelectedText); }}
      on:text-click={triggerMouseClickToDisplayText}
      on:tag-strip={removeSelectedText} />
  </section>

  <section id="controls_wrap">
    <ControlsUI
      {controls}
      {tempSelectedText}
      on:hide-click={() => { displayContent('hide', {
        lookUpName: 'display',
        title: 'Click to hide',
      }, tempSelectedText); }}
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
