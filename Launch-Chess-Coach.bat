@echo off
title Chess Coach Launcher
echo ============================================================
echo   CHESS COACH - 15 LEVELS (400-2400 ELO)
echo ============================================================

powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r = [System.Net.WebRequest]::Create('http://localhost:5173/').GetResponse(); $r.Close(); exit 0 } catch { exit 1 }"
if %ERRORLEVEL% neq 0 (
  echo [INFO] Starting background Vite server on http://localhost:5173 ...
  start /min "" cmd /c "cd /d D:\agravity\chess-coach && node .\node_modules\vite\bin\vite.js --host --port 5173"
  echo Waiting for server to initialize...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "for ($i=0; $i -lt 30; $i++) { Start-Sleep -Milliseconds 400; try { $r = [System.Net.WebRequest]::Create('http://localhost:5173/').GetResponse(); $r.Close(); exit 0 } catch {} }; exit 1"
)

echo Server is ready! Launching Chess Coach window...

if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
  start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --app="http://localhost:5173/?v=fresh" --window-size=1280,840
  exit
)

if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
  start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --app="http://localhost:5173/?v=fresh" --window-size=1280,840
  exit
)

if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
  start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app="http://localhost:5173/?v=fresh" --window-size=1280,840
  exit
)

start "" "http://localhost:5173/?v=fresh"
