# Dayflow Android

Dayflow is a native Android shell containing a mobile-first HTML application in Android WebView.

## Build APK
The repository includes `.github/workflows/build-apk.yml`. Push to `main` or run **Build Dayflow APK** manually from GitHub Actions. Download the `Dayflow-APK` artifact.

## Current implementation
- Home task list with filters and search
- Add tasks with due date, time, category, priority and notes
- Complete tasks, view task details, subtasks and delete tasks
- Calendar with month navigation and task dates
- Productivity insights and settings screens
- Local persistence using Android WebView DOM storage

Data is currently stored locally on the device. Cloud sync, push notifications and account sign-in are not implemented yet.
