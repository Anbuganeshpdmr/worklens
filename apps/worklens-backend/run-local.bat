@echo off
setlocal EnableDelayedExpansion

echo ========================================
echo Starting Backend
echo ========================================

if not exist ".env.local" (
    echo.
    echo ERROR: .env.local file not found!
    echo.
    echo Please create .env.local before starting the backend.
    echo You can copy .env.example to .env.local
    echo.
    exit /b 1
)

echo Loading .env.local...

for /f "usebackq eol=# tokens=1,* delims==" %%A in (".env.local") do (
    if not "%%A"=="" (
        set "%%A=%%B"
    )
)

echo Environment loaded.
echo.
echo Starting Spring Boot...
echo.

call mvnw.cmd spring-boot:run

if errorlevel 1 (
    echo.
    echo ========================================
    echo Backend stopped with an error.
    echo ========================================
    exit /b 1
)

endlocal