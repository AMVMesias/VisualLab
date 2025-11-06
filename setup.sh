#!/bin/bash

echo "🚀 Configurando Plataforma Educativa..."
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Directorio base
BASE_DIR="/home/archmesias/Escritorio/Universidad/Pruebas/1P/Proyecto"
EDU_PLATFORM="$BASE_DIR/edu-platform"

cd "$BASE_DIR" || exit 1

# Paso 1: Instalar dependencias de la plataforma
echo -e "${BLUE}📦 Paso 1: Instalando dependencias de la plataforma educativa...${NC}"
cd "$EDU_PLATFORM" || exit 1
npm install
echo -e "${GREEN}✅ Dependencias instaladas${NC}"
echo ""

# Paso 2: Copiar proyecto FRACTALES
echo -e "${BLUE}📋 Paso 2: Copiando proyecto FRACTALES...${NC}"
mkdir -p "$EDU_PLATFORM/public"
cp -r "$BASE_DIR/FRACTALES" "$EDU_PLATFORM/public/fractals-app"
echo -e "${GREEN}✅ FRACTALES copiado${NC}"
echo ""

# Paso 3: Compilar y copiar Interactive3DViewer
echo -e "${BLUE}🔨 Paso 3: Compilando proyecto Interactive3DViewer...${NC}"
cd "$BASE_DIR/Interactive3DViewer" || exit 1

# Verificar si ya tiene node_modules
if [ ! -d "node_modules" ]; then
    echo "Instalando dependencias de Interactive3DViewer..."
    npm install
fi

echo "Compilando Interactive3DViewer..."
npm run build
echo -e "${GREEN}✅ Interactive3DViewer compilado${NC}"
echo ""

# Copiar build a la plataforma
echo -e "${BLUE}📋 Paso 4: Copiando Interactive3DViewer a la plataforma...${NC}"
cp -r "$BASE_DIR/Interactive3DViewer/dist" "$EDU_PLATFORM/public/3d-app"
echo -e "${GREEN}✅ Interactive3DViewer copiado${NC}"
echo ""

# Volver a edu-platform
cd "$EDU_PLATFORM" || exit 1

echo ""
echo -e "${GREEN}🎉 ¡Configuración completada!${NC}"
echo ""
echo -e "${YELLOW}Para iniciar la plataforma ejecuta:${NC}"
echo -e "${BLUE}  cd $EDU_PLATFORM${NC}"
echo -e "${BLUE}  npm run dev${NC}"
echo ""
echo -e "${YELLOW}La plataforma se abrirá en: http://localhost:3000${NC}"
echo ""
