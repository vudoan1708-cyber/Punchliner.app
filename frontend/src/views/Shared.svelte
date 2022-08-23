<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import { navigate } from 'svelte-navigator';

  import Loading from '../components/Loading.svelte';
  import Modal from '../components/Modal.svelte';
  import Button from '../components/Button.svelte';
  import Icon from '../components/Icon/Icon.svelte';

  //  API
  import { DocumentViewShared } from '../API/DAPI';

  // Type
  import type { Error } from '../types/Error';
  import type { Document } from '../types/Document';

  // Utility
  import { cookiestore } from '../helper/storage';

  import punchlinerappLogo from '../assets/punchlinerappLogo.png';

  export let documentId: string = null;

  const passcode: {
    required: boolean;
    code: string;
    times: number;
  } = {
    required: false,
    code: '',
    times: 0,
  };

  const goToHomepage = (): void => {
    navigate('/');
  };

  const error: Error = {
    message: '',
    detail: '',
  };
  let document: Document;
  let sharedRef: HTMLDivElement | void = null;
  let passcodeRef: HTMLInputElement | void = null;
  let loading: boolean = false;

  const reset = () => {
    error.message = '';
    error.detail = '';
    passcode.required = false;
  }

  const viewSharedDoc = async () => {
    reset();

    passcode.times += 1;

    loading = true;
    try {
      const sessionId = cookiestore.get('session');
      const res = await DocumentViewShared().addDocumentId(documentId).addPasscode(passcode.code).POST(sessionId);

      // This is to show a modal for filling in a passcode on an error message in a modal component
      if (!res.success && res.passcodeRequired) {
        passcode.required = res.passcodeRequired;
        error.message = res.message;
        error.detail = res.detail;
      }
      // This is to show error message in a modal component
      if (!res.success) {
        error.message = res.message;
        error.detail = res.detail;
        return;
      }

      document = res.data.document;
      passcode.times = 0;
    } catch (err) {
      error.message = err.message;
      error.detail = err.detail;
    } finally {
      loading = false;
      passcode.code = '';
    }
  };

  onMount(() => {
    viewSharedDoc();
  });

  afterUpdate(() => {
    if (!!sharedRef) {
      const nodes = sharedRef.querySelectorAll('.hide');
      nodes.forEach((node) => {
        node.classList.replace('hide', 'shared-hide');
      });
    }
  });

  $: if (!!passcodeRef) {
      passcodeRef.focus();
    }
</script>

<!-- <template> -->
  <div id="shared" class:blured={passcode.times > 0} bind:this={sharedRef}>
    <header class="appLogo" title="Back to Homepage" on:click={goToHomepage}>
      <img src={punchlinerappLogo} alt="app logo" />
      <h2>unchliner app</h2>
    </header>
    {#if !!document}
      <h2>{document.title}</h2>
      <div>{@html document.content}</div>
    {:else if loading}
      <Loading />
    {:else}
      No Content to display
    {/if}

    <!-- Modal for passcode -->
    {#if (!!error.message || !!error.detail) && !passcode.required}
      <Modal title="Message" style="min-height: 3em;" hideClose>
        <p style="margin: var(--margin) 0;">{error.message}</p>
      </Modal>
    {:else if passcode.required}
      <Modal title="Message" style="min-height: 7em;" hideClose>
        <p style="font-size: calc(var(--type-body-size));">This document requires a passcode before it can be revealed to you.
          Please enter the passcode that is shared to you from the document's owner</p>
        <form class="passcodeForm" on:submit|preventDefault>
          <label for="passcode">
            Passcode
            <input type="password" minlength="6" bind:value={passcode.code} bind:this={passcodeRef} />
          </label>

          <Button
            style={`height: fit-content; align-self: flex-end; display: flex;
              align-items: center;
              gap: calc(var(--margin) / 2);`}
            disabled={!passcode.code}
            on:click={() => {
              if (passcode.code.length < 6) return;
              viewSharedDoc();
            }}>
              <Icon name="check" />
              OK
          </Button>
        </form>

        {#if (!!error.message || !!error.detail) && passcode.times > 1}
          <p class="inlineErrorMes">{error.message}</p>
        {/if}
      </Modal>
    {/if}
  </div>
<!-- </template> -->

<style scoped>
  :global(.shared-hide) {
    filter: blur(2px);
    background-color: var(--color-primary);
    color: transparent;
    cursor: not-allowed;
  }

  #shared.blured {
    filter: blur(5px);
  }

  h2 {
    margin-bottom: var(--margin);
  }

  .appLogo {
    position: relative;
    width: fit-content;
    display: flex;
    padding: var(--padding);
    border-radius: var(--border-radius);
    background-color: var(--color-neutral-800);
    margin-bottom: calc(var(--margin) * 4);
    cursor: pointer;
  }

  .appLogo:hover {
    filter: grayscale(20%);
  }

  .appLogo img {
    position: relative;
    width: 50px;
  }
  
  form.passcodeForm {
    display: flex;
    justify-content: space-between;
  }

  .inlineErrorMes {
    margin: var(--margin) var(--margin) 0 0;
    font-size: calc(var(--type-body-size) + var(--border-width));
    color: var(--color-error-foreground);
  }
</style>
