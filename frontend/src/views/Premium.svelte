<script lang="ts">
  import { navigate } from "svelte-navigator";

  import Button from "../components/Button.svelte";
  import Modal from "../components/Modal.svelte";
  import Loading from "../components/Loading.svelte";
  import Icon from "../components/Icon/Icon.svelte";

  // API
  import { PaymentCheckoutBuilder } from '../API/PAPI';

  // Utility
  import { cookiestore } from "../helper/storage";

  // Type
  import type { Error } from '../types/Error';

  // Event Handler
  const goToHomepage = () => {
    navigate('/');
  };

  const error: Error = {
    message: '',
    detail: '',
  }
  let loading: boolean = false;
  const redirectToStripe = async () => {
    loading = true;
    const token = cookiestore.get('session');
    try {
      const res = await PaymentCheckoutBuilder().GET(token);
      if (!res.success) {
        error.message = res.message;
        return;
      };

      window.location.href = res.data;
    } catch (err) {
      error.message = err.message;
      error.detail = err.detail;
    } finally {
      loading = false;
    }
  };
</script>

<!-- <template> -->
  <section id="Premium">
    <header>
      <h2>Upgrade to Premium - Enjoy the new perks and write much better jokes today</h2>
      <div class="backBtn" on:click={goToHomepage}>
        <Icon name="arrow-left" />
        <u>Go back</u>
      </div>
    </header>

    <div style="text-align: center; margin-top: calc(var(--margin) * 4);">
      <Button id="upgrade" on:click={redirectToStripe}>Upgrade Now with only $3.00</Button>
    </div>

    <div class="body_content">
      <p>With only <u><i>$3.00 / month</i></u>, you will have access to some of the below Premium exclusive features</p>

      <div class="pointer">
        <h3>
          <Icon name="star" />
          Shareable documents with password protection
        </h3>
        <p>You can share your documents with friends with no hassle at all.<br />
          Written documents can be shared using a secure link and password protection.
          Only users who have the unique link and the shared password from the owner can get access to the shared documents.</p>
      </div>
      <div class="pointer">
        <h3>
          <Icon name="star" />
          Multiple Document Creation
        </h3>
        <p>Only one document, How lame!!!<br />
          With a Premium account, you can create an unlimited number of documents as you wish,
           make them more organised, categorised and unique to their own.</p>
      </div>
    </div>
  </section>

  {#if loading}
    <Loading />
  {/if}

  {#if !!error.message || !!error.detail}
    <Modal
      title="Error"
      style="min-height: 5em;"
      backgroundClose
      on:close={() => { error.message = ''; error.detail = ''; }}>
      <div>{error.message}</div>
    </Modal>
  {/if}
<!-- </template> -->

<style>
  section#Premium {
    display: flex;
    flex-direction: column;
    margin-top: calc(var(--margin) * 5);
    max-width: 900px;
  }

  .backBtn {
    display: flex;
    align-items: center;
    gap: calc(var(--margin) / 2);
    font-size: var(--type-body-size);
    cursor: pointer;
  }

  .body_content {
    margin-top: calc(var(--margin) * 3);
  }

  .body_content > p {
    margin: calc(var(--margin) * 2) 0 calc(var(--margin) * 5) 0;
  }

  div.pointer > p {
    margin-left: calc(var(--margin)  * 3);
  }
</style>
