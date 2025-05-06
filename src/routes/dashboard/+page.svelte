<script lang="ts">
  import { writable } from 'svelte/store';
  import { onMount } from 'svelte';

  let controle_document = writable<number | null>(null);
  let temps_chauffe = writable<number | null>(null);
  let temperature_cave = writable<number | null>(null);
  let errorMessage = writable('');

  async function fetchInitialState() {
    try {
      const res = await fetch('/api/getChauffeState');
      const data = await res.json();

      if (res.ok) {
        controle_document.set(data.controle_document);
        temps_chauffe.set(data.temps_chauffe);
        temperature_cave.set(data.temperature_cave);
      } else {
        errorMessage.set(`Erreur Chauffe-eau: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      errorMessage.set(`Erreur Chauffe-eau: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  async function toggleChauffe() {
    try {
      const res = await fetch('/api/toggleChauffe', { method: 'POST' });
      const data = await res.json();

      if (res.ok) {
        controle_document.set(data.controle_document);
      } else {
        errorMessage.set(`Erreur Chauffe-eau: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      errorMessage.set(`Erreur Chauffe-eau: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  onMount(fetchInitialState);
</script>

<main class="container">
  {#if $errorMessage}
    <p class="error">{$errorMessage}</p>
  {/if}

  <!-- Section Radiateur -->
  {#if $controle_document !== null}
    <div class="etiquette">
      <h2>Chauffe-eau</h2>
      <p>{ ($controle_document & 0b100000) !== 0 ? 'Allumé 🔥' : 'Éteint ❄️' }</p>
      <p>Temps de chauffe : {$temps_chauffe} min</p>
      <p>Température de la cave : { $temperature_cave !== null ? $temperature_cave / 10 : 'N/A' }°C</p>
      <button on:click={toggleChauffe}>
        { ($controle_document & 0b100000) !== 0 ? 'Éteindre' : 'Allumer' }
      </button>
    </div>
  {:else}
    <p>Chargement...</p>
  {/if}

  <!-- autre Radiateur -->

  {#if $controle_document !== null}
    <div class="etiquette">
      <h2>Chauffe-eau</h2>
      <p>{ ($controle_document & 0b100000) !== 0 ? 'Allumé 🔥' : 'Éteint ❄️' }</p>
      <p>Temps de chauffe : {$temps_chauffe} min</p>
      <p>Température de la cave : { $temperature_cave !== null ? $temperature_cave / 10 : 'N/A' }°C</p>
      <button on:click={toggleChauffe}>
        { ($controle_document & 0b100000) !== 0 ? 'Éteindre' : 'Allumer' }
      </button>
    </div>
  {:else}
    <p>Chargement...</p>
  {/if}

  
  <!-- autre Radiateur -->

  {#if $controle_document !== null}
    <div class="etiquette">
      <h2>Chauffe-eau</h2>
      <p>{ ($controle_document & 0b100000) !== 0 ? 'Allumé 🔥' : 'Éteint ❄️' }</p>
      <p>Temps de chauffe : {$temps_chauffe} min</p>
      <p>Température de la cave : { $temperature_cave !== null ? $temperature_cave / 10 : 'N/A' }°C</p>
      <button on:click={toggleChauffe}>
        { ($controle_document & 0b100000) !== 0 ? 'Éteindre' : 'Allumer' }
      </button>
    </div>
  {:else}
    <p>Chargement...</p>
  {/if}

  
  <!-- autre Radiateur -->

  {#if $controle_document !== null}
    <div class="etiquette">
      <h2>Chauffe-eau</h2>
      <p>{ ($controle_document & 0b100000) !== 0 ? 'Allumé 🔥' : 'Éteint ❄️' }</p>
      <p>Temps de chauffe : {$temps_chauffe} min</p>
      <p>Température de la cave : { $temperature_cave !== null ? $temperature_cave / 10 : 'N/A' }°C</p>
      <button on:click={toggleChauffe}>
        { ($controle_document & 0b100000) !== 0 ? 'Éteindre' : 'Allumer' }
      </button>
    </div>
  {:else}
    <p>Chargement...</p>
  {/if}

</main>

<style>
  .container {
    max-width: 400px;
    margin: auto;
    padding: 20px;
  }
  
  .error {
    color: red;
  }

  .etiquette {
    margin-top: 20px;
    padding: 15px;
    border-radius: 10px;
    background: #f5f5f5;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .etiquette h2 {
    margin-bottom: 10px;
    color: #333;
  }

  .etiquette p {
    font-size: 18px;
    font-weight: bold;
  }

  button {
    margin-top: 10px;
    padding: 8px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    font-size: 16px;
  }

  button:hover {
    background-color: #0056b3;
  }
</style>
