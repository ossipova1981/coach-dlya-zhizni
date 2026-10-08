# Коуч для жизни

Дневник привычек, настроения и целей на 90 дней. Данные хранятся локально на устройстве.

## Что внутри

- **Веб / Electron (Windows)** — `index.html`, `app.js`, `styles.css`, `electron-main.js`
- **Android (Capacitor)** — папка `android/`, пакет `life.coach.app`

## Скачать готовую сборку

Смотрите [Releases](../../releases): там APK для Android и архив для Windows.

## Запуск из исходников

```bash
npm install
npm start          # Electron
npm run android:sync
```

Android: откройте `android/` в Android Studio и соберите APK/AAB.

Версия: **1.1.0**
