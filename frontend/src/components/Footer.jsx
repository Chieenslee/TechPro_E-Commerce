import { Link } from 'react-router-dom';

const Footer = () => {
  const footerLinks = {
    Products: [
      { label: 'Smartphones', path: '/products?category=phones' },
      { label: 'Laptops', path: '/products?category=laptops' },
      { label: 'Tablets', path: '/products?category=tablets' },
      { label: 'Audio', path: '/products?category=audio' },
      { label: 'Accessories', path: '/products?category=accessories' },
    ],
    Support: [
      { label: 'Contact Us', path: '/contact' },
      { label: 'RMA / Warranty', path: '/rma' },
      { label: 'Services', path: '/services' },
      { label: 'Policies', path: '/policies' },
    ],
    Company: [
      { label: 'About TechPro', path: '/about' },
      { label: 'Tech News', path: '/news' },
      { label: 'My Account', path: '/account' },
    ],
  };

  return (
    <footer className="bg-surface border-t border-outline-variant mt-auto">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-lg">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <img
              alt="TechPro Logo"
              className="h-8 w-auto mb-md opacity-80 hover:opacity-100 transition-opacity"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsesC23xB0AHobEtRm5UQaqlhjIA1Zp2w59yQTn_Qa30C9ScN--NN0tUiav32Ky8r7xICDLxy_WQ-jJan9xSAyYkouRWf34aTZS_m-GASvr8GJEE_wX35SIEWhsUzBu9Jk1G54dIkJEZe441Ss9CRJhyydNSSnvRyj2MWCBdMQOiahGvZMs-MH6Df7jHQT1fmzj5djYGEcl5NZOkyBfk-4qWlySAFxO7vUgrk04jiq6ICc9iPjRiXrMu7cb79y4SR7nibkmBB_dD0A"
            />
            <p className="font-body-md text-on-surface-variant mb-md leading-relaxed">
              Precision in every pulse. Next-generation technology for creators and innovators.
            </p>
            <div className="flex space-x-sm">
              <a href="#" className="w-9 h-9 bg-surface-container rounded-lg flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary border border-outline-variant transition-colors" aria-label="Twitter">
                <span className="material-symbols-outlined text-[18px]">share</span>
              </a>
              <a href="#" className="w-9 h-9 bg-surface-container rounded-lg flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary border border-outline-variant transition-colors" aria-label="Support">
                <span className="material-symbols-outlined text-[18px]">contact_support</span>
              </a>
              <a href="#" className="w-9 h-9 bg-surface-container rounded-lg flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary border border-outline-variant transition-colors" aria-label="Email">
                <span className="material-symbols-outlined text-[18px]">mail</span>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="font-label-md text-on-surface mb-md uppercase tracking-wider">{section}</h3>
              <ul className="space-y-sm">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="font-body-md text-on-surface-variant hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-outline-variant pt-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-on-surface-variant font-label-sm">
            &copy; {new Date().getFullYear()} TechPro. All rights reserved.
          </p>
          <div className="flex gap-md">
            <Link to="/policies" className="font-label-sm text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/policies" className="font-label-sm text-on-surface-variant hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
