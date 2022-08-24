<script lang="ts">
  import 'tippy.js/animations/scale.css';

  import { createEventDispatcher } from 'svelte';

  import Button from '../components/Button.svelte';
  import Modal from '../components/Modal.svelte';
  import ToolTip from '../components/ToolTip.svelte';
  import Icon from '../components/Icon/Icon.svelte';

  // API
  import { DocumentShareBuilder, DocumentUnshareBuilder } from '../API/DAPI';

  // Type
  import type { Document } from '../types/Document';
  import type { Error } from '../types/Error';

  export let sessionId: string | void = null;
  export let allDocs: Array<Document> | void = null;

  const dispatch = createEventDispatcher();

  const getDateDiff = (today: number, date: number): string => {
    const daysInMonth = (month: number, year: number): number => new Date(year, month, 0).getDate();
    const pluralise = (num: number, str: string): string => num > 1 ? `${str}s` : str;

    const diffInDays = Math.floor((today - date) / (1000 * 3600 * 24));
    const numOfDays = daysInMonth(new Date().getMonth(), new Date().getFullYear());
    if (diffInDays > numOfDays) {
      const remainder = diffInDays % numOfDays;
      return pluralise(remainder, `${remainder} month`);
    }
    return pluralise(diffInDays, `${diffInDays} day`);
  };

  // Event Handlers
  let passcode: string = null;
  let docToBeShared: Document | void = null;
  const error: Error = {
    message: '',
    detail: '',
  };
  const shareDocument = async (): Promise<void> => {
    if (!docToBeShared || !passcode) return;
    const res = await DocumentShareBuilder().addDocumentId(docToBeShared._id).addPasscode(passcode).POST(sessionId);
    if (!res.success) {
      error.message = res.message;
      error.detail = res.detail;
      return;
    }
    docToBeShared = null;
    passcode = null;
  };
  const unshareDocument = async () => {
    if (!docToBeShared || !passcode) return;
    const res = await DocumentUnshareBuilder().addDocumentId(docToBeShared._id).addPasscode(passcode).PATCH(sessionId);
    if (!res.success) {
      error.message = res.message;
      error.detail = res.detail;
      return;
    }
    docToBeShared = null;
    passcode = null;
  };

  const toggleShareability = (doc: Document): boolean => {
    docToBeShared = { ...doc, isShared: !doc.isShared };
    return docToBeShared.isShared;
  };
  const viewSharedDocument = (doc: Document) => {
    window.open(`/shared/${doc._id}`, '_blank');
  };
  const retrieveDocument = (doc: Document) => {
    dispatch('get-document', doc);
  };
  const revertShareability = () => {
    if (!docToBeShared || !allDocs) return;

    allDocs = allDocs.map((doc) => {
      if (doc._id === (docToBeShared as Document)._id) {
        return { ...doc, isShared: !(docToBeShared as Document).isShared, };
      }
      return doc;
    })
    docToBeShared = null;
    passcode = null;
  };
</script>

<!-- <template> -->
  {#if !!allDocs && allDocs.length > 0}
    <table class="docsInfoWrapper hover">
      <thead>
        <th class="left_aligned">Recently modified</th>
        <th class="left_aligned">Modified</th>
        <th class="centred">Word counts</th>
        <th class="centred" />
      </thead>
      <tbody>
        {#each allDocs as doc}
          <tr class="row" on:click={() => { retrieveDocument(doc); }}>
            <td class="col left_aligned" style="width: 500px;">{doc.title}</td>
            <td class="col left_aligned">
              <span>
                {getDateDiff(new Date().getTime(), new Date(doc.updated_at).getTime())}
                <ToolTip
                  text={`
                    <div style="display: flex; flex-direction: column; gap: calc(var(--margin) / 2);
                      font-size: calc(var(--type-body-size) - var(--border-width));">
                      <span>
                        <strong>Modified</strong> ${new Date(doc.updated_at).toLocaleString(window.navigator.language)}
                      </span>
                      <span>
                        <strong>Created</strong> ${new Date(doc.created_at).toLocaleString(window.navigator.language)}
                      </span>
                    </div>
                  `}
                  options={{ allowHTML : true, animation : 'scale', placement: 'left-end' }} />
              </span>
            </td>
            <td class="col centred">{doc.words}</td>
            <td class="col centred" style="width: 75px;">
              <div class="icons">
                <span
                  title={doc.isShared ? 'This document is shared' : 'This document is not shared'}
                  style="cursor: pointer;"
                  on:click|stopPropagation={() => { doc.isShared = toggleShareability(doc); }}>
                  <Icon name={doc.isShared ? 'unlock' : 'lock'} />
                </span>
                {#if doc.isShared}
                  <span
                    title="Click to view this document"
                    style="cursor: pointer;"
                    on:click|stopPropagation={() => { viewSharedDocument(doc); }}>
                    <Icon name="view" />
                  </span>
                {/if}
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <div class="noDoc">No saved documents to display</div>
  {/if}

  {#if !!docToBeShared}
    <Modal
      title={`${docToBeShared.isShared ? 'Share' : 'Unshare'} <i>${docToBeShared.title}</i>`}
      style="max-width: 25em; min-height: 5em;"
      backgroundClose
      on:close={() => { revertShareability(); }}>
      <form class="sharePrompt" on:submit|preventDefault>
        <label for="passcode">
          Passcode
          <input type="password" required minlength="6" bind:value={passcode} />
        </label>

        <Button type="secondary" on:click={() => {
          if (!docToBeShared) return;
          if (docToBeShared.isShared) {
            shareDocument();
            return;
          }
          unshareDocument();
        }}>
          <div style="display: flex; align-items: center; gap: calc(var(--margin) / 2);">
            <Icon name={docToBeShared.isShared ? 'share' : 'lock'} />
            {docToBeShared.isShared ? 'Share' : 'Unshare'}
          </div>
        </Button>
      </form>
      {#if (!!error.message || !!error.detail)}
        <p class="inlineErrorMes">{error.message}</p>
      {/if}
    </Modal>
  {/if}
<!-- </template> -->

<style>
  .docsInfoWrapper,
  .noDoc {
    margin-top: var(--margin);
    font-size: calc(var(--type-body-size) - var(--border-width));
  }

  .docsInfoWrapper {
    position: relative;
    width: 100%;
  }

  .docsInfoWrapper thead {
    opacity: .7;
  }

  .docsInfoWrapper tbody {
    opacity: .5;
  }

  .left_aligned {
    text-align: left;
  }
  .centred {
    text-align: center;
  }

  .noDoc {
    opacity: .75;
  }

  .icons {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: calc(var(--margin) / 2);
  }

  form.sharePrompt {
    position: relative;
    width: 100%;
    display: flex;
    /* flex-direction: column; */
    justify-content: space-between;
    align-items: center;
    margin-top: var(--margin);
  }

  form.sharePrompt label {
    flex-direction: row;
    align-items: center;
    gap: var(--margin);
    /* margin-bottom: var(--margin); */
  }

  .inlineErrorMes {
    margin: var(--margin) var(--margin) 0 0;
    font-size: calc(var(--type-body-size) + var(--border-width));
    color: var(--color-error-foreground);
  }
</style>
