#!/bin/bash
echo "⏳ Waiting for MSSQL to be ready..."
until docker exec kurunegala-mssql /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U SA -P "Kurunegala@Str0ng!" -Q "SELECT 1" -C -b 2>/dev/null; do
  sleep 2
done
echo "✅ MSSQL is ready!"

echo "📦 Pushing Prisma schema..."
docker exec kurunegala-app npx prisma db push

echo "🌱 Running data migration..."
docker exec kurunegala-app npm run migrate

echo "🎉 Database seeded successfully!"
