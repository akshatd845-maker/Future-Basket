import { useState, useEffect, useCallback } from 'react';
import './CookieConsent.css';

/**
 * CookieConsent Component
 *
 * A premium, accessible cookie consent banner designed for e-commerce.
 * Features:
 * - Clear visual hierarchy with primary CTA prominence
 * - WCAG 2.1 AA compliant (4.5:1 minimum contrast)
 * - 48px minimum touch targets for mobile
 * - Keyboard navigable with proper focus management
 * - LocalStorage persistence
 * - Smooth animations for polish
 * - Responsive design (mobile-first)
 *
 * UX Best Practices Applied:
 * - Action-oriented button copy ("Accept All" vs "Allow")
 * - Trust signals (privacy link, purpose explanation)
 * - Minimal friction for primary action
 * - Secondary action is less prominent but accessible
 */

const COOKIE_CONSENT_KEY = 'future_basket_cookie_consent';

const CookiePurposeItem = ({ icon, text }) => (
  <li className="cookie-purpose-item">
    <span className="cookie-purpose-icon" aria-hidden="true">{icon}</span>
    <span className="cookie-purpose-text">{text}</span>
  </li>
);

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });
  const [isAnimating, setIsAnimating] = useState(false);

  // Check for existing consent on mount
  useEffect(() => {
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!savedConsent) {
      // Small delay for smooth entrance
      setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, 800);
    }
  }, []);

  const saveConsent = useCallback((consent) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
      ...consent,
      timestamp: new Date().toISOString(),
    }));
  }, []);

  const handleAcceptAll = () => {
    const fullConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    saveConsent(fullConsent);
    animateOut();
  };

  const handleAcceptNecessary = () => {
    const minimalConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    saveConsent(minimalConsent);
    animateOut();
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
    animateOut();
  };

  const handlePreferencesChange = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const animateOut = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  const togglePreferences = () => {
    setShowPreferences(!showPreferences);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`cookie-consent-overlay ${isAnimating ? 'visible' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div className={`cookie-consent-banner ${isAnimating ? 'animate-in' : 'animate-out'}`}>
        {!showPreferences ? (
          // Main Banner View
          <div className="cookie-consent-main">
            <div className="cookie-consent-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 5v2M12 17v2M5 12h2M17 12h2"/>
              </svg>
            </div>

            <div className="cookie-consent-content">
              <h2 id="cookie-consent-title" className="cookie-consent-title">
                Your Privacy Matters
              </h2>
              <p id="cookie-consent-description" className="cookie-consent-description">
                We use cookies to enhance your shopping experience, analyze site traffic,
                and personalize content. By clicking "Accept All", you consent to our use of cookies.
              </p>

              <ul className="cookie-purpose-list" aria-label="Cookie purposes">
                <CookiePurposeItem icon="✓" text="Essential for checkout & account" />
                <CookiePurposeItem icon="📊" text="Help us improve our store" />
                <CookiePurposeItem icon="🔒" text="Your data stays private" />
              </ul>
            </div>

            <div className="cookie-consent-actions">
              <button
                type="button"
                className="cookie-btn cookie-btn-secondary"
                onClick={togglePreferences}
                aria-expanded={showPreferences}
              >
                Customize
              </button>
              <button
                type="button"
                className="cookie-btn cookie-btn-primary"
                onClick={handleAcceptNecessary}
                autoFocus
              >
                Reject Non-Essential
              </button>
              <button
                type="button"
                className="cookie-btn cookie-btn-accent"
                onClick={handleAcceptAll}
              >
                Accept All
              </button>
            </div>

            <div className="cookie-consent-footer">
              <a href="/privacy" className="cookie-link">
                Privacy Policy
              </a>
              <span className="cookie-divider" aria-hidden="true">|</span>
              <a href="/cookies" className="cookie-link">
                Cookie Policy
              </a>
            </div>
          </div>
        ) : (
          // Preferences Panel View
          <div className="cookie-preferences-panel">
            <div className="cookie-preferences-header">
              <h2 id="cookie-preferences-title" className="cookie-preferences-title">
                Cookie Preferences
              </h2>
              <button
                type="button"
                className="cookie-preferences-close"
                onClick={togglePreferences}
                aria-label="Close preferences and return to main banner"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <p className="cookie-preferences-description">
              Manage your cookie preferences. Essential cookies cannot be disabled.
            </p>

            <div className="cookie-preferences-options" role="group" aria-label="Cookie category preferences">
              {/* Necessary Cookies - Always Required */}
              <div className="cookie-preference-item cookie-preference-item--disabled">
                <div className="cookie-preference-info">
                  <h3 className="cookie-preference-name">Essential Cookies</h3>
                  <p className="cookie-preference-description">
                    Required for the website to function. Cannot be disabled.
                  </p>
                </div>
                <div className="cookie-preference-toggle">
                  <input
                    type="checkbox"
                    id="cookie-necessary"
                    checked={preferences.necessary}
                    disabled
                    className="cookie-checkbox cookie-checkbox--disabled"
                    aria-disabled="true"
                  />
                  <label htmlFor="cookie-necessary" className="cookie-checkbox-label">
                    <span className="cookie-checkbox-custom cookie-checkbox-custom--checked" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    </span>
                  </label>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="cookie-preference-item">
                <div className="cookie-preference-info">
                  <h3 className="cookie-preference-name">Analytics Cookies</h3>
                  <p className="cookie-preference-description">
                    Help us understand how visitors interact with our website.
                  </p>
                </div>
                <div className="cookie-preference-toggle">
                  <input
                    type="checkbox"
                    id="cookie-analytics"
                    checked={preferences.analytics}
                    onChange={() => handlePreferencesChange('analytics')}
                    className="cookie-checkbox"
                  />
                  <label htmlFor="cookie-analytics" className="cookie-checkbox-label">
                    <span className="cookie-checkbox-custom" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    </span>
                  </label>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="cookie-preference-item">
                <div className="cookie-preference-info">
                  <h3 className="cookie-preference-name">Marketing Cookies</h3>
                  <p className="cookie-preference-description">
                    Used to deliver personalized advertisements.
                  </p>
                </div>
                <div className="cookie-preference-toggle">
                  <input
                    type="checkbox"
                    id="cookie-marketing"
                    checked={preferences.marketing}
                    onChange={() => handlePreferencesChange('marketing')}
                    className="cookie-checkbox"
                  />
                  <label htmlFor="cookie-marketing" className="cookie-checkbox-label">
                    <span className="cookie-checkbox-custom" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="cookie-preferences-actions">
              <button
                type="button"
                className="cookie-btn cookie-btn-secondary"
                onClick={togglePreferences}
              >
                Back
              </button>
              <button
                type="button"
                className="cookie-btn cookie-btn-accent"
                onClick={handleSavePreferences}
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieConsent;