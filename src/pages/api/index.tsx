import React from 'react';
import { useSession, signIn } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>Scams Call App - Reporta Estafas Telefónicas</title>
        <meta name="description" content="Plataforma colaborativa para reportar estafas telefónicas en Colombia" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-primary-600">Scams Call App</h1>
              </div>
              <nav className="flex items-center space-x-4">
                {session ? (
                  <>
                    <Link href="/reportar" className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
                      Reportar Estafa
                    </Link>
                    <Link href="/perfil" className="text-gray-700 hover:text-primary-600">
                      Mi Perfil
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={() => signIn('google')}
                    className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                  >
                    Iniciar Sesión
                  </button>
                )}
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Protege a tu comunidad de
              <span className="text-primary-600"> estafas telefónicas</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Reporta números sospechosos, consulta reportes existentes y ayuda a crear 
              una base de datos colaborativa para combatir el crimen en Colombia.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {session ? (
                <Link href="/reportar" className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors">
                  Reportar una Estafa
                </Link>
              ) : (
                <button
                  onClick={() => signIn('google')}
                  className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Comenzar a Reportar
                </button>
              )}
              <Link href="/buscar" className="border border-primary-600 text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-50 transition-colors">
                Buscar Números
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📞</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Reporta Fácilmente</h3>
                <p className="text-gray-600">Reporta números sospechosos en menos de 2 minutos con nuestro formulario intuitivo.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Protege tu Comunidad</h3>
                <p className="text-gray-600">Tus reportes ayudan a prevenir que más personas sean víctimas de estafas.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Consulta Reportes</h3>
                <p className="text-gray-600">Busca números antes de responder llamadas desconocidas.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

