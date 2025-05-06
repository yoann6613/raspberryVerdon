<script lang="ts">
  import { goto } from '$app/navigation';
  import { writable } from 'svelte/store';

  let username = '';
  let password = '';
  let errorMessage = writable('');

  async function login() {
    errorMessage.set('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      goto('/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        errorMessage.set(error.message);
      } else {
        errorMessage.set('Une erreur inconnue est survenue');
      }
    }
  }
</script>

<main class="login-container">
  <div class="login-card">
      <h1>Connexion</h1>
      {#if $errorMessage}
        <p class="error">{$errorMessage}</p>
      {/if}
      <form on:submit|preventDefault={login}>
          <div class="input-group">
              <input id="username" type="text" bind:value={username} required placeholder="login" />
          </div>

          <div class="input-group">
              <input id="password" type="password" bind:value={password} required placeholder="password" />
          </div>

          <div class="input-group">
              <button type="submit">Se connecter</button>
          </div>
      </form>
  </div>
</main>

<style>
  /* Global styles */
  body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f7fb;
  }

  /* Center the login card */
  .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f4f7fb;
  }

  .login-card {
      background-color: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
      text-align: center;
      display: flex;
      flex-direction: column;
  }

  .login-card h1 {
      color: #3b7bbf;
      font-size: 24px;
      margin-bottom: 20px;
  }

  .input-group {
      margin-bottom: 20px;
      width: 100%;
  }

  label {
      font-size: 14px;
      color: #888;
      display: block;
      margin-bottom: 5px;
  }

  input {
      width: 94%;
      padding: 10px;
      font-size: 16px;
      border: 1px solid #ddd;
      border-radius: 5px;
      background-color: #f9f9f9;
      transition: all 0.3s;
  }

  input:focus {
      border-color: #3b7bbf;
      background-color: #f0f8ff;
  }

  button {
      display: block;
      width: 100%;
      padding: 10px;
      background-color: #3b7bbf;
      color: white;
      font-size: 16px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.3s;
  }

  button:hover {
      background-color: #34659f;
  }

  .error {
      color: #ff4d4d;
      font-size: 14px;
      margin-bottom: 15px;
  }
</style>
