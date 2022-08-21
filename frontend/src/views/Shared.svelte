<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import { navigate } from 'svelte-navigator';

  import Loading from '../components/Loading.svelte';

  //  API
  import { DocumentQueryBuilder } from '../API/DAPI';

  // Type
  import type { Error } from '../types/Error';
  import type { Document } from '../types/Document';

  // Utility
  import { cookiestore } from '../helper/storage';

  import punchlinerappLogo from '../assets/punchlinerappLogo.png';

  export let documentId: string = null;

  let passcode: string = null;

  const goToHomepage = (): void => {
    navigate('/');
  };

  const error: Error = {
    message: '',
    detail: '',
  };
  let document: Document;
  let sharedRef: HTMLDivElement | void = null;
  let loading: boolean = false;
  onMount(async () => {
    loading = true;
    try {
      const sessionId = cookiestore.get('session');
      const userId = cookiestore.get('userId');
      const res = await DocumentQueryBuilder().addDocumentId(documentId).GET(sessionId);
      if (!res.success) {
        error.message = res.message;
        error.detail = res.detail;
        return;
      }
      document = res.data.document;
    } catch (err) {
      error.message = err.message;
      error.detail = err.detail;
    } finally {
      loading = false;
    }
  });

  afterUpdate(() => {
    if (!!sharedRef) {
      const nodes = sharedRef.querySelectorAll('.hide');
      nodes.forEach((node) => {
        node.classList.replace('hide', 'shared-hide');
      });
    }
  });
</script>

<!-- <template> -->
  <div id="shared" bind:this={sharedRef}>
    <div class="appLogo" title="Back to Homepage" on:click={goToHomepage}>
      <img src={punchlinerappLogo} alt="app logo" />
      <h2>unchliner app</h2>
    </div>
    {#if !!document}
      <h2>{document.title}</h2>
      <div>{@html document.content}</div>
    {:else if loading}
      <Loading />
    {:else}
      No Content to display
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
</style>
