<script lang="ts">
  import { onMount } from 'svelte';

  import { navigate } from 'svelte-navigator';

  import Modal from '../components/Modal.svelte';
  import Button from '../components/Button.svelte';

  // Type
  import type { Error } from '../types/Error';

  type Message = Error;
  const message: Message = {
    message: '',
    detail: '',
  };

  const goToRegisterScreen = () => {
    navigate('/account/register');
  };

  // Life Cycle
  onMount(() => {
    const { search } = window.location;
    if (!search.includes('message')) return;
    message.message = decodeURI(search.split('=')[1]);
  });
</script>

<!-- <template> -->
  <section id="Home">
    <h2>Welcome to Punchliner</h2>
    <Button on:click={goToRegisterScreen}>Register for free and start writing</Button>
    <p class="login_link">Already a member? <a href="/account/login"><u><i>Sign in.</i></u></a></p>
    <br /><br />
    <div class="features">
      <div>
        <h3>Shareable documents with password protection</h3>
        <p>Written documents can be shared using a secure link and password protection.
          Only users who have a Punchliner's account and the password can get access to the shared documents.</p>
      </div>
      <div>
        <h3>Safe and secure automatic backups</h3>
        <p>We know how important your writing is. Multiple revisions of every document
          are saved automatically as you write so you can go back to your document as it existed a day, a week, or years ago.</p>
      </div>
      <div>
        <h3>Hidden text</h3>
        <p>We take pride in one of the main features of Punchliner, which also led to the birth of the application
          and that is the ability to display and hide text on demand.</p>
      </div>
      <div>
        <h3>Pricing</h3>
        <p>Punchliner is free to use. Create a new account and start writing immediately with no credit card required.</p>
      </div>
    </div>

    {#if !!message.message || !!message.detail}
      <Modal
        title="Message"
        style="min-height: 5em;"
        backgroundClose
        on:close={() => { message.message = null; message.detail = null; }}>
        <div>{message.message}</div>
      </Modal>
    {/if}
  </section>
<!-- </template> -->

<style>
  section#Home {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: calc(var(--margin) * 3);
    max-width: 900px;
  }

  div.features {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--margin);
    text-align: left;
  }
  div.features h3,
  div.features p {
    margin: var(--margin);
  }
</style>
