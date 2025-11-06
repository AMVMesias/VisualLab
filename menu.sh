#!/bin/bash

# 🎓 Script de Comandos Útiles para la Plataforma Educativa

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║     Plataforma Educativa - Menú de Comandos Útiles       ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

BASE_DIR="/home/archmesias/Escritorio/Universidad/Pruebas/1P/Proyecto"

# Función para mostrar el menú
mostrar_menu() {
    echo "Selecciona una opción:"
    echo ""
    echo "  1) Instalar/Configurar todo (primera vez)"
    echo "  2) Iniciar servidor de desarrollo"
    echo "  3) Compilar para producción"
    echo "  4) Limpiar y reinstalar dependencias"
    echo "  5) Ver estructura del proyecto"
    echo "  6) Verificar estado de archivos"
    echo "  7) Actualizar proyectos integrados"
    echo "  8) Salir"
    echo ""
    read -p "Opción: " opcion
    
    case $opcion in
        1) instalar_todo ;;
        2) iniciar_dev ;;
        3) compilar_produccion ;;
        4) limpiar_reinstalar ;;
        5) ver_estructura ;;
        6) verificar_estado ;;
        7) actualizar_proyectos ;;
        8) exit 0 ;;
        *) echo "Opción inválida"; mostrar_menu ;;
    esac
}

# 1. Instalar todo
instalar_todo() {
    echo ""
    echo "🚀 Instalando y configurando toda la plataforma..."
    echo ""
    
    cd "$BASE_DIR/edu-platform" || exit 1
    
    echo "📦 Instalando dependencias de edu-platform..."
    npm install
    
    echo ""
    echo "📋 Copiando FRACTALES..."
    mkdir -p public/fractals-app
    cp -r ../FRACTALES/* public/fractals-app/
    
    echo ""
    echo "🔨 Compilando Interactive3DViewer..."
    cd ../Interactive3DViewer || exit 1
    npm install
    npm run build
    
    echo ""
    echo "📋 Copiando Interactive3DViewer..."
    cd ../edu-platform || exit 1
    cp -r ../Interactive3DViewer/dist public/3d-app
    
    echo ""
    echo "✅ ¡Instalación completa!"
    echo ""
    read -p "¿Iniciar servidor de desarrollo? (s/n): " respuesta
    if [ "$respuesta" = "s" ]; then
        iniciar_dev
    else
        mostrar_menu
    fi
}

# 2. Iniciar servidor de desarrollo
iniciar_dev() {
    echo ""
    echo "🚀 Iniciando servidor de desarrollo..."
    echo "   URL: http://localhost:3000"
    echo "   Presiona Ctrl+C para detener"
    echo ""
    cd "$BASE_DIR/edu-platform" || exit 1
    npm run dev
}

# 3. Compilar para producción
compilar_produccion() {
    echo ""
    echo "🔨 Compilando para producción..."
    cd "$BASE_DIR/edu-platform" || exit 1
    npm run build
    echo ""
    echo "✅ Build completado en: dist/"
    echo ""
    read -p "¿Ver preview de producción? (s/n): " respuesta
    if [ "$respuesta" = "s" ]; then
        npm run preview
    else
        mostrar_menu
    fi
}

# 4. Limpiar y reinstalar
limpiar_reinstalar() {
    echo ""
    echo "🧹 Limpiando y reinstalando dependencias..."
    cd "$BASE_DIR/edu-platform" || exit 1
    
    rm -rf node_modules package-lock.json
    npm install
    
    echo ""
    echo "✅ Dependencias reinstaladas"
    mostrar_menu
}

# 5. Ver estructura
ver_estructura() {
    echo ""
    echo "📁 Estructura del proyecto:"
    echo ""
    cd "$BASE_DIR/edu-platform" || exit 1
    tree -L 3 -I 'node_modules|dist' 2>/dev/null || find . -maxdepth 3 -not -path '*/node_modules/*' -not -path '*/dist/*' | head -50
    echo ""
    read -p "Presiona Enter para continuar..."
    mostrar_menu
}

# 6. Verificar estado
verificar_estado() {
    echo ""
    echo "🔍 Verificando estado del proyecto..."
    echo ""
    
    cd "$BASE_DIR/edu-platform" || exit 1
    
    echo "📦 Node.js y npm:"
    node --version 2>/dev/null && npm --version 2>/dev/null || echo "  ❌ No instalado"
    
    echo ""
    echo "📂 Directorios importantes:"
    [ -d "node_modules" ] && echo "  ✅ node_modules" || echo "  ❌ node_modules (falta)"
    [ -d "public/fractals-app" ] && echo "  ✅ public/fractals-app" || echo "  ❌ public/fractals-app (falta)"
    [ -d "public/3d-app" ] && echo "  ✅ public/3d-app" || echo "  ❌ public/3d-app (falta)"
    
    echo ""
    echo "📄 Archivos principales:"
    [ -f "package.json" ] && echo "  ✅ package.json" || echo "  ❌ package.json"
    [ -f "vite.config.js" ] && echo "  ✅ vite.config.js" || echo "  ❌ vite.config.js"
    [ -f "src/App.jsx" ] && echo "  ✅ src/App.jsx" || echo "  ❌ src/App.jsx"
    
    echo ""
    read -p "Presiona Enter para continuar..."
    mostrar_menu
}

# 7. Actualizar proyectos integrados
actualizar_proyectos() {
    echo ""
    echo "🔄 Actualizando proyectos integrados..."
    echo ""
    
    cd "$BASE_DIR/edu-platform" || exit 1
    
    echo "1. Actualizando FRACTALES..."
    rm -rf public/fractals-app
    mkdir -p public/fractals-app
    cp -r ../FRACTALES/* public/fractals-app/
    
    echo ""
    echo "2. Recompilando Interactive3DViewer..."
    cd ../Interactive3DViewer || exit 1
    npm run build
    
    echo ""
    echo "3. Actualizando Interactive3DViewer..."
    cd ../edu-platform || exit 1
    rm -rf public/3d-app
    cp -r ../Interactive3DViewer/dist public/3d-app
    
    echo ""
    echo "✅ Proyectos actualizados"
    mostrar_menu
}

# Iniciar el menú
mostrar_menu
