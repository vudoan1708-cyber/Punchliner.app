<script lang="ts">
  import Login from '../lib/Account/Login.svelte';
  import Register from '../lib/Account/Register.svelte';

  export let accessActivity: string = 'login';
</script>

<!-- <template> -->
  <div class="account_container">
    <!-- Register -->
    {#if accessActivity === 'register'}
      <Register />
    <!-- Login -->
    {:else}
      <Login />
    {/if}
  </div>
<!-- </template> -->

<style>
  div.account_container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
