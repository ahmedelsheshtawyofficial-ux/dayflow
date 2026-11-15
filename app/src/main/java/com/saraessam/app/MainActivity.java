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
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.nio.charset.StandardCharsets;

public class MainActivity extends Activity {
    private WebView webView;
    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setStatusBarColor(Color.rgb(246,244,255));
        getWindow().setNavigationBarColor(Color.rgb(246,244,255));
        if (Build.VERSION.SDK_INT >= 23) getWindow().getDecorView().setSystemUiVisibility(android.view.View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | android.view.View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);
        webView = new WebView(this);
        webView.setBackgroundColor(Color.rgb(246,244,255));
        WebSettings s = webView.getSettings(); s.setJavaScriptEnabled(true); s.setDomStorageEnabled(true); s.setDatabaseEnabled(true); s.setAllowFileAccess(true); s.setDefaultTextEncodingName("UTF-8");
        webView.addJavascriptInterface(new AppBridge(this), "SaraNative");
        webView.setWebViewClient(new WebViewClient()); webView.setWebChromeClient(new WebChromeClient());
        setContentView(webView); webView.loadUrl("file:///android_asset/index.html");
        requestNotifications();
    }
    private void requestNotifications() {
        if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, 41);
    }
    public static class AppBridge {
        private final MainActivity activity; private final Context context;
        AppBridge(MainActivity c) { activity=c; context=c; }
        @JavascriptInterface public void requestNotificationPermission() { activity.runOnUiThread(activity::requestNotifications); }
        // Durable state: atomic private-file write, with SharedPreferences as a recovery copy.
        @JavascriptInterface public synchronized String loadAppState() {
            File file = new File(context.getFilesDir(), "sara-state.json");
            try {
                if (file.exists() && file.length() > 1) {
                    FileInputStream in = new FileInputStream(file);
                    byte[] bytes = new byte[(int) file.length()]; int n = in.read(bytes); in.close();
                    if (n > 0) return new String(bytes, 0, n, StandardCharsets.UTF_8);
                }
            } catch (Exception ignored) {}
            return context.getSharedPreferences("sara_app_data", Context.MODE_PRIVATE).getString("state", "");
        }
        @JavascriptInterface public synchronized boolean saveAppState(String json) {
            if (json == null || json.length() == 0) return false;
            try {
                File target = new File(context.getFilesDir(), "sara-state.json");
                File temp = new File(context.getFilesDir(), "sara-state.tmp");
                FileOutputStream out = new FileOutputStream(temp, false);
                out.write(json.getBytes(StandardCharsets.UTF_8)); out.flush(); out.getFD().sync(); out.close();
                if (target.exists() && !target.delete()) return false;
                if (!temp.renameTo(target)) return false;
                context.getSharedPreferences("sara_app_data", Context.MODE_PRIVATE).edit().putString("state", json).commit();
                return true;
            } catch (Exception e) { return false; }
        }
        private PendingIntent alarmIntent(String id, String title, String message, long interval) {
            Intent i = new Intent(context, ReminderReceiver.class); i.putExtra("title", title); i.putExtra("message", message); i.putExtra("repeat", interval > 0); i.putExtra("interval", interval);
            int request = id.hashCode() & 0x7fffffff;
            return PendingIntent.getBroadcast(context, request, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        }
        private void setAlarm(PendingIntent pi, long when) {
            AlarmManager am=(AlarmManager)context.getSystemService(Context.ALARM_SERVICE); if(am==null)return;
            if(Build.VERSION.SDK_INT>=31 && !am.canScheduleExactAlarms()) { try { Intent st=new Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM); st.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK); context.startActivity(st); } catch(Exception ignored){} }
            if(Build.VERSION.SDK_INT>=23) { if(Build.VERSION.SDK_INT<31 || am.canScheduleExactAlarms()) am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP,when,pi); else am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP,when,pi); } else am.set(AlarmManager.RTC_WAKEUP,when,pi);
        }
        @JavascriptInterface public void scheduleReminder(String id,String title,String message,long when) { setAlarm(alarmIntent(id,title,message,0),when); }
        @JavascriptInterface public void cancelReminder(String id) { AlarmManager am=(AlarmManager)context.getSystemService(Context.ALARM_SERVICE); if(am!=null)am.cancel(alarmIntent(id,"","",0)); }
        @JavascriptInterface public void scheduleNagging(String title,String message,long interval) {
            long safe=Math.max(5*60*1000L,interval); context.getSharedPreferences("sara_nag",0).edit().putString("title",title).putString("message",message).putLong("interval",safe).putBoolean("enabled",true).apply();
            setAlarm(alarmIntent("SARA_NAGGING",title,message,safe),System.currentTimeMillis()+safe);
        }
        @JavascriptInterface public void cancelNagging() {
            AlarmManager am=(AlarmManager)context.getSystemService(Context.ALARM_SERVICE); if(am!=null)am.cancel(alarmIntent("SARA_NAGGING","","",0));
            context.getSharedPreferences("sara_nag",0).edit().putBoolean("enabled",false).apply();
        }
        @JavascriptInterface public void testNotification() { setAlarm(alarmIntent("SARA_TEST","تجربة إشعار من Sara Essam","الإشعارات شغالة على جهازك 💜",0),System.currentTimeMillis()+1500); }
    }
    @Override public void onBackPressed() { if (webView != null && webView.canGoBack()) webView.goBack(); else super.onBackPressed(); }
}
