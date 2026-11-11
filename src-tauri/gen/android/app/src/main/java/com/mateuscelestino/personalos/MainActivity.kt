package com.mateuscelestino.personalos

import android.Manifest
import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.media.AudioAttributes
import android.media.RingtoneManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.view.View
import android.view.WindowManager
import android.webkit.JavascriptInterface
import android.webkit.WebSettings
import android.webkit.WebView
import androidx.activity.enableEdgeToEdge
import androidx.core.app.NotificationCompat
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import org.json.JSONArray

class MainActivity : TauriActivity() {

    companion object {
        const val GENERAL_CHANNEL_ID = "mcp_personal_os_channel_silent"
        const val GENERAL_CHANNEL_NAME = "M.C.P Personal OS — Avisos do Sistema"
        const val PERMISSION_REQ_CODE = 1001
    }

    private var currentWebView: WebView? = null

    /**
     * Aplica Fullscreen Imersivo Permanente (Edge-to-Edge puro com System Bars ocultas)
     * Garante exibição 100% tela cheia no mobile, sem sobreposição de relógio/bateria sobre o header.
     */
    private fun applyImmersiveFullScreen() {
        WindowCompat.setDecorFitsSystemWindows(window, false)
        val controller = WindowCompat.getInsetsController(window, window.decorView)
        controller.systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        controller.hide(WindowInsetsCompat.Type.systemBars())
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        // Suporte total a exibição além do entalhe de câmera (punch-hole/cutout)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            window.attributes.layoutInDisplayCutoutMode =
                WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES
        }

        // Ativa Fullscreen Imersivo permanente
        applyImmersiveFullScreen()

        // Garante aceleração por hardware ativa no nível da janela
        window.setFlags(
            WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED,
            WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED
        )

        super.onCreate(savedInstanceState)

        // Inicializa canais de notificação e permissões
        createNotificationChannels()
        requestNotificationPermission()

