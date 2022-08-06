<script lang="ts">
  import Login from '../lib/Account/Login.svelte';
  import Register from '../lib/Account/Register.svelte';

  export let accessActivity: string = 'login';
  console.log(accessActivity)
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
