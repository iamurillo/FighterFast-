@echo off
chcp 65001 >nul
echo ========================================================
echo   Subiendo FighterFast a tu GitHub Automáticamente...
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/7] Inicializando carpeta como repositorio Git...
git init

echo [2/7] Configurando tu usuario local para los commits...
git config user.email "israel@fighterfast.local"
git config user.name "Israel"

echo [3/7] Seleccionando todos los archivos de FighterFast...
git add .

echo [4/7] Guardando los cambios (Commit)...
git commit -m "Respaldo completo de API y PWA FighterFast"

echo [5/7] Configurando la rama principal...
git branch -M main

echo [6/7] Conectando con tu repositorio en GitHub...
git remote remove origin 2>nul
git remote add origin https://github.com/iamurillo/FighterFast-.git

echo [7/7] Subiendo el codigo a internet...
echo --------------------------------------------------------
echo ATENCION: Abrira una ventana para que inicies sesion.
echo Haz clic en "Sign in with your browser" (Iniciar con el navegador).
echo --------------------------------------------------------
git push -u origin main

echo.
echo ========================================================
echo   PROCESO FINALIZADO. REVISA TU GITHUB.
echo ========================================================
pause
