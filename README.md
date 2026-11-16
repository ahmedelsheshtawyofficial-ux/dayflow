# Sara Essam v6 — Persistence Recovery Fix

This build fixes a startup data-loss path in the previous persistence implementation.

- Reads the complete state file in a loop and validates JSON before returning it.
- Falls back to SharedPreferences and a previous-file backup when the primary file is corrupt.
- Uses a temporary file and keeps the last known-good state while replacing it.
- Does not write an empty default state over existing storage during app startup.
- Reports native save failures instead of treating localStorage success as proof of Android persistence.
- Habit creation now confirms durable save before closing the form.

Build with the existing GitHub Actions workflow. Keep the same applicationId `com.saraessam.app`; install as an update. Do not clear app data.
