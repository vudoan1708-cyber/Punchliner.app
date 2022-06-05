<script lang="ts">
  import Button from "../../components/Button.svelte";
</script>

<!-- <template> -->
  <form on:submit|preventDefault>
    <h3>Create a new account</h3>
    <div class="form_content">
      <label for="email">
        Email
        <input id="email" type="text" />
      </label>
      <label for="pwd">
        Password
        <input id="pwd" type="password" />
      </label>
      <label for="retype">
        Re-type Password
        <input id="retype" type="password" />
      </label>
    </div>

    <Button type="secondary">Register</Button>
    <Button type="secondary">Cancel</Button>
  </form>
<!-- </template> -->

<style>
  .form_content {
    position: relative;
    margin-bottom: calc(var(--margin) * 3);
    display: flex;
    flex-direction: column;
    gap: var(--margin);
  }
</style>
