@echo off
setlocal
set "ROOT=%~dp0"
set "ADMIN_DIR=%ROOT%yshop-drink-vue3"

echo [ADMIN] cleanup port 80...
for /f "tokens=5" %%p in ('netstat -ano ^| findstr /R /C:":80 .*LISTENING"') do (
  if not "%%p"=="0" (
    echo [ADMIN] kill PID %%p
    taskkill /PID %%p /F >nul 2>nul
  )
)

echo [ADMIN] dir: %ADMIN_DIR%
pnpm --dir "%ADMIN_DIR%" dev-server --host
