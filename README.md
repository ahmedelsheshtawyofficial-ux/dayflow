# Sara Essam — v5 Persistence & Habits Fix

This update focuses on two reported defects:

1. Habits could fail to be added or displayed reliably.
2. App data appeared only after creating a new task/reward, and did not reliably reappear after relaunch.

## What changed

- Normalizes every persisted collection (`tasks`, `habits`, `rewards`, etc.) before the UI uses it, preventing legacy/null fields from breaking habit creation.
- Loads state from Android native storage first, then falls back to legacy WebView `localStorage` keys.
- Saves the recovered state back into durable Android app-private storage at startup, migrating legacy data.
- Uses an atomic temporary-file write in Android app-private storage, with SharedPreferences retained as a recovery copy.
- Persists again when the app page is hidden or paused, and refreshes the UI on `pageshow`.
- Habit creation now validates the input, writes immediately, and reports whether the save call succeeded.
- Bumped Android `versionCode` to 3 and `versionName` to 1.0.2.

## Build

The existing GitHub Actions workflow remains at `.github/workflows/build-apk.yml`.
Run **Build Sara Essam APK** from the Actions tab and download the `Sara-Essam-APK` artifact.

## Important update instructions

- Install this APK as an update over the existing app.
- Do not uninstall the previous app and do not clear its storage; Android app-private data is preserved only when the package identity remains the same.
- The package ID remains `com.saraessam.app`.
- If the old installation was already uninstalled or its storage was cleared, local data from that installation cannot be recovered by this update.

## Validation checklist after installing

1. Open the app and check whether existing tasks/rewards appear without creating anything new.
2. Add a habit and confirm it appears immediately.
3. Force-close the app and reopen it; confirm the habit and existing data remain.
4. Restart the phone and repeat the check.
