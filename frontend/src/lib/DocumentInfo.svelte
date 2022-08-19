<script lang="ts">
  import Icon from '../components/Icon/Icon.svelte';

  export let allDocs: Array<any> | void = null;

  const toggleShareability = (shareable: boolean): boolean => !shareable;
  const viewSharedDocument = (doc) => {
    console.log(`Navigate to the share URL with this document ${JSON.stringify(doc, null, 2)}`);
  };
  const getDateDiff = (today: number, date: number): string => {
    const daysInMonth = (month: number, year: number): number => new Date(year, month, 0).getDate();
    const pluralise = (num: number, str: string): string => {
      if (num > 1) return `${str}s`;
      return str;
    }

    const diffInDays = Math.floor((today - date) / (1000 * 3600 * 24));
    const numOfDays = daysInMonth(new Date().getMonth(), new Date().getFullYear());
    if (diffInDays > numOfDays) {
      const remainder = diffInDays % numOfDays;
      return pluralise(remainder, `${remainder} month`);
    }
    return pluralise(diffInDays, `${diffInDays} day`);
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
          <tr class="row">
            <td class="col left_aligned">{doc.title}</td>
            <td class="col left_aligned">
              {getDateDiff(new Date().getTime(), new Date(doc.updated_at).getTime())}
            </td>
            <td class="col centred">{doc.words}</td>
            <td class="col centred" style="width: 75px;">
              <div class="icons">
                <span
                  title={doc.isShared ? 'This document is shared' : 'This document is not shared'}
                  style="cursor: pointer;"
                  on:click={() => { doc.isShared = toggleShareability(doc.isShared); }}>
                  <Icon name={doc.isShared ? 'unlock' : 'lock'} />
                </span>
                {#if doc.isShared}
                  <span
                    title="Click to view this document"
                    style="cursor: pointer;"
                    on:click={() => { viewSharedDocument(doc); }}>
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
</style>
