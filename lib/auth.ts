import { hash, compare } from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'votre-secret-key-tres-securisee';

// Fonction pour hacher le mot de passe
export async function hashPassword(password: string) {
  return await hash(password, 12);
}

// Fonction pour vérifier si le mot de passe correspond au haché
export async function verifyPassword(password: string, hashedPassword: string) {
  return await compare(password, hashedPassword);
}

// Fonction pour créer une session et stocker un JWT dans un cookie
export async function createSession(userId: number) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(new TextEncoder().encode(JWT_SECRET));

  // Set the 'auth-token' in cookies
  const cookieStore = await cookies(); // Attend la promesse de cookies
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',  // S'assure que le cookie est sécurisé en production
    sameSite: 'strict',  // Empêche l'envoi de cookies en cross-site
    maxAge: 86400, // 24 heures
  });

  return token;
}

// Fonction pour obtenir la session à partir du cookie JWT
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token');
  
  if (!token) return null;

  try {
    const verified = await jwtVerify(
      token.value,
      new TextEncoder().encode(JWT_SECRET)
    );
    return verified.payload as { userId: number }; // Renvoie l'identifiant de l'utilisateur
  } catch {
    return null; // Si le JWT est invalide ou expiré, renvoie null
  }
}

// Fonction pour supprimer le cookie lors de la déconnexion
export async function logout() {
  const cookieStore = await cookies(); // Attend la promesse de cookies
  cookieStore.delete('auth-token'); // Supprime le cookie 'auth-token'
}
