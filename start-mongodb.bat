@echo off
REM Starts local MongoDB (Smart Warehouse)
REM MongoDB was extracted to C:\Users\pujit\mongodb (no admin/service install)
set "MONGOD=C:\Users\pujit\mongodb\Server\8.0\bin\mongod.exe"
set "DBPATH=C:\Users\pujit\mongodb-data"
set "LOG=C:\Users\pujit\mongodb-log\mongod.log"

if not exist "%MONGOD%" (
  echo MongoDB not found at %MONGOD%
  pause
  exit /b 1
)

echo Checking if MongoDB is already running...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I "mongod.exe" >NUL
if %ERRORLEVEL%==0 (
  echo MongoDB is already running.
  goto :done
)

echo Starting MongoDB on port 27017...
start "MongoDB" "%MONGOD%" --dbpath "%DBPATH%" --logpath "%LOG%" --bind_ip 127.0.0.1 --port 27017
timeout /t 4 >NUL

:done
echo.
echo MongoDB is ready at mongodb://127.0.0.1:27017
echo Data folder: %DBPATH%
pause
