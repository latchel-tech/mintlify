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

// Mintlify is a single-page app under the hood. On client-side route
// changes it can re-create a fresh .login-link/.logout-link element
// in the topbar (since the original was moved out by us). Watch for
// that and relocate the fresh one, discarding any stale duplicate.
const authObserver = new MutationObserver(() => {
  relocateAuthLink();
});
authObserver.observe(document.body, { childList: true, subtree: true });

function ensureDock() {
  let dock = document.getElementById('auth-fab-dock');
  if (!dock) {
    dock = document.createElement('div');
    dock.id = 'auth-fab-dock';
    document.body.appendChild(dock);
  }
  return dock;
}

function relocateAuthLink() {
  const dock = ensureDock();
  const matches = Array.from(document.querySelectorAll('.login-link, .logout-link'));
  if (matches.length === 0) return;

  // Prefer whichever instance is NOT already sitting in the dock —
  // that's the freshly-rendered, "live" one the app just created.
  let fresh = matches.find((el) => el.parentElement !== dock);
  if (!fresh) {
    fresh = matches[matches.length - 1];
  }

  // Remove any other matches entirely so duplicates never pile up
  matches.forEach((el) => {
    if (el !== fresh) {
      el.remove();
    }
  });

  if (fresh.parentElement !== dock) {
    dock.appendChild(fresh);
  }
  fresh.classList.add('auth-fab');
}