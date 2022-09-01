<script lang="ts">
  import { navigate } from 'svelte-navigator';

  import Button from '../components/Button.svelte';
  import Icon from '../components/Icon/Icon.svelte';

  import punchlinerappLogo from '../assets/punchlinerappLogo.png';

  // Utility
  import { cookiestore } from '../helper/storage';

  // Event Handler
  const goToLogin = () => {
    cookiestore.removeAll();
    const message = 'Please log back in again to activate the Premium features';
    navigate(`/account/login?message=${encodeURIComponent(message)}`, { replace: true });
  };
</script>

<!-- <template> -->
  <div id="Checkout">
    <header class="appLogo" title="Back to Homepage">
      <img src={punchlinerappLogo} alt="app logo" />
      <h2>unchliner app</h2>
    </header>
    
    <h3 style="margin-bottom: var(--margin);">Thank you for your subscription!</h3>
    <p style="margin: var(--margin) 0;">You are now a PREMIUM member. Enjoy!</p>

    <Button type="secondary" style="margin-top: calc(var(--margin) * 2);" on:click={goToLogin}>
      <div style="display: flex; align-items: center; gap: calc(var(--margin) / 2);">
        <Icon name="arrow-left" />
        You need to log back in to re-activate the account
      </div>
    </Button>
  </div>
<!-- </template> -->

<style>
  #Checkout {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  h2 {
    margin-bottom: var(--margin);
  }

  .appLogo {
    position: relative;
    width: fit-content;
    display: flex;
    padding: var(--padding);
    border-radius: var(--border-radius);
    background-color: var(--color-neutral-800);
    margin-bottom: calc(var(--margin) * 4);
  }

  .appLogo img {
    position: relative;
    width: 50px;
  }
</style>
