# ISIC Client
[![npm (scoped)](https://img.shields.io/npm/v/@isic/client)](https://www.npmjs.com/package/@isic/client)

A client library for authenticating with the ISIC Archive from an SPA (single page application).

## Usage
* Install the library:
  ```bash
  yarn add @isic/client
  ```

  or if you're using npm:
  ```bash
  npm install @isic/client
  ```

* Instantiate an `IsicClient` with your application-specific configuration:
  ```js
  import IsicClient from '@isic/client';

  const isicClient = new IsicClient(
    process.env.CLIENT_ID, // e.g. 'v1odYySCetBht6DT9svQdAkvmVXrRHOwIIGNk6JG'
  );
  ```

  or if connecting to the sandbox server:
  ```js
  const isicClient = new IsicClient(
    process.env.CLIENT_ID,
    {
      isicOrigin: new URL('https://api-sandbox.isic-archive.com'),
    },
  );
  ```

* Call `redirectToLogin` when it's time to start a login flow:
  ```js
  document.querySelector('#sign-in-link').addEventListener('click', (event) => {
    event.preventDefault();
    isicClient.redirectToLogin();
    // This will redirect away from the current page
  });
  ```

* At the start of *every* page load, unconditionally call `maybeRestoreLogin`, to attempt to
  restore a login state; this will no-op if no login is present. Afterwards, get and store HTTP
  headers for new API accesses from `authHeaders`.
  ```js
  let authHeaders;

  isicClient.maybeRestoreLogin()
    .then(() => {
      authHeaders = isicClient.authHeaders;
    })
  ```

  or, if using ES6 and `async`/`await`:
  ```js
  await isicClient.maybeRestoreLogin();
  let { authHeaders } = isicClient;
  ```

* Use these credentials for Ajax API requests:
  ```js
  fetch('https://api.isic-archive.com/api/v2/studies/', {
    headers: authHeaders,
  });
  ```

* The login state will persist across page refreshes. Call `logout` to clear any active login:
  ```js
  document.querySelector('#sign-out-link').addEventListener('click', (event) => {
    event.preventDefault();
    isicClient.logout()
      .then(() => {
        authHeaders = isicClient.authHeaders;
      });
  });
  ```
