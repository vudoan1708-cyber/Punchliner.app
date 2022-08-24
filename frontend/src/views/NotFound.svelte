<script lang="ts">
  import { navigate } from 'svelte-navigator';

  import { cookiestore } from '../helper/storage';

  import Icon from '../components/Icon/Icon.svelte';

  const goToHomepage = () => {
    cookiestore.removeAll();
    navigate('/', { replace: true });
  };
</script>

<!-- <template> -->
  <section id="NotFound">
    <h2>Not Found</h2>
    <div>
      <p style="margin: calc(var(--margin));">Oh Nooooo!</p>
      <p style="margin: calc(var(--margin));">The URL entered does not exist.
        Try going back to the home page and starting from there. Or send a support email for help.</p>
    </div>
    <h4 role="button" title="Click to go back to the home page" on:click={goToHomepage}>
      <div class="wrap">
        <Icon name="arrow-left" />
        Home page
      </div>
    </h4>
  </section>
<!-- </template> -->

<style>
  section#NotFound {
    position: relative;
    width: 100%;
    max-width: 900px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  section#NotFound h4 {
    align-self: flex-start;
    text-decoration: underline;
    cursor: pointer;
  }

  h4 .wrap {
    display: flex;
    align-items: center;
    gap: calc(var(--margin));
  }
</style>
