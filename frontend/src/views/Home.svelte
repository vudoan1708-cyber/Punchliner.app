<script lang="ts">
  import { navigate } from 'svelte-navigator';

  import Button from '../components/Button.svelte';

  const goToRegisterScreen = () => {
    navigate('/account/register');
  };
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
          Only users who have the password can get access to the shared documents</p>
      </div>
      <div>
        <h3>Cover text features</h3>
      </div>
      <p></p>
    </div>
  </section>
<!-- </template> -->

<style>
  section#Home {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: calc(var(--margin) * 3);
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
