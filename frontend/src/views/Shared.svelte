<script lang="ts">
  import { onMount } from 'svelte';

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
  onMount(async () => {
    const sessionId = cookiestore.get('session');
    const res = await DocumentQueryBuilder().addDocumentId(documentId).GET(sessionId);
    if (!res.success) {
      error.message = res.message;
      error.detail = res.detail;
      return;
    }
    document = res.data.document;
    console.log(document);
  });
</script>

<!-- <template> -->
  <div class="shared">
    {#if !!document}
      <h2>{document.title}</h2>
      <p>{@html document.content}</p>
    {:else}
      No Content to display
    {/if}
  </div>
<!-- </template> -->

<style>
  :global(.hide) {
    cursor: not-allowed;
  }

  :global(.hide:hover) {
    filter: blur(2px);
    background-color: var(--color-primary);
    color: transparent;
  }
</style>
