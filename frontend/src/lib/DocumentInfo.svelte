<script lang="ts">
  export let allDocs: Array<any> | void = null;

  $: console.log(allDocs);
</script>

<!-- <template> -->
  {#if !!allDocs}
    <table class="docsInfoWrapper">
      <thead>
        <th>Recently modified</th>
        <th>Modified</th>
        <th>Word counts</th>
        <th>Shared</th>
      </thead>
      <tbody>
        {#each allDocs as doc}
          <tr class="row">
            <td class="col">
    
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <div>No saved documents to display</div>
  {/if}
<!-- </template> -->

<style>
  .docsInfoWrapper {
    margin-top: var(--margin);
    font-size: calc(var(--type-body-size) - var(--border-width));
  }

  .docsInfoWrapper thead {
    opacity: .7;
  }

  .docsInfoWrapper tbody {
    opacity: .5;
  }
</style>
