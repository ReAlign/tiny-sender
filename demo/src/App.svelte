<script>
  import TinySender from './../../dist/tiny-sender.module';
  import axios from 'axios';

  export const name = 'ReAlign';
  export const url = 'https://nei.netease.com/api/apimock-v2/81167d00d866ed824b3b9025a2aeb9b9/demo/get';
  export const tinySender = new TinySender();
  const getData = async () => {
    try {
      const a = await tinySender.get(url);
      const x = JSON.stringify(a, null, 2);
      // tinySender.notify.tips(x, 'simple');
      return x;
    } catch(err) {
      console.log(err);
    }
  };
</script>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  .m-res {
    width: 200px;
    margin: 0 auto;
    padding: 12px;
    text-align: left;
    background-color: tomato;
    border-radius: 3px;
    color: white;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<main>
  <h1>Hello {name}!</h1>
  <button on:click={getData}>GetData</button>
  {#await getData()}
    <p>...waiting</p>
  {:then xx}
    <div class="m-res">
      <pre>{xx}</pre>
    </div>
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
</main>
