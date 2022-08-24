<script lang="ts">
  import { onMount } from 'svelte';

  import { navigate } from 'svelte-navigator';

  import { cookiestore } from '../helper/storage';

  const logOut = () => {
    cookiestore.removeAll();

    const message = 'You have just successfully logged out!';
    navigate(`/?message=${encodeURIComponent(message)}`);
  };

  let userEmail: string | void = '';
  onMount(() => {
    userEmail = cookiestore.get('userEmail');
  });
</script>

<!-- <template> -->
  <div class="infoSection">
    <div class="userEmail">{userEmail}</div> |
    <u class="logout" title="Click to log out" on:click={logOut}><i>Logout</i></u>
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
