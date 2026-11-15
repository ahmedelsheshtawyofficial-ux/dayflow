# Sara Essam — Android MVP

Mobile-first Arabic productivity app packaged as a native Android WebView shell. It is a separate project from Dayflow and Mahamy; the Mahamy project was used only as a reference for the GitHub Actions + Gradle APK build pattern.

## Included in this first build
- Tasks with status, priority, due date/time, optional reminder, project association, and nested subtasks.
- Projects with progress based on their tasks.
- Monthly calendar with task markers and selected-day agenda.
- Notes.
- Points for completed tasks, habit check-ins, and completed focus sessions.
- User-defined real-life rewards and point redemption history.
- Personal challenges and achievement badges.
- Habit tracker.
- Pomodoro and stopwatch.
- General reminders and Android notification scheduling through a native bridge.
- Local persistence using WebView localStorage; JSON export for backup.

## Build APK
The workflow is `.github/workflows/build-apk.yml`. Push to `main` or run it manually from GitHub Actions. Download the `Sara-Essam-APK` artifact.

## Important MVP limitations
- Data is stored locally on this device. Cloud sync, accounts, team projects, shared challenges, and server-side backup are not included yet.
- Android exact-alarm access and notification permission depend on Android version and device settings. Reminder scheduling is best-effort; battery restrictions may affect delivery.
- Challenge progress is currently user-recorded. Points are awarded once per completed task; changing a completed task back to incomplete reverses its task points.
- The project uses the same simple Android/Gradle build pattern as the supplied Mahamy project, but no Mahamy UI or app functionality is copied.


## UI Update v2 (2026-11-16)
- Redesigned the Rewards Store as a visual collection/shop with reward cards, category icons, descriptions, point prices, and redemption actions.
- Reward creation now supports a name, description, icon/category, and point cost.
- Added responsive sizing for narrow Android phones and larger screens.
- Improved bottom navigation, floating action button, modal safe-area spacing, and page bottom padding to reduce overlap/clipping on different screen heights.
- Existing saved rewards remain compatible; older rewards receive default icons and descriptions.
