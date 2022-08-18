<script lang="ts">
  import { onMount } from "svelte";
  import { navigate } from "svelte-navigator";

  import Button from "../../components/Button.svelte";
  import Loading from "../../components/Loading.svelte";
  import Modal from "../../components/Modal.svelte";

  // Type
  import type { Error } from '../../types/Error';

  // API
  import { LoginBuilder } from '../../API/Account';

  // Utilities
  import { goToHomepage } from '../../helper/utilities';
  import { cookiestore } from "../../helper/storage";

  let email: string|null = null;
  let password: string|null = null;

  let loading: boolean = false;
  const error: Error = {
    message: null,
    detail: null,  
  };

  // DOM Ref
  let passwordRef: HTMLInputElement = null;

  // Event Handler
  const goToEditor = async (): Promise<void> => {
    let bearer: string|null = null;
    let userId: string|null = null;

    if (disabled || password.length < passwordRef.minLength) return;

    loading = true;

    try {
      const response = await LoginBuilder()
        .addRequestBody({ email, password })
        .POST();
      if (!response.success) {
        error.message = response.message;
        error.detail = response.detail;
        return;
      }

      ({ bearer } = response.data);
      userId = response.data.user._id;
      cookiestore.set({ name: 'session', value: bearer });
      cookiestore.set({ name: 'userId', value: userId });

      navigate('/editor', { replace: false });
    } finally {
      loading = false;
    }
  };

  // Life Cycles
  onMount(() => {
    const { search } = window.location;
    if (!search.includes('message')) return;
    error.message = decodeURI(search.split('=')[1]);
  });

  $: disabled = !email || !password;
</script>

<!-- <template> -->
  <form on:submit|preventDefault>
    <h2>Login</h2>
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
    </div>

    <div>
      <Button id="register" {disabled} on:click={goToEditor}>Login</Button>
      <Button id="cancel" type="secondary" on:click={goToHomepage}>Cancel</Button>
    </div>

    {#if loading}
      <Loading />
    {/if}
  </form>

  {#if !!error.message || !!error.detail}
    <Modal
      title="Error"
      style="min-height: 5em;"
      backgroundClose
      on:close={() => { error.message = null; error.detail = null; }}>
      <div>{error.message}</div>
    </Modal>
  {/if}
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
