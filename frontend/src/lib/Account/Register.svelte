<script lang="ts">
  import { navigate } from 'svelte-navigator';

  import Button from '../../components/Button.svelte';
  import Loading from '../../components/Loading.svelte';

  // API
  import { RegisterBuilder } from '../../API/Account';

  // Utilities
  import { cookiestore } from '../../helper/storage';
  import { goToHomepage } from '../../helper/utilities';

  let email: string|null = null;
  let password: string|null = null;
  let confirm: string|null = null;

  // DOM Refs
  let passwordRef: HTMLInputElement|null = null;
  let confirmRef: HTMLInputElement|null = null;

  let loading: boolean = false;

  // Event Handler
  const goToLoginScreen = async (): Promise<void> => {
    let bearer: string|null = null;

    if (disabled || password.length < passwordRef.minLength || confirm.length < confirmRef.minLength) return;

    loading = true;

    try {
      const response = await RegisterBuilder()
        .addRequestBody({ email, password, confirm })
        .POST();
      if (!response.success) return;

      ({ bearer } = response.data);
      cookiestore.set({ name: 'session', value: bearer });

      const message = 'Congratulations! You have just created a new account. \nPlease login using the newly created credentials';
      navigate(`/account/login?message=${encodeURIComponent(message)}`, { replace: false });
    } catch (err) {
      console.error(err);
    } finally {
      loading = false;
    }
  };

  $: disabled = !email || !password || !confirm || password !== confirm;
</script>

<!-- <template> -->
  <form on:submit|preventDefault>
    <h2>Create a new account</h2>
    <div class="form_content">
      <label for="email">
        Email
        <input id="email" type="email" required bind:value={email} />
      </label>
      <label for="pwd">
        Password
        <input
          id="pwd"
          type="password"
          minlength="6"
          required
          bind:this={passwordRef}
          bind:value={password} />
      </label>
      <label for="retype">
        Re-type Password
        <input
          id="retype"
          type="password"
          minlength="6"
          required
          bind:this={confirmRef}
          bind:value={confirm} />
      </label>
    </div>

    <div>
      <Button id="register" {disabled} on:click={goToLoginScreen}>Register</Button>
      <Button id="cancel" type="secondary" on:click={goToHomepage}>Cancel</Button>
    </div>

    {#if loading}
      <Loading />
    {/if}
  </form>
<!-- </template> -->

<style>
  form {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .form_content {
    position: relative;
    margin-bottom: calc(var(--margin) * 3);
    display: flex;
    flex-direction: column;
    gap: var(--margin);
  }
</style>
