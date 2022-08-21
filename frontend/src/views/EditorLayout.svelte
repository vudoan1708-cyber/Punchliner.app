<script lang="ts">
  import { onMount } from 'svelte';

  import Loading from '../components/Loading.svelte';
  import Modal from '../components/Modal.svelte';
  import Button from '../components/Button.svelte';
  import Icon from '../components//Icon/Icon.svelte';
  
  import TextEditor from "../lib/TextEditor.svelte";
  import UserInfo from "../lib/UserInfo.svelte";
  import DocumentInfo from '../lib/DocumentInfo.svelte';
  import ControlsUI from "../lib/ControlsUI/ControlsUI.svelte";

  // Type
  import type { Control } from '../lib/ControlsUI/ControlsUI';
  import type { SelectedText } from '../types/SelectedText';
  import type { Error } from '../types/Error';
  import type { Document } from '../types/Document';

  // API
  import {
    DocumentCreateBuilder, DocumentSaveBuilder, DocumentOverviewBuilder, DocumentQueryBuilder,
  } from '../API/DAPI';

  // Utilities
  import {
    uuid, parseTextContent, appendingArrayWithDuplicateChecker, swapArrayItems,
  } from '../helper/utilities';
  import { cookiestore } from '../helper/storage';

  let selectedText: SelectedText[] = [];

  let controls: Control[] = [
    {
      lookUpName: 'display',
      title: 'Click to hide\nShortcut combination is CTRL + B',
      disabled: true,
    },
    {
      lookUpName: 'save',
      title: 'Click to save document\nShortcut combination is CTRL + S',
      disabled: false,
    },
    {
      lookUpName: 'new',
      title: 'Click to add a new document\nShortcut combination is CTRL + 0',
      disabled: false,
    },
  ];
  let controlClicked: boolean = false;

  const orderByStartingPosition = (array: SelectedText[]): SelectedText[] => array.sort((a, b) => a.start - b.start);

  const modifyControls = (lookUpName: string, changedControl: Control): void => {
    const idx: number = controls.findIndex((control) => control.lookUpName === lookUpName);
    if (idx < 0) return;
    controls = swapArrayItems(controls, idx, changedControl);
  };

  let className: string = 'hide';
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

  const idGenerator = (detail): string => uuid(`${detail.text.replace(/[\r\n]/gm, '').trim()}+${detail.start}+${detail.end}`);

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
        disabled: true,
      });
      else modifyControls('hide', {
        lookUpName: 'display',
        title: 'Click to hide\nShortcut combination is CTRL + B',
        disabled: true,
      });
      return;
    }
    tempSelectedText = null;
    modifyControls('hide', {
      lookUpName: 'display',
      title: 'Click to hide\nShortcut combination is CTRL + B',
      disabled: true,
    });
  };

  const triggerShortcutToChangeTextVisibility = (text: SelectedText) => {
    if (!!isDuplicate) displayContent('hide', {
      lookUpName: 'display',
      title: 'Click to hide\nShortcut combination is CTRL + B',
      disabled: true,
    }, text);
    else hideContent('display', {
      lookUpName: 'hide',
      title: 'Click to show',
      disabled: true,
    });
  };

  const triggerMouseClickToDisplayText = ({ detail }) => {
    const IDs = selectedText.map((text) => text.id);

    IDs.forEach(() => {
      [ , isDuplicate ] = appendingArrayWithDuplicateChecker(IDs, detail.id);
    });
    detail.wasHidden = isDuplicate;
    triggerShortcutToChangeTextVisibility(detail);
  };

  const removeSelectedText = ({ detail }) => {
    selectedText = selectedText.filter((__, idx) => idx !== detail);
  };

  const newDocumentTitle = (): string => 'New Empty Document';

  let loading: boolean = false;
  let newContentAdded: boolean = false;
  let documentTitle: string = '';
  let documentId: string = '';
  const error: Error = {
    message: null,
    detail: null,  
  };
  const sessionId = cookiestore.get('session');

  // Document Save
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
      newContentAdded = false;
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

  // Document Creation
  let textEditorDisabled: boolean = false;
  const createDocument = async () => {
    loading = true;

    documentTitle = newDocumentTitle();
    loadedDocument.content = '';

    try {
      const requestBody = {
        title: documentTitle,
        content: loadedDocument.content,
      };
      const res = await DocumentCreateBuilder().addRequestBody(requestBody).POST(sessionId);

      if (!res.success) {
        error.message = res.message;
        error.detail = res.detail;
        textEditorDisabled = true;
        return;
      }

      documentId = res.data.document._id;
      loadedDocument.loaded = true;
      textEditorDisabled = false;
    } catch (ex) {
      error.message = ex.message;
      error.detail = ex.detail;
      textEditorDisabled = true;
    } finally {
      loading = false;
      savePrompt = true;
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
    if (!newContentAdded) return;

    promptSaveDocument();
  };

  // Document Overview
  const getDocuments = async (): Promise<Document[]> | null => {
    try {
      const res = await DocumentOverviewBuilder().addDefaultParams().GET(sessionId);
      if (!res.success) {
        error.message = res.message;
        error.detail = res.detail;
        return null;
      }
      return res.data.documents;
    } catch (ex) {
      error.message = ex.message;
      error.detail = ex.detail;
      return null;
    }
  };

  // Document Query
  const getDocument = async (id): Promise<Document> | null => {
    try {
      const res = await DocumentQueryBuilder().addDocumentId(id).GET(sessionId);
      if (!res.success) {
        error.message = res.message;
        error.detail = res.detail;
        textEditorDisabled = true;
        return null;
      }

      documentId = res.data.document._id;
      textEditorDisabled = false;
      return res.data.document;
    } catch (ex) {
      error.message = ex.message;
      error.detail = ex.detail;
      textEditorDisabled = true;
      return null;
    }
  };

  let menuShrinking: boolean = false;
  const expandMenuSection = ({ detail }) => {
    menuShrinking = detail;
  };

  const onWindowKeyUp = (e) => {
    if ((e.keyCode === 0 || e.code === 'Digit0' || e.code === 'Numpad0') && !!e.ctrlKey) {
      e.preventDefault();
      createDocument();
    }
  };

  window.addEventListener('beforeunload', (e) => {
    if (!newContentAdded) return;
    e.returnValue = 'There is some content that has not been saved. Are you sure you want to leave?';
  });

  let allDocs: Array<Document> | void = null;
  const toLoadDocument = async (doc: Document) => {
    const firstDoc = await getDocument(doc._id);
    if (!firstDoc) return;

    selectedText = parseTextContent(doc.content);
    documentTitle = doc.title;

    loadedDocument.loaded = true;
    loadedDocument.content = firstDoc.content;
  };

  // Life Cycles
  onMount(async () => {
    // Make 2 or 3 API calls here
    // Shareable Document check

    // Document Overview API (get document ID(s))
    allDocs = await getDocuments();

    // If no document retrieved, Document Create API here
    if (!!allDocs && allDocs.length === 0) {
      setTimeout(() => {
        createDocument();
      }, 1000);
      return;
    }

    // Document Query (1st if not last editted)
    if (!!allDocs && allDocs.length > 0) {
      allDocs = allDocs.sort((a, b) => (new Date(b.updated_at) as any) - (new Date(a.updated_at) as any));
      toLoadDocument(allDocs[0]);
    }
  });
</script>

<svelte:window on:keyup={onWindowKeyUp} />
<section id="layout_wrap">
  <section id="editor_wrap">
    <TextEditor
      {className}
      {selectedText}
      {menuShrinking}
      disabled={textEditorDisabled}
      content={loadedDocument.content}
      bind:isContentLoaded={loadedDocument.loaded}
      bind:newContentAdded
      bind:tempSelectedText
      bind:controlClicked
      on:select={textSelected}
      on:ctrlB={() => { triggerShortcutToChangeTextVisibility(tempSelectedText); }}
      on:ctrlS={promptSaveDocument}
      on:ctrlZero={createDocument}
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
        title: 'Click to hide\nShortcut combination is CTRL + B',
        disabled: true,
      }, tempSelectedText); }}
      on:display-click={() => { hideContent('display', {
        lookUpName: 'hide',
        title: 'Click to show',
        disabled: true,
      }); }}
      on:save-click={promptSaveDocument}
      on:new-click={createDocument}
      on:hamburger-click={expandMenuSection} />

    <UserInfo />
  </section>

  <section id="documentsInfo" class:hidden={menuShrinking}>
    <DocumentInfo {allDocs} on:get-document={({ detail }) => { toLoadDocument(detail); }} />
  </section>

  {#if loading}
    <Loading />
  {/if}

  {#if !!error.message || !!error.detail}
    <Modal
      title="Error"
      style="min-height: 5em;"
      backgroundClose
      on:close={() => { error.message = null; error.detail = null; }}>
      <div>{error.message}</div>
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
</section>

<style>
  section#layout_wrap {
    position: relative;
    margin: 0 auto 0 auto;
    padding: 50px 0 0 0;
    width: 800px;
  }

  #editor_wrap {
    position: relative;
    width: 100%;
    padding: var(--padding) 0;
    border-top: 1px solid #003300;
    border-bottom: 1px solid #003300;
  }

  #controls_wrap {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  #documentsInfo {
    display: none;
    opacity: 0;
    transition: opacity .2s;
  }
  #documentsInfo.hidden {
    display: block;
    opacity: 1;
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
