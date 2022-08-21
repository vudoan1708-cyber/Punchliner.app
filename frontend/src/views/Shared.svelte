<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';

  import Loading from '../components/Loading.svelte';

  //  API
  import { DocumentQueryBuilder } from '../API/DAPI';

  // Type
  import type { Error } from '../types/Error';
  import type { Document } from '../types/Document';

  // Utility
  import { cookiestore } from '../helper/storage';

  export let documentId: string = null;

  const error: Error = {
    message: '',
    detail: '',
  };
  let document: Document;
  let sharedRef: HTMLDivElement | void = null;
  let loading: boolean = false;
  onMount(async () => {
    loading = true;
    const sessionId = cookiestore.get('session');
    const res = await DocumentQueryBuilder().addDocumentId(documentId).GET(sessionId);
    if (!res.success) {
      error.message = res.message;
      error.detail = res.detail;
      return;
    }
    loading = false;
    document = res.data.document;
  });

  afterUpdate(() => {
    if (!!sharedRef && sharedRef.childNodes.length > 2) {
      const nodes = sharedRef.querySelectorAll('.hide');
      nodes.forEach((node) => {
        node.classList.replace('hide', 'shared-hide');
      });
    }
  });
</script>

<!-- <template> -->
  <div id="shared" bind:this={sharedRef}>
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
</style>
