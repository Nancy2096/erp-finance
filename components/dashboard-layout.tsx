'use client';

import { AppSidebar } from './app-sidebar';
import { AppHeader } from './app-header';
import { ProtectedRoute } from './protected-route';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Sidebar - Hidden on mobile, visible on lg and up */}
      <div className="hidden lg:block">
        <AppSidebar />
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        <AppHeader />
        <main className="min-h-[calc(100vh-4rem)] p-4 lg:p-6">
          <ProtectedRoute>
            {children}
          </ProtectedRoute>
        </main>
      </div>
    </div>
  );
}
