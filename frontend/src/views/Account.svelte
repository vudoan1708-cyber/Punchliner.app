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
    height: 100%;
    display: flex;
    justify-content: center;
  }
</style>
