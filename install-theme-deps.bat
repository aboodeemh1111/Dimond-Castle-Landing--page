@echo off
echo 🎨 Installing Theme System Dependencies...
echo.

echo 📦 Installing admin panel dependencies...
cd dimond-castle-admin-v2
call npm install @radix-ui/react-slider @radix-ui/react-radio-group --legacy-peer-deps

echo.
echo ✅ Theme System dependencies installed!
echo.
echo 🚀 Next steps:
echo 1. Start API server: cd dimond-castle-api ^&^& npm run dev
echo 2. Start admin panel: cd dimond-castle-admin-v2 ^&^& npm run dev
echo 3. Navigate to /admin/theme to configure your theme
echo.
echo 📚 See THEME_SYSTEM_GUIDE.md for complete documentation
pause

