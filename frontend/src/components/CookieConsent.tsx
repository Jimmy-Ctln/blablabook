import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "@tanstack/react-router";

interface CookieConsent {
  essential: boolean;
  marketing: boolean;
  analytics: boolean;
  timestamp: number;
}

// 13 months in milliseconds (CNIL 2020-062 directive)
const CONSENT_EXPIRATION_MS = 13 * 30 * 24 * 60 * 60 * 1000;

function getInitialVisibility(): boolean {
  const stored = localStorage.getItem("cookieConsent");
  if (!stored) return true;
  try {
    const consent = JSON.parse(stored) as CookieConsent;
    if (Date.now() - consent.timestamp > CONSENT_EXPIRATION_MS) {
      localStorage.removeItem("cookieConsent");
      return true;
    }
    return false;
  } catch {
    localStorage.removeItem("cookieConsent");
    return true;
  }
}

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(getInitialVisibility);
  const [isExpanded, setIsExpanded] = useState(false);
  const [marketingEnabled, setMarketingEnabled] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  const handleMarketingChange = (checked: unknown) => {
    setMarketingEnabled(checked as boolean);
  };

  const handleAnalyticsChange = (checked: unknown) => {
    setAnalyticsEnabled(checked as boolean);
  };

  const handleAcceptAll = () => {
    const consent: CookieConsent = {
      essential: true,
      marketing: true,
      analytics: true,
      timestamp: Date.now(),
    };
    localStorage.setItem("cookieConsent", JSON.stringify(consent));
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const consent: CookieConsent = {
      essential: true, // Essential cookies are always needed
      marketing: false,
      analytics: false,
      timestamp: Date.now(),
    };
    localStorage.setItem("cookieConsent", JSON.stringify(consent));
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    const consent: CookieConsent = {
      essential: true,
      marketing: marketingEnabled,
      analytics: analyticsEnabled,
      timestamp: Date.now(),
    };
    localStorage.setItem("cookieConsent", JSON.stringify(consent));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-4">
        {/* Collapsed View */}
        {!isExpanded && (
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-bold mb-2 text-foreground">
                Préférences de Cookies
              </h3>
              <p className="text-base text-muted-foreground mb-4">
                Nous utilisons des cookies pour améliorer votre expérience. Vous
                pouvez accepter tous les cookies ou{" "}
                <button
                  onClick={() => setIsExpanded(true)}
                  className="text-primary hover:underline font-bold cursor-pointer"
                >
                  personnaliser
                </button>{" "}
                vos préférences.
              </p>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Expanded View */}
        {isExpanded && (
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h3 className="font-bold text-lg text-foreground">
                Gérer vos préférences de cookies
              </h3>
              <button
                onClick={() => setIsExpanded(false)}
                aria-label="Fermer"
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              {/* Essential Cookies */}
              <div className="border rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <Checkbox id="essential-checkbox" checked={true} disabled />
                  <div>
                    <label
                      htmlFor="essential-checkbox"
                      className="font-bold block text-foreground"
                    >
                      Cookies Essentiels
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Nécessaires pour le fonctionnement du site
                      (authentification, sessions)
                    </p>
                  </div>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="border rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="marketing-checkbox"
                    checked={marketingEnabled}
                    onCheckedChange={handleMarketingChange}
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="marketing-checkbox"
                      className="font-bold block text-foreground"
                    >
                      Cookies Marketing
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Nous aident à vous montrer des contenus pertinents
                      (optionnel)
                    </p>
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="border rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="analytics-checkbox"
                    checked={analyticsEnabled}
                    onCheckedChange={handleAnalyticsChange}
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="analytics-checkbox"
                      className="font-bold block text-foreground"
                    >
                      Cookies Analytics
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Nous permettent de comprendre comment vous utilisez
                      Blablabook (optionnel)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-4">
              Pour plus d'informations, consultez notre{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                Politique de Confidentialité
              </Link>
              .
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2 flex-wrap mt-2">
          {!isExpanded ? (
            <>
              <Button
                onClick={handleAcceptAll}
                size="sm"
                className="flex-1 sm:flex-none text-foreground"
              >
                Accepter tout
              </Button>
              <Button
                onClick={handleRejectAll}
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none text-foreground"
              >
                Refuser
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleSavePreferences}
                size="sm"
                className="flex-1 sm:flex-none text-foreground"
              >
                Enregistrer les préférences
              </Button>
              <Button
                onClick={handleAcceptAll}
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none text-foreground"
              >
                Accepter tout
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
