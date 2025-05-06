<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
  
    const selected = writable<'cave' | 'interieur' | 'cpu'>('cave');
    const history = writable<Array<{ timestamp: string, value: number }>>([]);
    const errorMessage = writable('');
  
    async function fetchHistory(type: 'cave' | 'interieur' | 'cpu') {
      selected.set(type);
      errorMessage.set('');
      history.set([]);
  
      try {
        const res = await fetch(`/api/history/${type}`);
        const data = await res.json();
  
        if (res.ok) {
          history.set(data); // attend un tableau [{ timestamp, value }]
        } else {
          errorMessage.set(data.error || 'Erreur inconnue');
        }
      } catch (error) {
        errorMessage.set(error instanceof Error ? error.message : 'Erreur inconnue');
      }
    }
  
    onMount(() => {
      fetchHistory('cave');
    });
  </script>
  
  <style>
    .tabs {
      display: flex;
      justify-content: center;
      background-color: #f0f0f0;
      padding: 10px;
      gap: 20px;
    }
  
    .tab {
      cursor: pointer;
      padding: 8px 16px;
      border-bottom: 2px solid transparent;
      font-weight: bold;
      color: #444;
    }
  
    .tab.active {
      border-color: #3b7bbf;
      color: #3b7bbf;
    }
  
    .container {
      max-width: 600px;
      margin: 20px auto;
      padding: 0 15px;
    }
  
    .entry {
      padding: 8px;
      border-bottom: 1px solid #ddd;
      display: flex;
      justify-content: space-between;
    }
  
    .error {
      color: red;
      text-align: center;
      margin-top: 20px;
    }
  </style>
  
  <div class="tabs">
    <div class="tab" class:active={$selected === 'cave'} on:click={() => fetchHistory('cave')}>Cave</div>
    <div class="tab" class:active={$selected === 'interieur'} on:click={() => fetchHistory('interieur')}>Intérieur</div>
    <div class="tab" class:active={$selected === 'cpu'} on:click={() => fetchHistory('cpu')}>CPU</div>
  </div>
  
  <main class="container">
    {#if $errorMessage}
      <p class="error">{$errorMessage}</p>
    {/if}
  
    {#each $history as item}
      <div class="entry">
        <span>{new Date(item.timestamp).toLocaleString()}</span>
        <span>{item.value / 10} °C</span>
      </div>
    {/each}
  </main>
  