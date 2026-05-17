import { Link } from "@tanstack/react-router";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function TermsOfUse() {
  usePageTitle("Conditions d'utilisation");
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-12">
        <div className="mb-8">
          <Link to="/" className="text-primary hover:underline text-sm">
            ← Retour à l'accueil
          </Link>
        </div>

        <header className="mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-foreground">
            Conditions d'Utilisation
          </h1>
          <p className="text-muted-foreground text-lg">
            Règles d'utilisation de notre plateforme Blablabook
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
          </p>
        </header>

        <article className="prose prose-sm dark:prose-invert max-w-none space-y-8 text-foreground [&_p]:text-foreground [&_li]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_a]:text-primary [&_a]:hover:text-primary/80 [&_strong]:text-foreground [&_ul]:text-foreground">
          <section>
            <h2 className="text-2xl font-bold mb-4">
              1. Acceptation des Conditions
            </h2>
            <p>
              En accédant et en utilisant <strong>Blablabook</strong>, vous
              acceptez de vous conformer à ces Conditions d'Utilisation. Si vous
              n'acceptez pas ces conditions, nous vous demandons de ne pas
              utiliser ce site.
            </p>
            <p className="mt-3">
              L'éditeur se réserve le droit de modifier ces conditions à tout
              moment. Votre utilisation continue du site après les modifications
              indique votre acceptation des nouvelles conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              2. Utilisation Autorisée du Site
            </h2>
            <p>
              Vous acceptez d'utiliser ce site uniquement à des fins légitimes
              et conformément à la loi. En particulier :
            </p>
            <ul className="list-disc pl-4 sm:pl-5 space-y-2 mt-3">
              <li>Créer un compte personnel authentique</li>
              <li>Gérer votre bibliothèque de livres</li>
              <li>Rechercher et ajouter des livres</li>
              <li>Utiliser les fonctionnalités régulières du site</li>
              <li>Consulter les informations publiques sur les livres</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              3. Comportements Interdits
            </h2>
            <p>Vous acceptez de ne pas :</p>

            <ul className="list-disc pl-4 sm:pl-5 space-y-3 mt-3">
              <li>
                <strong>Commettre des délits ou fraudes :</strong> Ne pas
                utiliser le site pour des activités illégales
              </li>
              <li>
                <strong>Accès automatisé :</strong> Pas de scraping, crawling ou
                accès automatisé sans permission
              </li>
              <li>
                <strong>Tentatives de piratage :</strong> Aucune tentative de
                hacker ou de contourner la sécurité
              </li>
              <li>
                <strong>Contenu offensant :</strong> Pas de contenu illégal,
                offensant ou discriminatoire
              </li>
              <li>
                <strong>Usurpation d'identité :</strong> Ne pas créer plusieurs
                comptes ou usurper l'identité d'une autre personne
              </li>
              <li>
                <strong>Spam et malveillance :</strong> Aucun spam, virus ou
                contenu malveillant
              </li>
              <li>
                <strong>Propriété intellectuelle :</strong> Ne pas reproduire ou
                distribuer du contenu protégé
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              4. Votre Compte Utilisateur
            </h2>

            <div className="space-y-3">
              <div>
                <h3 className="font-bold mb-2">4.1 Responsabilité du compte</h3>
                <p className="text-sm">
                  Vous êtes responsable de la confidentialité de votre mot de
                  passe et de toutes les activités qui se déroulent sous votre
                  compte. Vous acceptez de notifier immédiatement l'éditeur de
                  tout accès non autorisé.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">4.2 Données précises</h3>
                <p className="text-sm">
                  Vous vous engagez à fournir des informations exactes,
                  actuelles et complètes lors de la création de votre compte.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">4.3 Suppression de compte</h3>
                <p className="text-sm">
                  Vous pouvez supprimer votre compte à tout moment. Lors de la
                  suppression, vos données personnelles seront supprimées
                  conformément à notre Politique de Confidentialité.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              5. Contenu que Vous Créez
            </h2>

            <div className="space-y-3">
              <div>
                <h3 className="font-bold mb-2">5.1 Sélection d'avatar</h3>
                <p className="text-sm">
                  Vous pouvez choisir un avatar parmi notre sélection
                  prédéfinie. Cet avatar est affiché publiquement sur votre
                  profil et dans les listes utilisateurs. Tous les avatars sont
                  la propriété de Blablabook. Vous autorisez Blablabook à
                  utiliser votre choix d'avatar pour les fonctionnalités du
                  profil.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">5.2 Bibliothèque de livres</h3>
                <p className="text-sm">
                  Votre bibliothèque personnelle est confidentiellement stockée.
                  Vous restez propriétaire des données dans votre bibliothèque.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">
                  5.3 Responsabilité du contenu
                </h3>
                <p className="text-sm">
                  Vous êtes entièrement responsable du contenu que vous publiez.
                  L'éditeur peut supprimer tout contenu qui viole ces
                  conditions.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              6. Propriété Intellectuelle
            </h2>
            <p>
              Tout le contenu du site (code, design, textes, avatars) est la
              propriété intellectuelle de l'éditeur sauf indication contraire.
            </p>
            <p className="mt-3">
              Les couvertures de livres et descriptions proviennent
              d'OpenLibrary et sont soumises à leurs droits d'auteur respectifs.
            </p>
            <p className="mt-3">
              Les avatars disponibles dans Blablabook sont la propriété
              intellectuelle de l'éditeur. Vous autorisez Blablabook à afficher
              votre avatar choisi uniquement à des fins de fonctionnalité de
              profil.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              7. Limitation de Responsabilité
            </h2>

            <div className="bg-muted p-3 sm:p-4 rounded space-y-2 border-l-4 border-primary">
              <p className="font-bold">Important</p>
              <p className="text-sm">
                Le site et son contenu sont fournis "en l'état" sans aucune
                garantie. L'éditeur ne peut pas être tenu responsable de :
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>La perte de données</li>
                <li>Les dommages directs ou indirects</li>
                <li>L'indisponibilité du service</li>
                <li>Les erreurs de données provenant d'OpenLibrary</li>
                <li>L'utilisation non autorisée du site par des tiers</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              8. Disponibilité du Service
            </h2>
            <p>
              L'éditeur ne garantit pas la disponibilité 24/7 du site. Le
              service peut être interrompu pour :
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Maintenance programmée</li>
              <li>Mises à jour de sécurité</li>
              <li>Problèmes techniques</li>
              <li>Causes indépendantes de la volonté de l'éditeur</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              9. OpenLibrary API - Conditions Externes
            </h2>
            <p>
              Les données sur les livres proviennent d'OpenLibrary, qui a ses
              propres conditions d'utilisation et d'usages. Blablabook ne
              contrôle pas :
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>L'exactitude des données des livres</li>
              <li>La disponibilité de l'API OpenLibrary</li>
              <li>Les modifications des conditions d'OpenLibrary</li>
            </ul>
            <p className="mt-3 text-sm">
              Visitez{" "}
              <a
                href="https://openlibrary.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                OpenLibrary.org
              </a>{" "}
              pour plus d'informations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              10. Loi Applicable et Juridiction
            </h2>
            <p>
              Ces Conditions d'Utilisation sont régies par la loi française.
              Tout litige sera d'abord soumis à un processus d'accord amiable.
              En cas d'échec, les tribunaux français sont compétents.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              11. Questions sur les Conditions
            </h2>
            <div className="bg-muted p-3 sm:p-4 rounded-lg">
              <p>
                <strong>Contactez-nous :</strong>{" "}
                <a
                  href="mailto:contact@blablabook.local"
                  className="text-primary hover:underline"
                >
                  contact@blablabook.local
                </a>
              </p>
            </div>
          </section>

          <div className="border-t pt-4 mt-8">
            <p className="text-xs text-muted-foreground">
              <strong>Droits d'auteur :</strong> © Blablabook{" "}
              {new Date().getFullYear()}. Tous droits réservés. |
              <strong> Liens connexes :</strong>{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                Politique de Confidentialité
              </Link>{" "}
              |{" "}
              <Link to="/legal" className="text-primary hover:underline">
                Mentions Légales
              </Link>
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}