        // Cancela preventivamente qualquer alarme residual agendado em versões anteriores
        cancelAllAlarms()
    }

    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        if (hasFocus) {
            applyImmersiveFullScreen()
        }
    }

    var lastSafeTopDp: Float = 0f
    var lastSafeBottomDp: Float = 0f

    fun injectSafeInsets(targetWebView: WebView? = currentWebView) {
        val top = lastSafeTopDp
        val bottom = lastSafeBottomDp
        val jsCode = """
            (function() {
                document.documentElement.style.setProperty('--safe-top', '${top}px');
                document.documentElement.style.setProperty('--safe-bottom', '${bottom}px');
                if (document.body) {
                    document.body.style.setProperty('--safe-top', '${top}px');
                    document.body.style.setProperty('--safe-bottom', '${bottom}px');
                }
                window.AndroidSafeInsets = { top: $top, bottom: $bottom };
                window.AndroidBridgeReady = true;
                window.dispatchEvent(new CustomEvent('androidbridge:ready', { detail: { safeTop: $top, safeBottom: $bottom } }));
            })();
        """.trimIndent()

        targetWebView?.post {
            targetWebView.evaluateJavascript(jsCode, null)
        }
    }

    override fun onResume() {
        super.onResume()
        applyImmersiveFullScreen()
        injectSafeInsets()
        handleDeepLink(intent)
        val pollCloudJs = """
            (function() {
                try {
                    if (window.ControlEngine && typeof window.ControlEngine.checkPendingCloudAuth === 'function') {
                        window.ControlEngine.checkPendingCloudAuth();
                    }
                } catch(e) {}
            })();
        """.trimIndent()
        currentWebView?.post {
            currentWebView?.evaluateJavascript(pollCloudJs, null)
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        handleDeepLink(intent)
    }

    private fun handleDeepLink(intent: Intent?) {
        val uri = intent?.data ?: return
        if (uri.scheme == "mcp-personal-os" || uri.scheme == "personalos") {
            val rawUri = uri.toString().replace("'", "\\'")
            val jsCode = """
                (function() {
                    try {
                        if (window.ControlEngine && typeof window.ControlEngine.handleDeepLinkOAuth === 'function') {
                            window.ControlEngine.handleDeepLinkOAuth('$rawUri');
                        }
                    } catch(e) { console.error('Deep link error:', e); }
                })();
            """.trimIndent()
            currentWebView?.post {
                currentWebView?.evaluateJavascript(jsCode, null)
            }
        }
    }

    override fun onWebViewCreate(webView: WebView) {
        super.onWebViewCreate(webView)
        currentWebView = webView

        // 1. Limpeza de cache para assegurar que assets compilados atualizados sejam sempre exibidos
        webView.clearCache(true)

        // 2. Aceleração por Hardware e Multi-Core Rendering na GPU Adreno/Xclipse
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null)
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            cacheMode = WebSettings.LOAD_NO_CACHE
            @Suppress("DEPRECATION")
            setRenderPriority(WebSettings.RenderPriority.HIGH)
            // Renderização multi-core através do Chromium compositor
            offscreenPreRaster = true
            // Trava rigorosamente a viewport móvel real sem falsos viewports de desktop (elimina vazios pretos laterais)
            useWideViewPort = false
            loadWithOverviewMode = false
        }

        // 3. Ponte Nativa Android/Samsung para JavaScript
        webView.addJavascriptInterface(AndroidBridge(this, webView), "AndroidBridge")

        // 4. Listener Dinâmico de Insets no Modo Fullscreen Imersivo
        ViewCompat.setOnApplyWindowInsetsListener(webView) { _, windowInsets ->
            val cutout = windowInsets.getInsets(WindowInsetsCompat.Type.displayCutout())
            val density = resources.displayMetrics.density

            // Em Fullscreen Permanente, o topo só desce o necessário para desviar da câmera frontal (cutout)
            val topDp = if (density > 0 && cutout.top > 0) cutout.top / density else 0f
            val bottomDp = if (density > 0 && cutout.bottom > 0) cutout.bottom / density else 0f

            lastSafeTopDp = topDp
            lastSafeBottomDp = bottomDp

            injectSafeInsets(webView)
            applyImmersiveFullScreen()

            windowInsets
        }
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

            // Canal Geral — Totalmente Silencioso (sem som padrão intrusivo do Android)
            val generalChannel = NotificationChannel(
                GENERAL_CHANNEL_ID,
                GENERAL_CHANNEL_NAME,
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Atualizações e avisos silenciosos do M.C.P Personal OS"
                enableLights(false)
                enableVibration(false)
                setSound(null, null)
            }
            notificationManager.createNotificationChannel(generalChannel)

            // Canal de Alarmes de Alta Prioridade com som exclusivo do Personal OS (ps2_startup)
            val soundUri = Uri.parse("android.resource://" + packageName + "/" + R.raw.ps2_startup)
            val audioAttributes = AudioAttributes.Builder()
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .setUsage(AudioAttributes.USAGE_ALARM)
                .build()

            val alarmChannel = NotificationChannel(
                AlarmReceiver.ALARM_CHANNEL_ID,
                AlarmReceiver.ALARM_CHANNEL_NAME,
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Alarmes críticos com áudio exclusivo Personal OS e vibração"
                enableLights(true)
                enableVibration(true)
                vibrationPattern = longArrayOf(0, 500, 200, 500, 200, 500, 200, 1000)
                setSound(soundUri, audioAttributes)
                lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC
                setBypassDnd(true)
            }
            notificationManager.createNotificationChannel(alarmChannel)
        }
    }

    fun requestNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(arrayOf(Manifest.permission.POST_NOTIFICATIONS), PERMISSION_REQ_CODE)
            }
        }
    }

    fun triggerNotification(title: String, message: String, isAlarm: Boolean) {
        try {
            val channelId = if (isAlarm) AlarmReceiver.ALARM_CHANNEL_ID else GENERAL_CHANNEL_ID
            val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

            val launchIntent = Intent(this, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
                if (isAlarm) {
                    putExtra("from_alarm", true)
                    putExtra("alarm_reason", message)
                }
            }
            val pendingIntent = PendingIntent.getActivity(
                this,
                (System.currentTimeMillis() % 100000).toInt(),
                launchIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val sound = Uri.parse("android.resource://" + packageName + "/" + R.raw.ps2_startup)
            val displayMessage = if (isAlarm) "Motivo: $message" else message

            val builder = NotificationCompat.Builder(this, channelId)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle(title)
                .setContentText(displayMessage)
                .setStyle(NotificationCompat.BigTextStyle().bigText(displayMessage))
                .setPriority(if (isAlarm) NotificationCompat.PRIORITY_MAX else NotificationCompat.PRIORITY_DEFAULT)
                .setAutoCancel(true)
                .setContentIntent(pendingIntent)
                .setSound(sound)

            if (isAlarm) {
                builder.setCategory(NotificationCompat.CATEGORY_ALARM)
                builder.setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                builder.setVibrate(longArrayOf(0, 500, 200, 500, 200, 500, 200, 1000))
                builder.setFullScreenIntent(pendingIntent, true)
            }

            val notifId = (System.currentTimeMillis() % 100000).toInt()
            notificationManager.notify(notifId, builder.build())
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun trackScheduledAlarm(alarmId: Int) {
        try {
            val prefs = getSharedPreferences("mcp_alarms_prefs", Context.MODE_PRIVATE)
            val currentSet = prefs.getStringSet("scheduled_ids", mutableSetOf())?.toMutableSet() ?: mutableSetOf()
            currentSet.add(alarmId.toString())
            prefs.edit().putStringSet("scheduled_ids", currentSet).apply()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun untrackScheduledAlarm(alarmId: Int) {
        try {
            val prefs = getSharedPreferences("mcp_alarms_prefs", Context.MODE_PRIVATE)
            val currentSet = prefs.getStringSet("scheduled_ids", mutableSetOf())?.toMutableSet() ?: mutableSetOf()
            currentSet.remove(alarmId.toString())
            prefs.edit().putStringSet("scheduled_ids", currentSet).apply()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun cancelAllAlarms() {
        try {
            val alarmManager = getSystemService(Context.ALARM_SERVICE) as AlarmManager
            val prefs = getSharedPreferences("mcp_alarms_prefs", Context.MODE_PRIVATE)
            val currentSet = prefs.getStringSet("scheduled_ids", setOf()) ?: setOf()
            for (idStr in currentSet) {
                try {
                    val aId = idStr.toIntOrNull() ?: continue
                    val intent = Intent(this, AlarmReceiver::class.java).apply {
                        action = "com.mateuscelestino.personalos.ALARM_TRIGGER"
                    }
                    val pendingIntent = PendingIntent.getBroadcast(
                        this,
                        aId,
                        intent,
                        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                    )
                    alarmManager.cancel(pendingIntent)
                } catch (ignored: Exception) {}
            }
            prefs.edit().clear().apply()
            android.util.Log.i("MainActivity", "🔇 Todos os alarmes nativos foram limpos com cancelAllAlarms().")
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun scheduleAlarm(alarmId: Int, title: String, message: String, triggerAtMillis: Long) {
        try {
            val alarmManager = getSystemService(Context.ALARM_SERVICE) as AlarmManager
            val intent = Intent(this, AlarmReceiver::class.java).apply {
                action = "com.mateuscelestino.personalos.ALARM_TRIGGER"
                putExtra("title", title)
                putExtra("message", message)
                putExtra("reason", message)
                putExtra("alarm_id", alarmId)
            }

            val pendingIntent = PendingIntent.getBroadcast(
                this,
                alarmId,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                alarmManager.setExactAndAllowWhileIdle(
                    AlarmManager.RTC_WAKEUP,
                    triggerAtMillis,
                    pendingIntent
                )
            } else {
                alarmManager.setExact(
                    AlarmManager.RTC_WAKEUP,
                    triggerAtMillis,
                    pendingIntent
                )
            }

            trackScheduledAlarm(alarmId)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun cancelAlarm(alarmId: Int) {
        try {
            val alarmManager = getSystemService(Context.ALARM_SERVICE) as AlarmManager
            val intent = Intent(this, AlarmReceiver::class.java).apply {
                action = "com.mateuscelestino.personalos.ALARM_TRIGGER"
            }
            val pendingIntent = PendingIntent.getBroadcast(
                this,
                alarmId,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            alarmManager.cancel(pendingIntent)
            untrackScheduledAlarm(alarmId)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun triggerVibrate(patternJson: String) {
        try {
            val jsonArray = JSONArray(patternJson)
            val pattern = LongArray(jsonArray.length())
            for (i in 0 until jsonArray.length()) {
                pattern[i] = jsonArray.getLong(i)
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val vibratorManager = getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
                vibratorManager?.defaultVibrator?.vibrate(
                    VibrationEffect.createWaveform(pattern, -1)
                )
            } else {
                @Suppress("DEPRECATION")
                val vibrator = getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
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

class AndroidBridge(
    private val activity: MainActivity,
    private val webView: WebView
) {
    @JavascriptInterface
    fun showNotification(title: String, message: String, isAlarm: Boolean) {
        activity.runOnUiThread {
            activity.triggerNotification(title, message, isAlarm)
        }
    }

    @JavascriptInterface
    fun scheduleAlarm(alarmId: Int, title: String, message: String, triggerAtMillis: Long) {
        activity.runOnUiThread {
            activity.scheduleAlarm(alarmId, title, message, triggerAtMillis)
        }
    }

    @JavascriptInterface
    fun cancelAlarm(alarmId: Int) {
        activity.runOnUiThread {
            activity.cancelAlarm(alarmId)
        }
    }

    @JavascriptInterface
    fun cancelAllAlarms() {
        activity.runOnUiThread {
            activity.cancelAllAlarms()
        }
    }

    @JavascriptInterface
    fun vibrate(patternJson: String) {
        activity.runOnUiThread {
            activity.triggerVibrate(patternJson)
        }
    }

    @JavascriptInterface
    fun requestNotificationPermission() {
        activity.runOnUiThread {
            activity.requestNotificationPermission()
        }
    }

    @JavascriptInterface
    fun isAndroidNative(): Boolean = true

    @JavascriptInterface
    fun getSafeTop(): Float = maxOf(activity.lastSafeTopDp, 52f)

    @JavascriptInterface
    fun getSafeBottom(): Float = maxOf(activity.lastSafeBottomDp, 24f)

    @JavascriptInterface
    fun requestSafeInsetsInjection() {
        activity.runOnUiThread {
            activity.injectSafeInsets(webView)
        }
    }

    @JavascriptInterface
    fun openExternalUrl(url: String) {
        activity.runOnUiThread {
            try {
                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url)).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                activity.startActivity(intent)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    @JavascriptInterface
    fun openBrowser(url: String) {
        openExternalUrl(url)
    }
}
