<script>
  import Button from "./Button.svelte";
  import Icon from "./Icon/Icon.svelte";
</script>

<!-- <template> -->
  <Button href="https://www.buymeacoffee.com/punchlinerapp" style="background-color: #ff8800; border-color: #ff8800;">
    <div class="btn_wrapper">
      <Icon name="buymeacoffee" />
      Buy me a coffee
    </div>
  </Button>
<!-- </template> -->

<style>
  .btn_wrapper {
    display: flex;
    align-items: center;
    gap: calc(var(--margin) / 2);
  }
</style>
