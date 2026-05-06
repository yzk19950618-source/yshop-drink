@echo off
REM Use ASCII only in this file. UTF-8 Chinese breaks cmd.exe line parsing on some Windows locales.
setlocal
set "ROOT=%~dp0"
set "BOOT3_DIR=%ROOT%yshop-drink-boot3"
set "BACKEND_DIR=%BOOT3_DIR%\yshop-server"
set "JAR=%BACKEND_DIR%\target\yshop-server.jar"
set "REBUILD=%1"

echo [BACKEND] cleanup port 48081...
for /f "tokens=5" %%p in ('netstat -ano ^| findstr /R /C:":48081 .*LISTENING"') do (
  if not "%%p"=="0" (
    echo [BACKEND] kill PID %%p
    taskkill /PID %%p /F >nul 2>nul
  )
)

cd /d "%BOOT3_DIR%"
echo [BACKEND] cwd: %cd%

REM Args:
REM   (none)   = mvn package (incremental; no clean). Rebuilds only changed modules.
REM   fast     = skip Maven if jar exists (use when only frontend changed).
REM   rebuild  = mvn clean package then start (full rebuild).
if /I "%REBUILD%"=="rebuild" goto BUILD_CLEAN
if /I "%REBUILD%"=="fast" (
  if exist "%JAR%" goto RUN
  goto BUILD_INCR
)
goto BUILD_INCR

:BUILD_CLEAN
where mvn >nul 2>nul || (
  echo [BACKEND][ERROR] mvn not found in PATH.
  pause
  exit /b 1
)
echo [BACKEND] clean + package server jar...
call mvn -pl yshop-server -am -DskipTests clean package
if errorlevel 1 (
  echo [BACKEND][ERROR] build failed.
  pause
  exit /b 1
)
goto RUN

:BUILD_INCR
where mvn >nul 2>nul || (
  echo [BACKEND][ERROR] mvn not found in PATH.
  pause
  exit /b 1
)
echo [BACKEND] incremental package server jar (mvn package, not clean)...
call mvn -pl yshop-server -am -DskipTests package
if errorlevel 1 (
  echo [BACKEND][ERROR] build failed.
  pause
  exit /b 1
)

:RUN
if not exist "%JAR%" (
  echo [BACKEND][ERROR] jar not found: %JAR%
  pause
  exit /b 1
)

echo [BACKEND] start jar: %JAR%
chcp 65001 >nul
java -Dfile.encoding=UTF-8 -Dsun.jnu.encoding=UTF-8 -jar "%JAR%" --spring.profiles.active=local
