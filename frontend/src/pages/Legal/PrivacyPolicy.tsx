import { Link } from "@tanstack/react-router";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function PrivacyPolicy() {
  usePageTitle("Politique de confidentialité");
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
            Politique de Confidentialité
          </h1>
          <p className="text-muted-foreground text-lg">
            Conforme au Règlement Général sur la Protection des Données (RGPD)
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
          </p>
        </header>

        <article className="prose prose-sm dark:prose-invert max-w-none space-y-8 text-foreground [&_p]:text-foreground [&_li]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_a]:text-primary [&_a]:hover:text-primary/80 [&_strong]:text-foreground [&_ul]:text-foreground">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p>
              Chez <strong>Blablabook</strong>, nous accordons une importance
              primordiale à la protection de vos données personnelles. Cette
              Politique de Confidentialité explique comment nous collectons,
              utilisons, partageons et protégeons vos informations en conformité
              avec le Règlement Général sur la Protection des Données (RGPD) et
              la législation française.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              2. Responsable de Traitement
            </h2>
            <div className="bg-muted p-3 sm:p-4 rounded-lg">
              <p>
                <strong>Blablabook</strong>
              </p>
              <p>Plateforme de gestion de bibliothèque numérique</p>
              <p>
                <strong>Responsable :</strong> Jimmy (Développeur)
              </p>
              <p>
                <strong>Contact RGPD :</strong>{" "}
                <a
                  href="mailto:contact@blablabook.local"
                  className="text-primary hover:underline"
                >
                  contact@blablabook.local
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              3. Données Personnelles Collectées
            </h2>

            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-bold mb-2">3.1 Données de compte</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Email</strong> - Utilisé pour l'authentification et
                    les communications
                  </li>
                  <li>
                    <strong>Mot de passe</strong> - Hashé et sécurisé, jamais
                    stocké en clair
                  </li>
                  <li>
                    <strong>Nom d'utilisateur</strong> - Affichage public sur
                    votre profil
                  </li>
                  <li>
                    <strong>Avatar/Sélection de profil</strong> - Avatar
                    prédéfini que vous choisissez parmi notre sélection
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-bold mb-2">3.2 Données de bibliothèque</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Livres ajoutés</strong> - Liste des livres dans
                    votre bibliothèque
                  </li>
                  <li>
                    <strong>ISBN des livres</strong> - Identifiant unique des
                    ouvrages
                  </li>
                  <li>
                    <strong>Historique de recherche</strong> - Requêtes pour
                    trouver des livres
                  </li>
                  <li>
                    <strong>Dates d'ajout</strong> - Timestamps des actions
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-bold mb-2">3.3 Données techniques</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Logs d'accès</strong> - Adresse IP, navigateur,
                    timestamp
                  </li>
                  <li>
                    <strong>Cookies</strong> - Pour la session et les
                    préférences utilisateur
                  </li>
                  <li>
                    <strong>Tokens JWT</strong> - Pour maintenir votre session
                    authentifiée
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              4. Base Légale du Traitement
            </h2>
            <p>
              Selon l'Article 6 du RGPD, nous traitons vos données sur les bases
              légales suivantes :
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <strong>Exécution du contrat</strong> (Art. 6.1.b) - Pour créer
                et gérer votre compte, fonctionnalités de bibliothèque
              </li>
              <li>
                <strong>Consentement</strong> (Art. 6.1.a) - Pour les cookies
                non-essentiels et marketing
              </li>
              <li>
                <strong>Obligations légales</strong> (Art. 6.1.c) - Si
                nécessaire pour se conformer à la loi
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              5. Durée de Conservation des Données
            </h2>
            <div className="space-y-3">
              <div className="bg-secondary p-3 rounded">
                <p className="font-bold">Données de compte :</p>
                <p className="text-sm">
                  Conservées pendant toute la durée de votre inscription + 30
                  jours après suppression
                </p>
              </div>
              <div className="bg-secondary p-3 rounded">
                <p className="font-bold">Données de bibliothèque :</p>
                <p className="text-sm">
                  Supprimées lors de la suppression du compte
                </p>
              </div>
              <div className="bg-secondary p-3 rounded">
                <p className="font-bold">Logs techniques :</p>
                <p className="text-sm">
                  Conservés 90 jours maximum pour la sécurité
                </p>
              </div>
              <div className="bg-secondary p-3 rounded">
                <p className="font-bold">Consentement cookies :</p>
                <p className="text-sm">13 mois maximum (CNIL 2020-062)</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              6. Vos Droits RGPD (Articles 15-22)
            </h2>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div>
                  <p className="font-bold">Droit d'accès</p>
                  <p className="text-sm">
                    Obtenir une copie de vos données personnelles
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div>
                  <p className="font-bold">Droit de rectification</p>
                  <p className="text-sm">
                    Corriger ou mettre à jour vos données
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div>
                  <p className="font-bold">Droit à l'oubli</p>
                  <p className="text-sm">
                    Demander la suppression de vos données
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div>
                  <p className="font-bold">
                    Droit à la limitation du traitement
                  </p>
                  <p className="text-sm">
                    Restreindre l'utilisation de vos données
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div>
                  <p className="font-bold">Droit à la portabilité</p>
                  <p className="text-sm">
                    Recevoir vos données dans un format structuré
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div>
                  <p className="font-bold">Droit d'opposition</p>
                  <p className="text-sm">
                    Vous opposer au traitement de vos données
                  </p>
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-200 dark:border-blue-800">
              Pour exercer vos droits, contactez-nous à{" "}
              <a
                href="mailto:contact@blablabook.local"
                className="text-primary hover:underline font-bold"
              >
                contact@blablabook.local
              </a>
              . Nous répondrons dans les 30 jours (Art. 12 RGPD).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              7. Partage de Vos Données
            </h2>
            <p>
              Vos données personnelles ne sont <strong>jamais vendues</strong> à
              des tiers. Nous pouvons les partager avec :
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <strong>Prestataires techniques</strong> - Hébergement,
                maintenance (sous contrats de sous-traitance)
              </li>
              <li>
                <strong>Obéissance légale</strong> - Si exigé par la loi ou une
                autorité judiciaire
              </li>
              <li>
                <strong>OpenLibrary API</strong> - Pour les recherches de livres
                externes (anonymisé)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Sécurité des Données</h2>
            <p>
              Nous mettons en œuvre des mesures de sécurité pour protéger vos
              données :
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <strong>Chiffrement HTTPS</strong> - Toutes les communications
                sont chiffrées
              </li>
              <li>
                <strong>Hachage des mots de passe</strong> - Jamais stockés en
                clair (bcrypt)
              </li>
              <li>
                <strong>Tokens JWT sécurisés</strong> - Authentification robuste
              </li>
              <li>
                <strong>Logs d'accès</strong> - Suivi des modifications
              </li>
              <li>
                <strong>Isolation des données</strong> - Accès restreint au
                besoin métier
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              9. Cookies et Technologies de Suivi
            </h2>
            <p>Nous utilisons des cookies essentiels pour :</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                📍 <strong>Cookie de session</strong> - Maintenir votre
                authentification
              </li>
              <li>
                <strong>LocalStorage</strong> - Stocker vos préférences (thème,
                consentement)
              </li>
              <li>
                🎯 <strong>Cookies facultatifs</strong> - Analytics (avec votre
                consentement explicite)
              </li>
            </ul>
            <p className="mt-4">
              Vous pouvez gérer vos préférences de cookies à tout moment via
              notre banneau de consentement ou les paramètres de votre
              navigateur.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              10. Modifications de cette Politique
            </h2>
            <p>
              Nous pouvons modifier cette Politique de Confidentialité à tout
              moment. Les modifications importantes seront communiquées par
              email ou via une notification sur le site. Votre utilisation
              continue du service indique votre acceptation des changements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Nous Contacter</h2>
            <p>Pour toute question sur cette Politique de Confidentialité :</p>
            <div className="bg-muted p-4 rounded-lg mt-4 space-y-2">
              <p>
                <strong>Email :</strong>{" "}
                <a
                  href="mailto:contact@blablabook.local"
                  className="text-primary hover:underline"
                >
                  contact@blablabook.local
                </a>
              </p>
              <p>
                <strong>Plateforme :</strong> Blablabook
              </p>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Vous avez également le droit de déposer une plainte auprès de la{" "}
              <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                CNIL
              </a>
              (Commission Nationale de l'Informatique et des Libertés) si vous
              estimez que vos droits ne sont pas respectés.
            </p>
          </section>

          <div className="border-t pt-4 mt-8">
            <p className="text-xs text-muted-foreground">
              <strong>Références légales :</strong> RGPD (2016/679), Loi
              Informatique et Libertés (20 janvier 1978 modifiée), Lignes
              directrices CNIL
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}
