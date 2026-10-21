@echo off
title School CRM - Allow Mobile Connection (Port 8000)

:: Check for Administrator privileges and auto-elevate
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [Info] Requesting Administrator access...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

echo ========================================================
echo  Configuring Windows Firewall for School CRM (Port 8000)
echo ========================================================
echo.

:: 1. Add Firewall Rule for Port 8000
echo [1/2] Adding inbound firewall rule for Port 8000...
netsh advfirewall firewall delete rule name="School CRM Backend 8000" >nul 2>&1
netsh advfirewall firewall add rule name="School CRM Backend 8000" dir=in action=allow protocol=TCP localport=8000

:: 2. Set Wi-Fi to Private
echo [2/2] Setting Wi-Fi network profile to Private...
powershell -Command "Set-NetConnectionProfile -InterfaceAlias 'Wi-Fi' -NetworkCategory Private -ErrorAction SilentlyContinue"

echo.
echo ========================================================
echo  SUCCESS!
echo  Port 8000 is now open. Your phone can connect to:
echo  http://192.168.1.33:8000
echo ========================================================
echo.
pause
