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

  type Message = Error;
  const message: Message = {
    message: null,
    detail: null,  
  };

  // DOM Ref
  let passwordRef: HTMLInputElement = null;

  // Event Handler
  const goToEditor = async (): Promise<void> => {
    let bearer: string|null = null;
    let userId: string|null = null;
    let userEmail: string|null = null;
    let userType: string|null = null;

    if (disabled || password.length < passwordRef.minLength) return;

    loading = true;

    try {
      const response = await LoginBuilder()
        .addRequestBody({ email, password })
        .POST();
      if (!response.success) {
        message.message = response.message;
        message.detail = response.detail;
        return;
      }

      ({ bearer } = response.data);
      userId = response.data.user._id;
      userEmail = response.data.user.email;
      userType = response.data.user.type;
      cookiestore.set({ name: 'session', value: bearer });
      cookiestore.set({ name: 'userId', value: userId });
      cookiestore.set({ name: 'userEmail', value: userEmail });
      cookiestore.set({ name: 'premium', value: userType });

      navigate('/editor', { replace: false });
    } finally {
      loading = false;
    }
  };

  // Life Cycles
  onMount(() => {
    const { search } = window.location;
    if (!search.includes('message')) return;
    message.message = decodeURI(search.split('=')[1]);
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

    <p class="register_link">Not a member? <a href="/account/register"><u><i>Register your account here.</i></u></a></p>

    <div>
      <Button id="register" {disabled} on:click={goToEditor}>Login</Button>
      <Button id="cancel" type="secondary" on:click={goToHomepage}>Cancel</Button>
    </div>

    {#if loading}
      <Loading />
    {/if}
  </form>

  {#if !!message.message || !!message.detail}
    <Modal
      title="Message"
      style={message.message.length < 61 ? 'min-height: 5em;' : 'min-height: 6em;'}
      backgroundClose
      on:close={() => { message.message = null; message.detail = null; }}>
      <div>{message.message}</div>
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

  p.register_link {
    position: relative;
    margin: var(--margin);
    margin-bottom: calc(var(--margin) * 2);
    text-align: center;
    font-size: var(--type-body-size);
  }
</style>
