<script lang="ts">
  import { onMount } from 'svelte';

  import { cookiestore } from '../helper/storage';

  let userEmail: string | void = '';
  onMount(() => {
    userEmail = cookiestore.get('userEmail');
  });
</script>

<!-- <template> -->
  <div class="infoSection">
    <div class="userEmail">{userEmail}</div> |
    <u class="logout" title="Click to log out"><i>Logout</i></u>
  </div>
<!-- </template> -->

<style>
  .infoSection {
    display: flex;
    gap: var(--margin);
    margin-top: var(--margin);
    font-size: calc(var(--type-body-size) - var(--border-width));
    opacity: 0.5;
    transition: .5s opacity;
  }

  .infoSection:hover {
    opacity: 1;
  }
  .infoSection:hover .logout {
    opacity: .75;
  }

  .logout {
    cursor: pointer;
  }
</style>
