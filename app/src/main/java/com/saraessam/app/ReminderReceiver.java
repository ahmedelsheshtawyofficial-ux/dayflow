package com.saraessam.app;

import android.app.AlarmManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import androidx.core.app.NotificationCompat;

public class ReminderReceiver extends BroadcastReceiver {
    @Override public void onReceive(Context context, Intent intent) {
        String title=intent.getStringExtra("title"), message=intent.getStringExtra("message");
        String channel="sara_reminders";
        NotificationManager nm=(NotificationManager)context.getSystemService(Context.NOTIFICATION_SERVICE);
        if(Build.VERSION.SDK_INT>=26)nm.createNotificationChannel(new NotificationChannel(channel,"Sara Essam reminders",NotificationManager.IMPORTANCE_HIGH));
        Intent open=new Intent(context,MainActivity.class);open.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK|Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent content=PendingIntent.getActivity(context,0,open,PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);
        NotificationCompat.Builder b=new NotificationCompat.Builder(context,channel).setSmallIcon(android.R.drawable.ic_dialog_info).setContentTitle(title==null?"Sara Essam":title).setContentText(message==null?"عندك مهام محتاجة تخلص":message).setStyle(new NotificationCompat.BigTextStyle().bigText(message)).setPriority(NotificationCompat.PRIORITY_HIGH).setAutoCancel(true).setContentIntent(content);
        nm.notify((int)(System.currentTimeMillis()&0x7fffffff),b.build());
        long interval=intent.getLongExtra("interval",0);
        if(intent.getBooleanExtra("repeat",false)&&interval>0){
            android.content.SharedPreferences prefs=context.getSharedPreferences("sara_nag",0);
            if(prefs.getBoolean("enabled",false)){
                Intent again=new Intent(context,ReminderReceiver.class);again.putExtra("title",prefs.getString("title","عندك مهام معلقة"));again.putExtra("message",prefs.getString("message","في مهام محتاجة تخلص"));again.putExtra("repeat",true);again.putExtra("interval",prefs.getLong("interval",interval));
                PendingIntent pi=PendingIntent.getBroadcast(context,"SARA_NAGGING".hashCode()&0x7fffffff,again,PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);
                AlarmManager am=(AlarmManager)context.getSystemService(Context.ALARM_SERVICE);if(am!=null){long next=System.currentTimeMillis()+prefs.getLong("interval",interval);if(Build.VERSION.SDK_INT>=23)am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP,next,pi);else am.set(AlarmManager.RTC_WAKEUP,next,pi);}
            }
        }
    }
}
