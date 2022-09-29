<script lang="ts">
  import { onMount } from 'svelte';
  import { navigate, Link } from 'svelte-navigator';
  
  import Modal from '../components/Modal.svelte';
  import Button from '../components/Button.svelte';
  import BuyMeACoffeeButton from '../components/BuyMeACoffeeButton.svelte';

  // Utility
  import { cookiestore } from '../helper/storage';
  
  // Type
  import type { Error } from '../types/Error';
  
  // Media
  import JOKEAPP_MP4 from '../assets/jokeapp.mp4';

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
    const session = cookiestore.get('session');
    if (!!session) navigate('/editor');

    const { search } = window.location;
    if (!search.includes('message')) return;
    message.message = decodeURI(search.split('=')[1]);
  });
</script>

<!-- <template> -->
  <section id="Home">
    <header>
      <h2>Welcome to Punchliner</h2>
      <p class="quote"><i>"Punchliner is the only joke writing app that blurs your punchlines"</i></p>
    </header>

    <Button on:click={goToRegisterScreen}>Register for free and start writing</Button>
    <p class="login_link">Already a member? <Link to="/account/login"><u><i>Sign in.</i></u></Link></p>
    
    <div id="demo">
      <!-- Buy me a coffee button should be here -->
      <BuyMeACoffeeButton />
      <!-- <p style="margin: var(--margin); font-size: var(--type-body-size); font-style: italic;">
        Have a look through our demo video to have a clue what our app is about
      </p> -->
      <video width="320" controls>
        <track kind="captions">
        <source src={JOKEAPP_MP4} type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </div>

    <br /><br />
    <div class="features">
      <div>
        <h3>Shareable documents with password protection</h3>
        <p>Written documents can be shared using a secure link and password protection.
          Only users who have the unique link and the shared password from the owner can get access to the shared documents.</p>
      </div>
      <div>
        <h3>Safe and secure automatic backups</h3>
        <p>We know how important your writing is. Multiple revisions of every document
          are saved automatically as you write so you can go back to your document as it existed a day, a week, or years ago.</p>
      </div>
      <div>
        <h3>Hidden text</h3>
        <p>We take pride in one of the main features of Punchliner, which also led to the birth of the application
          and that is the ability to display and hide text on demand.<br />
          This feature allows users to blur the punchlines when you're joke writing
          and leave it as a surprise when the hidden text is hovered on by someone else !!!</p>
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

  header {
    text-align: center;
  }

  header .quote {
    margin: calc(var(--margin) * 2) 0 calc(var(--margin) * 5) 0;
  }

  #demo {
    margin-top: calc(var(--margin) * 2);
    text-align: center;
  }

  #demo video {
    border: var(--border-width) solid var(--color-primary-light);
    border-radius: var(--border-radius);
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
