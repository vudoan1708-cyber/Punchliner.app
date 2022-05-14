<script lang="ts">
  import TextEditor from "./lib/TextEditor.svelte";
  import ControlsUI from "./lib/ControlsUI/ControlsUI.svelte";

  // Type
  import type { Control } from './lib/ControlsUI/ControlsUI';

  const controls: Control = [
    {
      lookUpName: 'hide',
      title: 'Hide',
    },
  ];
</script>

<main>
  <section id="wrap">
    <TextEditor />
  </section>

  <section id="controls_wrap">
    <ControlsUI {controls} />
  </section>
</main>

<style>
  main {
    position: relative;
    margin: 0 auto 0 auto;
    padding: 50px 0 0 0;
    width: 800px;
  }

  #wrap {
    position: relative;
    width: 100%;
    padding: var(--padding) 0;
    border-top: 1px solid #003300;
    border-bottom: 1px solid #003300;
  }

  #controls_wrap {
    position: relative;
    width: 100%;
  }
</style>
