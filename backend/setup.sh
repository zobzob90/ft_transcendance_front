#!/bin/bash

# Script de démarrage rapide pour le backend 42Hub
# Usage: ./setup.sh

echo "🚀 42Hub Backend - Setup rapide"
echo "================================"

# Vérifier que PostgreSQL est installé
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL n'est pas installé. Installez-le d'abord :"
    echo "   sudo apt install postgresql postgresql-contrib"
    exit 1
fi

echo "✅ PostgreSQL détecté"

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Installez-le d'abord :"
    echo "   https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) détecté"

# Installation des dépendances
echo ""
echo "📦 Installation des dépendances..."
npm install

# Vérifier si .env existe
if [ ! -f .env ]; then
    echo ""
    echo "⚠️  Fichier .env manquant !"
    echo "📄 Création à partir de .env.example..."
    cp .env.example .env
    echo ""
    echo "🔧 IMPORTANT : Éditez le fichier .env avec vos vraies valeurs :"
    echo "   - DATABASE_URL (PostgreSQL)"
    echo "   - FORTY_TWO_CLIENT_ID"
    echo "   - FORTY_TWO_CLIENT_SECRET"
    echo "   - JWT_SECRET (générez une clé aléatoire)"
    echo ""
    read -p "Appuyez sur Entrée après avoir configuré .env..."
fi

echo ""
echo "✅ Fichier .env OK"

# Générer le client Prisma
echo ""
echo "🔧 Génération du client Prisma..."
npm run prisma:generate

# Appliquer les migrations
echo ""
echo "🗃️  Application des migrations..."
npm run prisma:migrate

# Seed de la base de données
echo ""
read -p "Voulez-vous remplir la base avec des données de test ? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Seed de la base de données..."
    npm run prisma:seed
fi

echo ""
echo "✅ Setup terminé !"
echo ""
echo "🎯 Prochaines étapes :"
echo "   1. Démarrer le serveur : npm run dev"
echo "   2. Tester l'API : http://localhost:3000/api/health"
echo "   3. Voir la doc complète : cat TEST_GUIDE.md"
echo ""
echo "📊 Interface Prisma Studio : npm run prisma:studio"
echo ""
