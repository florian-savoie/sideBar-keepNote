'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAlert } from '@/contexts/Alert';
import Link from 'next/link';
import { FiMail, FiLock, FiUser, FiLogIn } from 'react-icons/fi';

export default function LoginPage() {
  const { setUser } = useAuth();
  const { addAlert } = useAlert();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  // Valeurs par défaut
  const defaultEmail = 'test@hotmail.fr';
  const defaultPassword = 'test@hotmail.fr';

  const handleSubmit = async (e : any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PATH_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email || defaultEmail,
          password: password || defaultPassword,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Une erreur est survenue');
      }
      
      const data = await res.json();
      setUser(data.user);
      addAlert('Connexion réussie!', 'success');
      router.push('/dashboard');
      router.refresh();
      
    } catch (err: any) {
      addAlert(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTestAccount = (e : any) => {
    e.preventDefault();
    setEmail(defaultEmail);
    setPassword(defaultPassword);
    console.log(defaultEmail);
    console.log(defaultPassword);
    handleSubmit(e);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="flex w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left panel - Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Bienvenue</h1>
            <p className="text-gray-600">Connectez-vous pour accéder à votre compte</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="Votre adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                <Link href="#" className="text-xs text-primary hover:text-primary-dark font-medium">
                  Mot de passe oublié?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="pt-2">
              <button 
                type="submit" 
                className="w-full flex items-center justify-center bg-primary hover:bg-primary-dark text-white py-3 rounded-lg transition-colors duration-300 font-medium"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion en cours...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <FiLogIn className="mr-2" />
                    Se connecter
                  </span>
                )}
              </button>
            </div>
            
            <div className="relative flex items-center justify-center">
              <div className="border-t border-gray-200 w-full"></div>
              <div className="bg-white px-4 text-sm text-gray-500">ou</div>
            </div>
            
            <div>
              <button 
                onClick={handleTestAccount}
                className="w-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg transition-colors duration-300 font-medium"
              >
                <FiUser className="mr-2" />
                Utiliser un compte test
              </button>
            </div>
            
            <div className="text-center mt-8">
              <p className="text-sm text-gray-600">
                Pas encore de compte?{' '}
                <Link href="/signup" className="text-primary hover:text-primary-dark font-medium">
                  S'inscrire
                </Link>
              </p>
            </div>
          </form>
        </div>
        
        {/* Right panel - Image/Video/Info */}
        <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-primary to-primary-dark relative">
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
            <h2 className="text-3xl font-bold mb-6 text-center">Découvrez notre application</h2>
            <div className="rounded-xl overflow-hidden shadow-2xl w-full max-w-md mx-auto mb-8 bg-black bg-opacity-30 backdrop-blur-sm p-2">
              <video className="w-full rounded-lg" autoPlay muted loop>
                <source src="../../intro.mp4" type="video/mp4" />
                Votre navigateur ne supporte pas la vidéo.
              </video>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="h-6 w-6 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Accédez à toutes vos informations</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Gérez vos préférences en toute sécurité</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Profitez de fonctionnalités exclusives</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}