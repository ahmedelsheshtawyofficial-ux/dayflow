# Sara Essam — MVP v3 (Performance, Focus, Habits & Nagging Reminders)

## What's improved
- Tasks due today and overdue are surfaced on Home without needing to create another task. The date helper uses the device's local date rather than UTC.
- Added a dedicated, visible Habits tab and daily habit log. Completing a habit gives points once per habit per local day.
- Focus and break durations are user-configurable and saved on the device. Pomodoro alternates focus and rest; Stopwatch remains available.
- Added configurable recurring reminders for unfinished tasks (default: every 30 minutes) and a test-notification button.
- Android notification permission is requested at launch and can be requested again from Settings.
- Existing localStorage data is migrated with defaults for the new settings; existing tasks, rewards, habits and notes are retained.

## Build APK with GitHub Actions
The repository root must contain `settings.gradle`, `build.gradle`, `gradle.properties`, and the `app/` folder. The workflow is `.github/workflows/build-apk.yml`.

In GitHub: Actions → Build Sara Essam APK → Run workflow. Download `Sara-Essam-APK` from the completed run's Artifacts.

## Important Android notification notes
- Allow notifications for Sara Essam in Android Settings.
- On Android 12+, exact-alarm access may be requested by Android. If denied, the app falls back to inexact idle-aware scheduling; delivery can be delayed by Android battery management.
- Repeated nagging is scheduled while there are unfinished tasks and stops when all tasks are completed or the nagging toggle is disabled. Default interval is 30 minutes and can be changed in Settings (minimum 5 minutes).
- Android vendors may restrict background alarms; set battery usage for Sara Essam to Unrestricted if reminders are being delayed.
- This version does not yet restore the recurring alarm after a device reboot. That is a remaining hardening task before claiming guaranteed reminders.

## Data
Data remains local to the device in WebView localStorage. Keep using the same app ID (`com.saraessam.app`) and do not clear app storage when updating if you want to retain data.
