<script lang="ts">
  import { writable } from 'svelte/store';
  import { onMount } from 'svelte';

  let controle_document = writable<number | null>(null);  // Valeur initiale indéfinie
  let errorMessage = writable('');

  // Fonction pour récupérer l'état initial du radiateur
  async function fetchInitialState() {
    try {
      const res = await fetch('/api/getRadiatorState');
      const data = await res.json();

      if (res.ok) {
        controle_document.set(data.controle_document);
      } else {
        errorMessage.set(`Erreur lors de la récupération: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        errorMessage.set(`Une erreur est survenue: ${error.message}`);
      } else {
        errorMessage.set('Une erreur inconnue est survenue');
      }
    }
  }

  // Fonction pour basculer l'état du radiateur
  async function toggleRadiator() {
    try {
      const res = await fetch('/api/toggleRadiator', { method: 'POST' });
      const data = await res.json();

      if (res.ok) {
        controle_document.set(data.controle_document);
      } else {
        errorMessage.set(`Erreur lors de la mise à jour: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        errorMessage.set(`Une erreur inconnue est survenue: ${error.message}`);
      } else {
        errorMessage.set('Une erreur inconnue est survenue');
      }
    }
  }

  // Récupérer l'état au chargement du composant
  onMount(fetchInitialState);
</script>

<main class="container">
  <h1>Dashboard</h1>

  {#if $errorMessage}
    <p class="error">{$errorMessage}</p>
  {/if}

  {#if $controle_document !== null}
    <p>L'état du radiateur est : { ($controle_document & 0b100000) !== 0 ? 'Allumé' : 'Éteint' }</p>
    <button on:click={toggleRadiator}>
      { ($controle_document & 0b100000) !== 0 ? 'Éteindre le radiateur' : 'Allumer le radiateur' }
    </button>
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
  button {
    margin-top: 10px;
    padding: 8px;
  }
</style>
