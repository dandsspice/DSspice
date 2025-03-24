import Header from './header';
import Footer from './footer';
import ThemeToggle from '../ThemeToggle';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-background dark:bg-dark-background">
      <Header />
      
      {/* Main Content */}
      <main className="pt-16">
        {children}
      </main>

      <Footer />

      {/* Fixed position theme toggle */}
      <div className="fixed bottom-4 right-4 z-50">
        <ThemeToggle />
      </div>
    </div>
  );
}
