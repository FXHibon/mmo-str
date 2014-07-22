@echo off
echo "================== GIT PULL =================="
git pull
timeout /t 15 >nul
echo "================== npm start =================="
npm start