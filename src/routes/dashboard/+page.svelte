<script lang="ts">
  import { writable } from 'svelte/store';
  import { onMount } from 'svelte';
  import { DateTime } from 'luxon';

  let controle_document = writable<number | null>(null);
  let temps_chauffe = writable<number | null>(null);
  let temperature_cave = writable<number | null>(null);
  let errorMessage = writable('');
  let temperature_cpu_pi_zero = writable<number | null>(null);

  let nextControllerText = writable<string>(''); // Affichage temps avant écriture contrôleur

  // Récupération des données depuis l’API
  async function fetchData() {
    try {
      const res = await fetch('/api/getChauffeState');
      const data = await res.json();

      if (res.ok) {
        controle_document.set(data.controle_document);
        temps_chauffe.set(data.temps_chauffe);
        temperature_cave.set(data.temperature_cave);
        temperature_cpu_pi_zero.set(data.temperature_cpu_pi_zero);
      } else {
        errorMessage.set(`Erreur Chauffe-eau: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      errorMessage.set(`Erreur Chauffe-eau: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  // Calcul du temps avant prise en compte par le contrôleur
  function updateControllerTimer() {
    const now = DateTime.now().setZone('Europe/Paris');
    const targetHours = [0, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

    let nextTargetHour = targetHours.find(h => now < now.set({ hour: h, minute: 0, second: 0 }));
    if (nextTargetHour === undefined) nextTargetHour = 0;

    let nextTime = now.set({ hour: nextTargetHour, minute: 0, second: 0 });
    if (nextTime <= now) nextTime = nextTime.plus({ days: 1 });

    const diff = nextTime.diff(now, ['hours', 'minutes', 'seconds']).toObject();
    const h = Math.floor(diff.hours ?? 0);
    const m = Math.floor(diff.minutes ?? 0);
    const s = Math.floor(diff.seconds ?? 0);

    const formatted =
      h > 0 ? `${h}h ${m}min ${s}s` : `${m}min ${s}s`;

    nextControllerText.set(formatted);
  }

  onMount(() => {
    fetchData(); // Premier fetch immédiat
    updateControllerTimer();

    const interval = setInterval(() => {
      updateControllerTimer(); // Mise à jour du timer d'écriture
    }, 1000);

    return () => clearInterval(interval);
  });

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
</script>

<main class="container">
  {#if $errorMessage}
    <p class="error">{$errorMessage}</p>
  {/if}

  <div class="update-section">
    <h2>Prochaine mise à jour contrôleur</h2>
    <div class="update-grid">
      <div class="update-item">
        <p class="label">Écriture :</p>
        <p class="value">{$nextControllerText}</p>
      </div>
    </div>
  </div>

  {#if $controle_document !== null}
    <div class="etiquette">
      <h2>Températures</h2>
      <p>Cave : { $temperature_cave !== null ? $temperature_cave / 10 : 'N/A' }°C</p>
      <p>CPU : { $temperature_cpu_pi_zero !== null ? $temperature_cpu_pi_zero / 10 : 'N/A' }°C</p>
      <a href="/history"><button>Voir l'historique</button></a>
    </div>

    <div class="etiquette">
      <h2>Chauffe-eau</h2>
      <p>{ ($controle_document & 0b100000) !== 0 ? 'Allumé 🔥' : 'Éteint ❄️' }</p>
      <p>Temps de chauffe : {$temps_chauffe} min</p>
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

  h2 {
    font-size: 25px;
    margin-bottom: 15px;
    color: #000000;
  }

  .update-section {
    margin-top: 20px;
    padding: 15px;
    background: #f5f5f5;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .update-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .update-item {
    background: #ffffff;
    padding: 10px;
    border-radius: 8px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.05);
  }

  .label {
    font-size: 18px;
    color: #555;
    margin-bottom: 5px;
  }

  .value {
    font-size: 20px;
    font-weight: bold;
    color: #000;
  }

  .etiquette {
    margin-top: 20px;
    padding: 15px;
    border-radius: 10px;
    background: #f5f5f5;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .etiquette p {
    font-size: 18px;
    font-weight: bold;
  }

  button {
    margin-top: 10px;
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    background-color: #3b7bbf;
    color: white;
    cursor: pointer;
    font-size: 16px;
  }

  button:hover {
    background-color: #0056b3;
  }
</style>
