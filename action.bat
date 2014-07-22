@echo off
cd C:\Users\Fx\Documents\GitHub\mmo-str
echo "================== GIT PULL =================="
git pull
timeout /t 15 >nul
echo "================== npm start =================="
npm start