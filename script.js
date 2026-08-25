/* ==========================================================
   Pin the Mintlify private-space Login/Logout button as a
   floating icon button fixed to the bottom-right corner of
   the page, instead of sitting in the topbar.

   Also hides the "Latchel Admin" nav tab entirely unless the
   authenticated user's email is on the Latchel domain — Mintlify's
   `groups` frontmatter property only blocks direct page access
   (404s), it does not hide the tab itself, so we handle that
   part here using window.mintlify.user.

   Note: Mintlify flattens the Info API's "content" field directly
   onto window.mintlify.user (it does NOT nest under a .content key).
   So if the Info API returns content: { isLatchelDomain: true },
   that shows up as window.mintlify.user.isLatchelDomain — not
   window.mintlify.user.content.isLatchelDomain.
   ========================================================== */

const ADMIN_TAB_TEXT = 'Latchel Admin';

window.addEventListener('DOMContentLoaded', () => {
  relocateAuthLink();
  toggleAdminTabVisibility();
});

// Mintlify re-renders parts of the topbar on client-side navigation
// (e.g. after login/logout state changes), so re-run there too.
window.addEventListener('mintlify:user', () => {
  relocateAuthLink();
  toggleAdminTabVisibility();
});

// Mintlify is a single-page app under the hood. On client-side route
// changes it can re-create a fresh .login-link/.logout-link element
// in the topbar (since the original was moved out by us), and can
// also re-render the tab bar. Watch for both and re-apply.
const authObserver = new MutationObserver(() => {
  relocateAuthLink();
  toggleAdminTabVisibility();
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

  // Hover tooltip text differs depending on login vs. logout state
  if (fresh.classList.contains('login-link')) {
    fresh.setAttribute('data-tooltip', 'Login Admin');
  } else if (fresh.classList.contains('logout-link')) {
    fresh.setAttribute('data-tooltip', 'Logout Admin');
  }
}

function toggleAdminTabVisibility() {
  const isAuthorized = Boolean(window.mintlify && window.mintlify.user && window.mintlify.user.isLatchelDomain);

  document.querySelectorAll('.nav-tabs-item').forEach((tab) => {
    if (tab.textContent.trim() !== ADMIN_TAB_TEXT) return;
    tab.style.display = isAuthorized ? '' : 'none';
  });
}