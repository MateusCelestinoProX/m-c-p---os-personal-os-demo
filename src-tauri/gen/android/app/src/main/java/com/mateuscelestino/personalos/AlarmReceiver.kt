package com.mateuscelestino.personalos

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.media.RingtoneManager
import android.os.Build
import android.os.PowerManager
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import androidx.core.app.NotificationCompat

import android.net.Uri

class AlarmReceiver : BroadcastReceiver() {

    companion object {
        const val ALARM_CHANNEL_ID = "mcp_personal_os_alarm_ps2_exclusive_v2"
        const val ALARM_CHANNEL_NAME = "M.C.P Personal OS — Alarmes Exclusivos PS2"
    }

    override fun onReceive(context: Context, intent: Intent) {
        val alarmId = intent.getIntExtra("alarm_id", -1)

        // GUARDA ABSOLUTA: Se o alarme não estiver registrado ativamente pelo usuário em SharedPreferences, descarta sumariamente!
        val prefs = context.getSharedPreferences("mcp_alarms_prefs", Context.MODE_PRIVATE)
        val currentSet = prefs.getStringSet("scheduled_ids", null)
        val isExplicitlyActive = alarmId != -1 && currentSet != null && currentSet.contains(alarmId.toString())
        if (!isExplicitlyActive) {
            android.util.Log.w("AlarmReceiver", "🔇 Alarme residual ou não registrado ignorado (id: $alarmId).")
            return
        }

        val title = intent.getStringExtra("title") ?: "⚡ Alarme M.C.P Personal OS"
        val message = intent.getStringExtra("message") ?: "Aviso programado ativo."
        val reason = intent.getStringExtra("reason") ?: message

        // 1. Acquire WakeLock to guarantee CPU stays active on Samsung / Android
        val powerManager = context.getSystemService(Context.POWER_SERVICE) as? PowerManager
        val wakeLock = powerManager?.newWakeLock(
            PowerManager.PARTIAL_WAKE_LOCK or PowerManager.ACQUIRE_CAUSES_WAKEUP,
            "mcp_personal_os:alarm_wakelock"
        )
        wakeLock?.acquire(30_000) // 30 seconds safety timeout

        try {
            val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

            // Áudio exclusivo e unificado do Personal OS (ps2_startup)
            val soundUri = Uri.parse("android.resource://" + context.packageName + "/" + R.raw.ps2_startup)

            // Ensure High-Priority Alarm Channel exists com o som exclusivo
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val audioAttributes = AudioAttributes.Builder()
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .setUsage(AudioAttributes.USAGE_ALARM)
                    .build()

                val channel = NotificationChannel(
                    ALARM_CHANNEL_ID,
                    ALARM_CHANNEL_NAME,
                    NotificationManager.IMPORTANCE_HIGH
                ).apply {
                    description = "Canal de alarmes sonoros e vibratórios de alta precisão com áudio Personal OS"
                    enableLights(true)
                    enableVibration(true)
                    vibrationPattern = longArrayOf(0, 500, 200, 500, 200, 500, 200, 1000)
                    setSound(soundUri, audioAttributes)
                    lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC
                    setBypassDnd(true)
                }
                notificationManager.createNotificationChannel(channel)
            }

            // PendingIntent to launch app when tapped
            val launchIntent = Intent(context, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
                putExtra("from_alarm", true)
                putExtra("alarm_id", alarmId)
                putExtra("alarm_reason", reason)
            }
            val pendingIntent = PendingIntent.getActivity(
                context,
                alarmId,
                launchIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val displayReason = "Motivo: $reason"

            val builder = NotificationCompat.Builder(context, ALARM_CHANNEL_ID)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle(title)
                .setContentText(displayReason)
                .setStyle(NotificationCompat.BigTextStyle().bigText(displayReason))
                .setPriority(NotificationCompat.PRIORITY_MAX)
                .setCategory(NotificationCompat.CATEGORY_ALARM)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setAutoCancel(true)
                .setSound(soundUri)
                .setVibrate(longArrayOf(0, 500, 200, 500, 200, 500, 200, 1000))
                .setContentIntent(pendingIntent)
                .setFullScreenIntent(pendingIntent, true) // Heads-up display

            notificationManager.notify(alarmId, builder.build())

            // Hardware Vibration
            triggerHardwareVibration(context)

        } catch (e: Exception) {
            e.printStackTrace()
        } finally {
            try {
                if (wakeLock?.isHeld == true) {
                    wakeLock.release()
                }
            } catch (ignored: Exception) {}
        }
    }

    private fun triggerHardwareVibration(context: Context) {
        try {
            val pattern = longArrayOf(0, 600, 200, 600, 200, 800)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val vibratorManager = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
                vibratorManager?.defaultVibrator?.vibrate(
                    VibrationEffect.createWaveform(pattern, -1)
                )
            } else {
                @Suppress("DEPRECATION")
                val vibrator = context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    vibrator?.vibrate(VibrationEffect.createWaveform(pattern, -1))
                } else {
                    @Suppress("DEPRECATION")
                    vibrator?.vibrate(pattern, -1)
                }
            }
        } catch (ignored: Exception) {}
    }
}
