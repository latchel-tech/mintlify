/* ==========================================================
   Relocate the Mintlify private-space Login/Logout button
   further right in the topbar — past "Get a Demo" and the
   theme toggle — so it's clearly separated from the
   customer-facing "Login to Latchel" button.
   ========================================================== */

window.addEventListener('DOMContentLoaded', () => {
  relocateAuthLink();
});

// Mintlify re-renders parts of the topbar on client-side navigation,
// so also re-run this after route changes.
window.addEventListener('mintlify:user', () => {
  relocateAuthLink();
});

function relocateAuthLink() {
  const authLink = document.querySelector('.login-link, .logout-link');
  if (!authLink) return;

  // The row that holds the nav links + the theme toggle button
  const topBarRow = document.querySelector(
    '.flex-1.relative.hidden.lg\\:flex.items-center.ml-auto.justify-end.space-x-4'
  );
  if (!topBarRow) return;

  // Avoid re-appending if it's already in the right place
  if (topBarRow.lastElementChild === authLink) return;

  topBarRow.appendChild(authLink);
  authLink.style.marginLeft = '12px';
}
