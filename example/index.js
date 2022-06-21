import IsicClient from '@isic/client';

const isicClient = new IsicClient(
  'v1odYySCetBht6DT9svQdAkvmVXrRHOwIIGNk6JG',
  {
    isicOrigin: new URL('https://api-sandbox.isic-archive.com/'),
    scopes: ['identity'],
  },
);

function updateDom() {
  document.querySelector('#sign-in-link').style.visibility =
    isicClient.isLoggedIn ? 'hidden' : 'visible';
  document.querySelector('#sign-out-link').style.visibility =
    isicClient.isLoggedIn ? 'visible' : 'hidden';

  document.querySelector('#logged-in').innerHTML = JSON.stringify(isicClient.isLoggedIn);
  document.querySelector('#auth-headers').innerHTML = JSON.stringify(isicClient.authHeaders);
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
      .then(updateDom);
  });

updateDom();

isicClient.maybeRestoreLogin()
  .then(updateDom);
