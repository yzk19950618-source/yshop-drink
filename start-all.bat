@echo off
setlocal
set "ROOT=%~dp0"
cd /d "%ROOT%"
set "BACKEND_DIR=%ROOT%yshop-drink-boot3\yshop-server"
set "ADMIN_DIR=%ROOT%yshop-drink-vue3"

echo ============================================
echo YSHOP one-click start
echo ROOT: %ROOT%
echo ============================================

where java >nul 2>nul || (
  echo [ERROR] java not found in PATH.
  pause
  exit /b 1
)
where mvn >nul 2>nul || (
  echo [ERROR] mvn not found in PATH.
  pause
  exit /b 1
)
where node >nul 2>nul || (
  echo [ERROR] node not found in PATH.
  pause
  exit /b 1
)
where pnpm >nul 2>nul || (
  echo [ERROR] pnpm not found in PATH. Run: npm i -g pnpm
  pause
  exit /b 1
)

echo [1/3] start Redis service if exists...
sc query Memurai >nul 2>nul && net start Memurai >nul 2>nul
sc query Redis >nul 2>nul && net start Redis >nul 2>nul

echo [2/3] start backend window...
start "YSHOP-BACKEND" "%ROOT%start-backend.bat"

echo [3/3] start admin window...
start "YSHOP-ADMIN" "%ROOT%start-admin.bat"

echo.
echo Backend: http://localhost:48081
echo Admin:   http://localhost:80
echo Login admin/admin123
echo Login shop: yixiang001/123456789
echo.
pause
exit /b 0

