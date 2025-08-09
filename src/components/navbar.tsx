import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BsCart, BsPerson, BsBoxArrowRight } from 'react-icons/bs';
import { toast } from 'react-toastify';
import './Navbar.css';

function Navbar() {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem('token'));
  const navigate = useNavigate();

  const checkLogin = () => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);

    window.addEventListener('authChanged', checkLogin);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('authChanged', checkLogin);
    };
  }, []);

  const navLinkStyles = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
    color: isActive ? '#64ffda' : '#ccd6f6',
    fontWeight: isActive ? 'bold' : 'normal',
    position: 'relative',
  });

  const handleBrandClick = () => {
    navigate('/Home');
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    toast.success('تم تسجيل الخروج بنجاح');

    window.dispatchEvent(new Event('authChanged'));

    navigate('/Home');
  };

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-dark ${scrolled ? 'navbar-scrolled' : ''}`}
      style={{ backgroundColor: '#0a192f', transition: 'all 0.3s ease' }}
    >
      <div className="container">
        <NavLink
          className="navbar-brand d-flex align-items-center"
          to="/Home"
          style={{
            color: '#64ffda',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            letterSpacing: '1px',
            cursor: 'pointer',
          }}
          onClick={handleBrandClick}
        >
          Local
          <BsCart style={{ marginLeft: '8px', fontSize: '1.5rem', color: 'white' }} />
        </NavLink>

        <button
          className={`navbar-toggler ${mobileMenuOpen ? 'collapsed' : ''}`}
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {['Home', 'Products', 'Cart', 'Contact', 'Categories'].map((item) => (
              <li className="nav-item" key={item}>
                <NavLink
                  className="nav-link"
                  to={`/${item}`}
                  style={navLinkStyles}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </NavLink>
              </li>
            ))}

            {/* Dropdown for Auth */}
            <li className="nav-item dropdown">
              <div
                className="nav-link dropdown-toggle d-flex align-items-center"
                style={{ cursor: 'pointer', color: '#ccd6f6' }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <BsPerson style={{ marginRight: '5px', fontSize: '1.2rem' }} />
                {isLoggedIn ? 'حسابي' : 'Account'}
              </div>
              <div
                className={`dropdown-menu dropdown-menu-end ${dropdownOpen ? 'show' : ''}`}
                style={{ backgroundColor: '#112240', borderColor: '#64ffda' }}
              >
                {isLoggedIn ? (
                  <>
                    <NavLink
                      className="dropdown-item"
                      to="/profile"
                      style={{ color: '#ccd6f6' }}
                      onClick={() => {
                        setDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      الملف الشخصي
                    </NavLink>
                    <button
                      className="dropdown-item"
                      style={{
                        color: '#ccd6f6',
                        background: 'none',
                        border: 'none',
                        textAlign: 'right',
                        width: '100%',
                      }}
                      onClick={handleLogout}
                    >
                      <BsBoxArrowRight style={{ marginLeft: '5px' }} />
                      تسجيل الخروج
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink
                      className="dropdown-item"
                      to="/login"
                      style={{ color: '#ccd6f6' }}
                      onClick={() => {
                        setDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      تسجيل الدخول
                    </NavLink>
                    <NavLink
                      className="dropdown-item"
                      to="/register"
                      style={{ color: '#ccd6f6' }}
                      onClick={() => {
                        setDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      إنشاء حساب
                    </NavLink>
                  </>
                )}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
