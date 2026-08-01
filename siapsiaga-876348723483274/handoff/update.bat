@echo off
REM Siapsiaga friend-laptop updater. Double-click this any time you're told
REM a new version is available. Needs Docker Desktop already open and running.
cd /d "%~dp0"

echo Pulling latest images...
docker compose pull

echo Starting/restarting containers...
docker compose up -d

echo.
echo Update complete. Visit https://localhost:8443
echo (A browser security warning is normal - it's a self-signed certificate.)
pause
