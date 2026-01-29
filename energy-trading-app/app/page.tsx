'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LoginScreen } from '@/components/login-screen'
import { Dashboard } from '@/components/dashboard'
import { TransactionHistory } from '@/components/transaction-history'

type ViewState = 'login' | 'dashboard' | 'history'

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewState>('login')

  return (
    <main className="min-h-screen">
      <AnimatePresence mode="wait">
        {currentView === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoginScreen onLogin={() => setCurrentView('dashboard')} />
          </motion.div>
        )}

        {currentView === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Dashboard
              onLogout={() => setCurrentView('login')}
              onHistory={() => setCurrentView('history')}
            />
          </motion.div>
        )}

        {currentView === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <TransactionHistory onBack={() => setCurrentView('dashboard')} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
