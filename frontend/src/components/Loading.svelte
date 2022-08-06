<script lang="ts">
  import Logo from '../assets/punchlinerappLogo.png';

  export let inline: boolean = false;
</script>

<!-- <template> -->
  <div class="loader" class:inline>
    <img alt="spinning logo" src={Logo} />
  </div>
<!-- </template> -->

<style>
  .loader {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .75);
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
  }

  .loader.inline {
    display: inline-block;
  }

  img {
    position: absolute;
    width: 100px;
    /* top: 0;
    left: 0;
    bottom: 0;
    right: 0; */
    display: block;
    -webkit-animation: rotation 0.8s linear infinite;
    animation: rotation 0.8s linear infinite;
  }

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
</style>
