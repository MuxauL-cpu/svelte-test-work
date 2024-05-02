<script>
  import { onMount } from 'svelte';

  // Популярные валюты
  const popularCurrencies = ['EUR', 'USD', 'CNY'];

  export let initialFromCurrency = 'RUB';
  export let initialToCurrency = 'USD';

  let currencyRates = {};
  let fromCurrency = initialFromCurrency;
  let toCurrency = initialToCurrency;
  let amountFrom = 1;
  let amountTo = 0;

  async function fetchData() {
    try {
      const response = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
      const data = await response.json();
      currencyRates = data.rates;
      calculate();
    } catch (error) {
      console.error('Не удалось получить курсы валют!', error);
    }
  }

  function calculate() {
    if (fromCurrency in currencyRates && toCurrency in currencyRates) {
      amountTo = (amountFrom / currencyRates[fromCurrency]) * currencyRates[toCurrency];
    } else {
      amountTo = 'Error: валюта не найдена!';
    }
  }

  // конвертация исходной валюты в целевую
  function convertFromTo() {
    amountTo = ((amountFrom / currencyRates[fromCurrency]) * currencyRates[toCurrency]).toFixed(3);
  }

  // конвертация суммы целевой валюты в исходную
  function convertToFrom() {
    amountFrom = ((amountTo / currencyRates[toCurrency]) * currencyRates[fromCurrency]).toFixed(3);
  }

  onMount(() => {
    fetchData();
  });

  // вызываем при изменении значений переменных
  $: calculate();
</script>

<main>
  <h1>Конвертер валют</h1>

  <div class="converter__container">
    <input type="number" step="0.001" bind:value={amountFrom} on:input={convertFromTo} />

    <label>
      Конвертировать из:
      <select bind:value={fromCurrency} on:change={calculate}>
        {#each [...popularCurrencies, ...Object.keys(currencyRates).filter(currency => !popularCurrencies.includes(currency))] as currency}
          <option value={currency}>{currency}</option>
        {/each}
      </select>
    </label>

    <label>
      В:
      <select bind:value={toCurrency} on:change={calculate}>
        {#each [...popularCurrencies, ...Object.keys(currencyRates).filter(currency => !popularCurrencies.includes(currency))] as currency}
          <option value={currency}>{currency}</option>
        {/each}
      </select>
    </label>

    <input type="number" step="0.001" bind:value={amountTo} on:input={convertToFrom} />
  </div>
</main>

<style>
  main {
    text-align: center;
    margin-top: 50px;
  }

  input, select {
    margin-bottom: 10px;
    font-size: 25px;
  }

  label {
    font-size: 25px;
  }

  .converter__container {
    display: flex;
    flex-direction: column;
  }
</style>
