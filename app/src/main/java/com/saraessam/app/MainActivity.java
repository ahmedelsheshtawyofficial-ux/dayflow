package com.saraessam.app;

import android.app.Activity;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.graphics.Color;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.Manifest;
import android.content.pm.PackageManager;

public class MainActivity extends Activity {
    private WebView webView;
    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setStatusBarColor(Color.rgb(246,244,255));
        getWindow().setNavigationBarColor(Color.rgb(246,244,255));
        if (Build.VERSION.SDK_INT >= 23) {
            getWindow().getDecorView().setSystemUiVisibility(android.view.View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | android.view.View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);
        }
        webView = new WebView(this);
        webView.setBackgroundColor(Color.rgb(246,244,255));
        WebSettings s = webView.getSettings(); s.setJavaScriptEnabled(true); s.setDomStorageEnabled(true); s.setDatabaseEnabled(true); s.setAllowFileAccess(true); s.setDefaultTextEncodingName("UTF-8");
        webView.addJavascriptInterface(new AppBridge(this), "SaraNative");
        webView.setWebViewClient(new WebViewClient()); webView.setWebChromeClient(new WebChromeClient());
        setContentView(webView); webView.loadUrl("file:///android_asset/index.html");
        if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, 41);
    }
    public static class AppBridge {
        private final Context context; AppBridge(Context c) { context = c; }
        @JavascriptInterface public void scheduleReminder(String id, String title, String message, long when) {
            Intent i = new Intent(context, ReminderReceiver.class); i.putExtra("title", title); i.putExtra("message", message);
            int request = id.hashCode() & 0x7fffffff;
            PendingIntent pi = PendingIntent.getBroadcast(context, request, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            AlarmManager am = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
            if (am == null) return;
            if (Build.VERSION.SDK_INT >= 31 && !am.canScheduleExactAlarms()) {
                try { Intent settings = new Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM); settings.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK); context.startActivity(settings); } catch (Exception ignored) {}
            }
            if (Build.VERSION.SDK_INT >= 23) am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, when, pi); else am.set(AlarmManager.RTC_WAKEUP, when, pi);
        }
        @JavascriptInterface public void cancelReminder(String id) {
            Intent i = new Intent(context, ReminderReceiver.class); int request = id.hashCode() & 0x7fffffff;
            PendingIntent pi = PendingIntent.getBroadcast(context, request, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            AlarmManager am = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE); if (am != null) am.cancel(pi);
        }
    }
    @Override public void onBackPressed() { if (webView != null && webView.canGoBack()) webView.goBack(); else super.onBackPressed(); }
}
