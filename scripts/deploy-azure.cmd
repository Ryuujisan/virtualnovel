@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Deploy-Azure.ps1" %*

