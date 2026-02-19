#!/bin/bash

# Migration rapide pour appliquer les changements de schéma Prisma
# Utiliser après avoir modifié schema.prisma

echo "🔄 Application de la migration Prisma..."
echo ""

cd backend

# Générer et appliquer la migration
npx prisma migrate dev --name update-notification-with-content

echo ""
echo "✅ Migration appliquée avec succès !"
echo ""
echo "📝 Changements appliqués :"
echo "   - Ajout de la relation User -> Notification"
echo "   - Renommage notification.message -> notification.content"
echo "   - Ajout de la contrainte onDelete Cascade"
echo ""
