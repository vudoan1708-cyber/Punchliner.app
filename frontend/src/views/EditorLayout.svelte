<script lang="ts">
  import { onMount } from 'svelte';

  import Loading from '../components/Loading.svelte';
  import Modal from '../components/Modal.svelte';
  import Button from '../components/Button.svelte';
  import Icon from '../components//Icon/Icon.svelte';
  
  import TextEditor from "../lib/TextEditor.svelte";
  import ControlsUI from "../lib/ControlsUI/ControlsUI.svelte";

  // Type
  import type { Control } from '../lib/ControlsUI/ControlsUI';
  import type { SelectedText } from '../types/SelectedText';
  import type { Error } from '../types/Error';

  // API
  import { DocumentCreateBuilder, DocumentSaveBuilder } from '../API/DAPI';

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

  const modifyControls = (lookUpName: string, changedControl: Control): void => {
    const idx: number = controls.findIndex((control) => control.lookUpName === lookUpName);
    controls = swapArrayItems(controls, idx, changedControl);
  };

  let className: string = '';
  const hideContent = (lookUpName: string, changedControl: Control): void => {
    modifyControls(lookUpName, changedControl);

    selectedText = orderByStartingPosition([ ...selectedText, tempSelectedText ]);
    className = changedControl.lookUpName;
    controlClicked = true;
  };

  const displayContent = (lookUpName: string, changedControl: Control, selected: SelectedText): void => {
    modifyControls(lookUpName, changedControl);
    
    const idx = selectedText.findIndex((text) => (!!text && text.id === selected.id));
    if (!!selectedText[idx]) {
      selectedText[idx].wasHidden = selected.wasHidden;
      controlClicked = true;
    }
  };

  const idGenerator = (detail): string => uuid(`${detail.text.replace(/[\r\n]/gm, '').trim()} ${detail.start} ${detail.end}`);

  // Event Handlers
  let tempSelectedText: SelectedText | null = null;
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

  const newDocumentTitle = (): string => {
    const fullTextContent: string = (document.querySelector('#preview') as HTMLElement | null).innerText;
    const limitToSave: number = 5;

    if (!fullTextContent || fullTextContent.length < limitToSave) {
      return 'New Empty Document';
    }
    const firstFiveChars: number = fullTextContent.length - (fullTextContent.length - limitToSave);
    return `${fullTextContent.slice(0, firstFiveChars)}...`;
  };

  let loading: boolean = false;
  let documentTitle: string = '';
  let documentId: string = '';
  const error: Error = {
    message: null,
    detail: null,  
  };
  const sessionId = cookiestore.get('session');
  const saveDocument = async () => {
    loading = true;
    
    try {
      const preview: string = document.querySelector('#preview').innerHTML;
      const requestBody = {
        title: documentTitle,
        content: preview,
      };
      const res = await DocumentSaveBuilder().addDocumentIdParam(documentId).addRequestBody(requestBody).PATCH(sessionId);

      if (!res.success) {
        error.message = res.message;
        error.detail = res.detail;
        return;
      }
    } catch (ex) {
      error.message = ex.message;
      error.detail = ex.detail;
    } finally {
      loading = false;
    }
  };

  let loadedDocument: {
    loaded: boolean;
    content: string;
  } = {
    loaded: false,
    content: '',
  };

  const createDocument = async () => {
    loading = true;

    documentTitle = newDocumentTitle();

    try {
      const requestBody = {
        title: documentTitle,
        content: loadedDocument.content,
      };
      const res = await DocumentCreateBuilder().addRequestBody(requestBody).POST(sessionId);

      if (!res.success) {
        error.message = res.message;
        error.detail = res.detail;
        return;
      }

      documentId = res.data.document._id;
      loadedDocument.loaded = true;
    } catch (ex) {
      error.message = ex.message;
      error.detail = ex.detail;
    } finally {
      loading = false;
      savePrompt = true;
      loadedDocument.loaded = false;
    }
  };

  let savePrompt: boolean = false;
  let canQuickSave: boolean = false;
  const promptSaveDocument = () => {
    if (!documentTitle) {
      savePrompt = true;
      return;
    }

    savePrompt = false;
    canQuickSave = true;
    saveDocument();
  };

  const onTextEditorBlurred = () => {
    if (!documentTitle || !canQuickSave) return;
    promptSaveDocument();
  };

  // Life Cycles
  onMount(() => {
    // Make 2 or 3 API calls here
    // Document Overview API (get document ID(s))

    // If not document retrieved, Document Create API here
    setTimeout(() => {
      createDocument();
    }, 1000);

    // Document Query (1st if not last editted)
  });
</script>

<main>
  <section id="wrap">
    <TextEditor
      {className}
      {selectedText}
      content={loadedDocument.content}
      isLoaded={loadedDocument.loaded}
      bind:tempSelectedText
      bind:controlClicked
      on:select={textSelected}
      on:ctrlB={() => { triggerShortcutToHideText(tempSelectedText); }}
      on:text-click={triggerMouseClickToDisplayText}
      on:tag-strip={removeSelectedText}
      on:blur={onTextEditorBlurred} />
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
      }); }}
      on:save-click={promptSaveDocument} />
  </section>

  {#if loading}
    <Loading />
  {/if}

  {#if !!error.message || !!error.detail}
    <Modal
      title={error.message}
      style="min-height: 5em;"
      backgroundClose
      on:close={() => { error.message = null; error.detail = null; }}>
      <div>{error.detail}</div>
    </Modal>
  {/if}

  {#if savePrompt}
    <Modal
      title="Save The Document"
      style="max-width: 20em; min-height: 5.5em;"
      backgroundClose
      on:close={() => { savePrompt = false; }}>
      <form class="saveDocs" on:submit|preventDefault>
        <input type="text" placeholder="Document title..." bind:value={documentTitle} />
        <Button on:click={promptSaveDocument}>
          <div class="button_content_wrapper">
            <Icon name="save" />
            Save
          </div>
        </Button>
      </form>
    </Modal>
  {/if}
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

  form.saveDocs {
    display: flex;
    gap: var(--margin);
    align-items: center;
  }

  div.button_content_wrapper {
    display: flex;
    gap: calc(var(--margin) / 2);
    align-items: center;
  }
</style>
