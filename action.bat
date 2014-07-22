@echo off
cd C:\Users\Fx\Documents\GitHub\mmo-str
echo "================== GIT PULL ==================" > log.txt
git pull
timeout /t 15 >nul
echo "================== npm start =================="  > log.txt
npm start