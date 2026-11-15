# Dayflow — Mobile Productivity App

Dayflow is a mobile-first productivity app starter built with Expo and React Native.

## Current starter features
- Today dashboard
- Task completion with live progress calculation
- Quick-add task modal
- Daily habits preview
- Bottom navigation foundations for Calendar, Tasks, Focus, and Profile

The current task data is stored in app memory only. Persistence, accounts, cloud sync, reminders, calendar logic, and full habit/focus features are planned for subsequent development.

## Upload to GitHub using the website
1. Create a repository named `dayflow`.
2. Open the repository and choose **Add file → Upload files**.
3. Extract this ZIP on your device.
4. Upload the *contents* of the extracted `dayflow-github` folder (including the `.github` folder).
5. Commit the files to the `main` branch.

## Configure cloud APK builds
This repository includes an Expo EAS configuration and a GitHub Actions workflow.

One-time setup:
1. Create/sign in to an Expo account at https://expo.dev/.
2. Create an access token at https://expo.dev/accounts/[account]/settings/access-tokens.
3. In GitHub, open **Settings → Secrets and variables → Actions → New repository secret**.
4. Name the secret `EXPO_TOKEN` and paste the Expo access token as its value.
5. Link this app to an Expo EAS project once. The easiest route is to open the repository in a GitHub Codespace or use Expo's setup flow, then run `npx eas-cli@latest init` and commit the generated `projectId` in `app.json` under `expo.extra.eas.projectId`.

After setup, use **Actions → Build Android APK → Run workflow**. The build will run in Expo's cloud. When it finishes, open the EAS build link in the workflow logs to download the APK.

## Build profiles
- `preview`: Android APK for direct installation/testing.
- `production`: Android App Bundle (AAB), intended for Google Play submission.

## Important
- Never commit your Expo access token or any passwords into the repository.
- The GitHub Actions build requires the `EXPO_TOKEN` secret and an EAS project ID.
- This is a starter implementation, not a finished TickTick replacement.
