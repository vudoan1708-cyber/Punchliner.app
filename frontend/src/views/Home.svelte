<script lang="ts">
  import { navigate } from 'svelte-navigator';

  import Button from '../components/Button.svelte';

  const goToRegisterScreen = () => {
    navigate('/account/register');
  };
</script>

<!-- <template> -->
  <h2>Homepage</h2>
  <Button on:click={goToRegisterScreen}>Register for free</Button>
<!-- </template> -->
