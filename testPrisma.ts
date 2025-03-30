import { prisma } from "./lib/prisma";

async function testConnection() {
  try {
    // Essayer de récupérer un élément de la base
    await prisma.$connect();
    console.log("✅ Prisma est bien connecté à la base de données !");
    
    const users = await prisma.user.findMany(); // Teste une requête
    console.log("👥 Utilisateurs :", users);
  } catch (error) {
    console.error("❌ Erreur de connexion à Prisma :", error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
