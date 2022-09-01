<script lang="ts">
  import { navigate } from 'svelte-navigator';

  import Button from '../../components/Button.svelte';
  import Loading from '../../components/Loading.svelte';
  import Modal from '../../components/Modal.svelte';

  // API
  import { RegisterBuilder } from '../../API/Account';

  // Utilities
  import { cookiestore } from '../../helper/storage';
  import { goToHomepage } from '../../helper/utilities';

  // Type
  import type { Error } from '../../types/Error';

  let email: string|null = null;
  let password: string|null = null;
  let confirm: string|null = null;

  // DOM Refs
  let passwordRef: HTMLInputElement|null = null;
  let confirmRef: HTMLInputElement|null = null;

  let loading: boolean = false;

  const error: Error = {
    message: '',
    detail: '',
  }

  // Event Handler
  const goToLoginScreen = async (): Promise<void> => {
    let bearer: string|null = null;

    if (disabled || password.length < passwordRef.minLength || confirm.length < confirmRef.minLength) return;

    loading = true;

    try {
      const response = await RegisterBuilder()
        .addRequestBody({ email, password, confirm })
        .POST();
      if (!response.success) {
        error.message = response.message;
        error.detail = response.detail;
        return;
      };

      ({ bearer } = response.data);
      cookiestore.set({ name: 'session', value: bearer });
      cookiestore.set({ name: 'userEmail', value: email });

      const message = 'Congratulations! You have just created a new account. \nPlease login using the newly created credentials';
      navigate(`/account/login?message=${encodeURIComponent(message)}`, { replace: false });
    } catch (err) {
      error.message = err.message;
      error.detail = err.detail;
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

    <p class="login_link">Already a member? <a href="/account/login"><u><i>Sign in.</i></u></a></p>

    <div>
      <Button id="register" {disabled} on:click={goToLoginScreen}>Register</Button>
      <Button id="cancel" type="secondary" on:click={goToHomepage}>Cancel</Button>
    </div>

    {#if loading}
      <Loading />
    {/if}
  </form>

  {#if !!error.message || !!error.detail}
    <Modal
      title="Message"
      style="min-height: 6em;"
      backgroundClose
      on:close={() => { error.message = null; error.detail = null; }}>
      <div>{error.message}</div>
    </Modal>
  {/if}
<!-- </template> -->

<style>
  form {
    position: relative;
    width: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: var(--padding);
    border: var(--border-width) solid var(--color-primary);
    border-radius: var(--border-radius);
  }

  form h2 {
    position: relative;
    width: 100%;
    margin-top: 0;
    text-align: center;
    background-color: var(--color-primary);
    color: var(--color-on-primary);
  }

  .form_content {
    position: relative;
    margin-bottom: calc(var(--margin) * 3);
    display: flex;
    flex-direction: column;
    gap: var(--margin);
  }

  p.login_link {
    position: relative;
    margin: var(--margin);
    margin-bottom: calc(var(--margin) * 2);
    text-align: center;
    font-size: var(--type-body-size);
  }
</style>
