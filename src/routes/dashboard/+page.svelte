<script lang="ts">
  import { writable } from 'svelte/store';

  let controle_document = writable(0);  // Stocke l'état du controle_document
  let errorMessage = writable('');

  // Fonction pour récupérer et mettre à jour l'état du controle_document
  async function toggleRadiator() {
    try {
      const res = await fetch('/api/toggleRadiator', {
        method: 'POST',
      });
      const data = await res.json();
      
      if (res.ok) {
        controle_document.set(data.controle_document); // Mets à jour l'état avec la réponse de l'API
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
</script>

<main class="container">
  <h1>Dashboard</h1>

  {#if $errorMessage}
    <p class="error">{$errorMessage}</p>
  {/if}

  <p>L'état du controle_document est : { ($controle_document & 0b100000) !== 0 ? 'Allumé' : 'Éteint' }</p>
  <button on:click={toggleRadiator}>
    { ($controle_document & 0b100000) !== 0 ? 'Éteindre le radiateur' : 'Allumer le radiateur' }
  </button>
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
