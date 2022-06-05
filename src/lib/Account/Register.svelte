<script lang="ts">
  import { navigate } from 'svelte-navigator';

  import Button from '../../components/Button.svelte';

  let email = null;
  let password = null;
  let retypedPassword = null;

  // Event Handler
  const goToHomepage = () => {
    navigate('/', { replace: false });
  };

  const goToLoginScreen = () => {
    if (!disabled) {
      navigate(`/account/login?id=${email}_${password}_${retypedPassword}`, { replace: false });
    }
  };

  $: disabled = !email || !password || !retypedPassword || password !== retypedPassword;
</script>

<!-- <template> -->
  <form on:submit|preventDefault>
    <h3>Create a new account</h3>
    <div class="form_content">
      <label for="email">
        Email
        <input id="email" type="email" required bind:value={email} />
      </label>
      <label for="pwd">
        Password
        <input id="pwd" type="password" minlength="10" required bind:value={password} />
      </label>
      <label for="retype">
        Re-type Password
        <input id="retype" type="password" minlength="10" required bind:value={retypedPassword} />
      </label>
    </div>

    <Button {disabled} on:click={goToLoginScreen}>Register</Button>
    <Button type="secondary" on:click={goToHomepage}>Cancel</Button>
  </form>
<!-- </template> -->

<style>
  .form_content {
    position: relative;
    margin-bottom: calc(var(--margin) * 3);
    display: flex;
    flex-direction: column;
    gap: var(--margin);
  }
</style>
