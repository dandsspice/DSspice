import { Link } from 'react-router-dom';
import Button from '../common/Button';

export default function Footer() {
  const navigation = [
    { name: 'Home', to: '/' },
    { name: 'Products', to: '/products' },
    { name: 'About', to: '#about' },
    { name: 'Contact', to: '/contact' }
  ];

  return (
    <footer className="bg-background dark:bg-dark-background border-t border-secondary/10 py-8 text-text-secondary dark:text-dark-text-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <img
              src="/images/spicy-logo.png"
              alt="D&Sspice Logo"
              className="h-8 w-auto"
            />
            <p className="text-sm">
              Bringing authentic African flavors to your kitchen
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.to}
                    className="text-sm text-text-secondary dark:text-dark-text-secondary hover:text-accent"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-text-secondary dark:text-dark-text-secondary">
              <li>Email: info@dsspice.com</li>
              <li>Phone: +44 123 456 7890</li>
              <li>Location: United Kingdom</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg border border-secondary/20 bg-background dark:bg-dark-background"
              />
              <Button
                type="submit"
                className="w-full px-4 py-2 rounded-lg bg-secondary text-primary hover:bg-secondary-light"
              >
                Subscribe
                </Button>

            </form>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-secondary/10 text-center text-sm text-text-secondary dark:text-dark-text-secondary">
          <p>&copy; {new Date().getFullYear()} D&Sspice. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

