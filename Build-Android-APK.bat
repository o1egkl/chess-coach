@echo off
title Build Chess Coach Android APK
echo ============================================================
echo   CHESS COACH - BUILD ANDROID APK
echo ============================================================

set JAVA_HOME=D:\Android\Android Studio\jbr
set ANDROID_HOME=D:\Users\o1egk\AppData\Local\Android\Sdk

echo [1/3] Building Web assets...
call npm run build
if %ERRORLEVEL% neq 0 (
  echo Error during web build.
  pause
  exit /b 1
)

echo [2/3] Syncing Capacitor Android...
call npx cap sync android
if %ERRORLEVEL% neq 0 (
  echo Error during Capacitor sync.
  pause
  exit /b 1
)

echo [3/3] Compiling APK with Gradle...
cd android
call gradlew.bat assembleDebug
if %ERRORLEVEL% neq 0 (
  echo Error during APK compilation.
  pause
  exit /b 1
)

echo ============================================================
echo   BUILD SUCCESSFUL!
echo   APK location: android\app\build\outputs\apk\debug\app-debug.apk
echo ============================================================
pause
