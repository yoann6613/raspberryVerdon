<script lang="ts">
    import { goto } from '$app/navigation';
    import { writable } from 'svelte/store';
  
    let username = '';
    let password = '';
    let errorMessage = writable('');
  
    async function login() {
      errorMessage.set(''); // Réinitialise les erreurs
  
      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
  
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Login failed');
        }
  
        localStorage.setItem('token', data.token);
        goto('/dashboard'); // Redirige après connexion réussie
      } catch (error) {
        // Gérer l'erreur correctement avec instanceof Error
        if (error instanceof Error) {
          errorMessage.set(error.message); // Utilise message si c'est une instance d'Error
        } else {
          errorMessage.set('Une erreur inconnue est survenue'); // Message générique pour les autres cas
        }
      }
    }
  </script>
  
  <main class="container">
    <h1>Connexion</h1>
    {#if $errorMessage}
      <p class="error">{$errorMessage}</p>
    {/if}
    <form on:submit|preventDefault={login}>
      <!-- Ajout de l'attribut 'for' pour associer le label avec l'input -->
      <label for="username">Nom d'utilisateur</label>
      <input id="username" type="text" bind:value={username} required />
  
      <label for="password">Mot de passe</label>
      <input id="password" type="password" bind:value={password} required />
  
      <button type="submit">Se connecter</button>
    </form>
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
    input, button {
      display: block;
      width: 100%;
      margin-bottom: 10px;
      padding: 8px;
    }
  </style>
  