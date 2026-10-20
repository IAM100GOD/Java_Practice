(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyD4Lv2dYfWa4jLt2qpq1lONs4gorAo5w1g",
    authDomain: "code-coriander.firebaseapp.com",
    projectId: "code-coriander",
    storageBucket: "code-coriander.firebasestorage.app",
    messagingSenderId: "900942382350",
    appId: "1:900942382350:web:c08322170d099263af435f",
    measurementId: "G-SQZGND6HCX"
  };

  if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    try {
      firebase.initializeApp(firebaseConfig);
    } catch (e) {
      console.error("Firebase init error:", e);
    }
  }

  // Rate-limiting / anti-spam state
  let lastAttemptTime = 0;
  let consecutiveFailedAttempts = 0;
  let lockoutUntil = 0;

  function setBtnLoading(isLoading, customText) {
    const btn = document.getElementById('landingLoginBtn');
    if (!btn) return;
    if (isLoading) {
      btn.disabled = true;
      btn.innerHTML = `<span style="display:inline-block;width:12px;height:12px;border:2px solid currentColor;border-top-color:transparent;border-radius:50%;animation:spin .8s linear infinite;margin-right:6px;"></span> ${customText || 'Connecting...'}`;
    } else {
      btn.disabled = false;
      btn.innerHTML = `
        <svg class="g-ico" viewBox="0 0 24 24" style="width:16px;height:16px;"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/><path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/></svg>
        Sign In
      `;
    }
  }

  /**
   * Check if the authenticated user exists in the Firestore 'allowed_users' whitelist collection.
   * Access is secured at the database layer via Firestore Security Rules (get only, no listing).
   */
  async function checkFirestoreWhitelist(user) {
    if (!user || !user.email) return false;
    if (typeof firebase === 'undefined' || !firebase.firestore) {
      console.error("Firestore SDK not available for whitelist verification.");
      return false;
    }
    try {
      const db = firebase.firestore();
      const emailKey = user.email.toLowerCase().trim();
      const docRef = db.collection('allowed_users').doc(emailKey);
      const snap = await docRef.get();
      if (snap.exists) {
        const data = snap.data() || {};
        if (data.active !== undefined && !data.active) {
          return false;
        }
        return true;
      }
      return false;
    } catch (err) {
      console.warn("Firestore whitelist check query notice:", err);
      return false;
    }
  }

  window.loginWithGoogle = async function () {
    if (window.location.protocol === 'file:') {
      alert("Google OAuth requires an HTTP or HTTPS origin (it cannot run from local file://).\n\nPlease visit your live site:\nhttps://codecoriander.com");
      return;
    }
    if (typeof firebase === 'undefined' || !firebase.auth) {
      alert("Authentication library is loading. Please check your internet connection and try again.");
      return;
    }

    const now = Date.now();
    // 1. Check active lockout
    if (lockoutUntil > now) {
      const remainingSecs = Math.ceil((lockoutUntil - now) / 1000);
      alert(`Too many unauthorized sign-in attempts.\nPlease wait ${remainingSecs} seconds before trying again.`);
      return;
    }

    // 2. Anti-spam throttle (minimum 3 seconds between clicks)
    if (now - lastAttemptTime < 3000) {
      return;
    }
    lastAttemptTime = now;

    setBtnLoading(true);
    const auth = firebase.auth();
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const result = await auth.signInWithPopup(provider);
      const user = result.user;
      const isAllowed = await checkFirestoreWhitelist(user);

      if (isAllowed) {
        consecutiveFailedAttempts = 0;
        updateAuthState(user);
      } else {
        consecutiveFailedAttempts += 1;
        const selectedEmail = (user && user.email) ? user.email : "Selected account";

        // Extra hardening: purge unauthorized user account from Firebase Auth database
        try {
          await user.delete();
        } catch (delErr) {
          await auth.signOut();
        }

        if (consecutiveFailedAttempts >= 3) {
          lockoutUntil = Date.now() + 60000; // 60-second cooldown
          alert(`Access Restricted:\n\nThe account (${selectedEmail}) is not on the authorized whitelist.\n\nToo many unauthorized attempts. Sign-in is temporarily paused for 60 seconds.`);
        } else {
          alert(`Access Restricted:\n\nThe account (${selectedEmail}) is not on the authorized whitelist.\n\nPlease sign in with your authorized Google account.`);
        }

        setBtnLoading(false);
        updateAuthState(null);
      }
    } catch (err) {
      setBtnLoading(false);
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        return;
      }
      if (err.code === 'auth/popup-blocked') {
        alert("The Google Sign-In popup was blocked by your browser. Please allow popups for codecoriander.com and click 'Sign In' again.");
        return;
      }
      console.warn("Sign-in notice:", err);
      alert("Sign in could not be completed: " + (err.message || err.code));
    }
  };

  window.logout = async function () {
    if (typeof firebase !== 'undefined' && firebase.auth) {
      await firebase.auth().signOut();
    }
    updateAuthState(null);
  };

  // Workbench scripts (helpers, problem manifest, ~60 problem files, engine) are only
  // downloaded after an authorized sign-in, so public visitors never fetch them.
  let workbenchLoaded = false;
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = false;
      s.onload = resolve;
      s.onerror = () => reject(new Error('Failed to load ' + src));
      document.body.appendChild(s);
    });
  }
  async function loadWorkbench() {
    if (workbenchLoaded) return;
    workbenchLoaded = true;
    try {
      const v = Date.now();
      await loadScript('js/helpers.js?v=' + v);
      await loadScript('problems/manifest.js?v=' + v);
      const files = (window.PROBLEM_FILES || []).map(f => f + '?v=' + v).concat(['js/engine.js?v=' + v]);
      // async=false keeps execution in order while downloading in parallel
      await Promise.all(files.map(loadScript));
    } catch (e) {
      console.error(e);
    }
  }

  // Automatic live update detection: if user has a tab open,
  // check if new problems/manifest updates were deployed and refresh automatically
  async function checkForUpdates() {
    if (!workbenchLoaded) return;
    try {
      const res = await fetch('problems/manifest.js?_chk=' + Date.now(), { cache: 'no-store' });
      if (!res.ok) return;
      const text = await res.text();
      const matches = [...text.matchAll(/"([^"]+\.js)"/g)].map(m => m[1]);
      if (matches.length && window.PROBLEM_FILES) {
        const currentSet = new Set(window.PROBLEM_FILES);
        const hasChange = matches.length !== window.PROBLEM_FILES.length || matches.some(f => !currentSet.has(f));
        if (hasChange) {
          console.log('[Code Coriander] Problem updates detected, reloading workbench...');
          location.reload();
        }
      }
    } catch (e) {
      // Silently ignore network interruptions
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkForUpdates();
  });
  window.addEventListener('focus', checkForUpdates);
  setInterval(checkForUpdates, 60000);

  function updateAuthState(user) {
    const defaultLanding = document.getElementById('defaultLanding');
    const stepperApp = document.getElementById('stepperApp');
    const userEmailBadge = document.getElementById('userEmailBadge');
    const landingLoginBtn = document.getElementById('landingLoginBtn');

    setBtnLoading(false);

    if (user && user.email) {
      if (defaultLanding) defaultLanding.style.display = 'none';
      if (stepperApp) stepperApp.style.display = 'grid';
      if (userEmailBadge) userEmailBadge.textContent = user.email;
      loadWorkbench();
    } else {
      if (defaultLanding) defaultLanding.style.display = 'block';
      if (stepperApp) stepperApp.style.display = 'none';
      if (landingLoginBtn) {
        landingLoginBtn.style.display = 'inline-flex';
        landingLoginBtn.disabled = false;
      }
    }
  }

  // Safe listener: verifies whitelist from Firestore on startup
  if (typeof firebase !== 'undefined' && firebase.auth) {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const isAllowed = await checkFirestoreWhitelist(user);
        if (isAllowed) {
          updateAuthState(user);
        } else {
          // If non-whitelisted session found, purge and clear silently
          try {
            await user.delete();
          } catch (e) {
            await firebase.auth().signOut();
          }
          updateAuthState(null);
        }
      } else {
        updateAuthState(null);
      }
    });
  }
})();
