// pages/signup.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, User, Lock, ArrowRight } from 'lucide-react';
import { useAlert } from '@/contexts/Alert';
import InputField from './InputField';

export default function SignupPage() {
  const { addAlert } = useAlert();
  const [formData, setFormData] = useState({
    pseudo: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Validation de base
    if (formData.password !== formData.confirmPassword) {
      addAlert('Les mots de passe ne correspondent pas', 'error');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      addAlert('Le mot de passe doit contenir au moins 8 caractères', 'error');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pseudo: formData.pseudo,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Une erreur est survenue');
      }

      addAlert('Votre compte a été créé avec succès ! 🎉', 'success');
      router.push('/login');
    } catch (err: any) {
      addAlert(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left panel - Illustration/Info */}
        <div className="lg:w-1/2 bg-gradient-to-br from-primary to-primary-dark p-8 md:p-12 text-white">
          <div className="h-full flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-6">Rejoignez notre communauté</h1>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-white bg-opacity-20 p-2 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Accès complet</h3>
                    <p className="text-white text-opacity-80">Profitez de toutes les fonctionnalités exclusives de notre plateforme.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-white bg-opacity-20 p-2 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Sécurité renforcée</h3>
                    <p className="text-white text-opacity-80">Vos données sont protégées par nos systèmes de sécurité avancés.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-white bg-opacity-20 p-2 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Intégration rapide</h3>
                    <p className="text-white text-opacity-80">Commencez immédiatement après votre inscription.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center bg-white bg-opacity-10 p-6 rounded-xl">
              <p className="text-lg font-semibold">Déjà inscrit ?</p>
              <Link href="/login" className="inline-flex items-center justify-center mt-4 bg-white text-primary py-2 px-6 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-200">
                Se connecter
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right panel - Form */}
        <div className="lg:w-1/2 p-8 md:p-12">
          <div className="mb-8 text-center lg:text-left">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary bg-opacity-10 mb-4">
              <User className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Créer un compte</h2>
            <p className="text-gray-600">Remplissez le formulaire pour rejoindre notre communauté</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <InputField
                label="Pseudo"
                name="pseudo"
                type="text"
                value={formData.pseudo}
                onChange={handleChange}
                icon={User}
                placeholder="Votre pseudo"
              />
              <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                icon={Mail}
                placeholder="Votre adresse email"
              />
              <InputField
                label="Mot de passe"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                icon={Lock}
                placeholder="8 caractères minimum"
              />
              <InputField
                label="Confirmer le mot de passe"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                icon={Lock}
                placeholder="Confirmez votre mot de passe"
              />
            </div>

            <div className="pt-4">
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
                    Création en cours...
                  </span>
                ) : (
                  "S'inscrire"
                )}
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              En vous inscrivant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}