<script>
  import TinySender from "./../../dist/tiny-sender.module";
  export const name = "ReAlign";
  export const url =
    "https://nei.netease.com/api/apimock-v2/4ae972b2dabf76b8e92ff52eb5e49441/api/todos/";

  const blockAfter = async (o) => {
    const {
      json,
      TS,
    } = o;

    if(json.code === 200) {
      TS.Notify.success('sss');
    }

    return json;
  };
  const tinySender = new TinySender({ blockAfter, });
  const getData = async () => {
    try {
      const a = await tinySender.get(url);
      const x = JSON.stringify(a, null, 2);
      return x;
    } catch (err) {
      console.log(err);
    }
  };
</script>

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

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 640px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  .m-res {
    width: 640px;
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
