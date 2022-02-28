import IsicClient from '@isic/client';

const isicClient = new IsicClient(
  'v1odYySCetBht6DT9svQdAkvmVXrRHOwIIGNk6JG',
  {
    isicOrigin: new URL('https://api-sandbox.isic-archive.com/'),
    scopes: ['identity'],
  },
);
let legacyToken;

function updateDom() {
  document.querySelector('#sign-in-link').style.visibility =
    isicClient.isLoggedIn ? 'hidden' : 'visible';
  document.querySelector('#sign-out-link').style.visibility =
    isicClient.isLoggedIn ? 'visible' : 'hidden';

  document.querySelector('#logged-in').innerHTML = JSON.stringify(isicClient.isLoggedIn);
  document.querySelector('#auth-headers').innerHTML = JSON.stringify(isicClient.authHeaders);
  document.querySelector('#legacy-token').innerHTML = JSON.stringify(legacyToken);
}

document.querySelector('#sign-in-link')
  .addEventListener('click', (event) => {
    event.preventDefault();
    isicClient.redirectToLogin();
  });
document.querySelector('#sign-out-link')
  .addEventListener('click', (event) => {
    event.preventDefault();
    isicClient.logout()
      .then(() => {
        legacyToken = null;
      })
      .then(updateDom);
  });

updateDom();

isicClient.maybeRestoreLogin()
  .then(() => {
    if (isicClient.isLoggedIn) {
      return isicClient.getLegacyToken();
    } else {
      return null;
    }
  })
  .then((_legacyToken) => {
    legacyToken = _legacyToken;
  })
  .then(updateDom);
