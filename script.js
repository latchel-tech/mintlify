/* ==========================================================
   Pin the Mintlify private-space Login/Logout button as a
   floating icon button fixed to the bottom-right corner of
   the page, instead of sitting in the topbar.
   ========================================================== */

window.addEventListener('DOMContentLoaded', () => {
  relocateAuthLink();
});

// Mintlify re-renders parts of the topbar on client-side navigation
// (e.g. after login/logout state changes), so re-run there too.
window.addEventListener('mintlify:user', () => {
  relocateAuthLink();
});

// Mintlify is a single-page app under the hood, so the topbar can
// re-render and re-insert the original .login-link/.logout-link
// element after our script already ran. Watch for that and re-apply.
const authObserver = new MutationObserver(() => {
  relocateAuthLink();
});
authObserver.observe(document.body, { childList: true, subtree: true });

function relocateAuthLink() {
  const authLink = document.querySelector('.login-link, .logout-link');
  if (!authLink) return;

  // Create (once) a fixed container pinned to the bottom-right corner
  let dock = document.getElementById('auth-fab-dock');
  if (!dock) {
    dock = document.createElement('div');
    dock.id = 'auth-fab-dock';
    document.body.appendChild(dock);
  }

  // If it's already parked in the dock, nothing to do
  if (authLink.parentElement === dock) return;

  dock.appendChild(authLink);
  authLink.classList.add('auth-fab');
}