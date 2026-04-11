# Ressources Légales et RGPD - Blablabook

## 📚 Vue d'ensemble

Ce document fournit une référence complète des implémentations RGPD et légales de Blablabook, ainsi que les ressources officielles utilisées.

---

## Conformité RGPD

### 1. Articles du RGPD implémentés

| Article    | Titre                   | Implémentation                                |
| ---------- | ----------------------- | --------------------------------------------- |
| Art. 6     | Licéité du traitement   | Base légale explicite (contrat, consentement) |
| Art. 12-14 | Droits de l'utilisateur | Pages de politique claire                     |
| Art. 13-14 | Information RGPD        | Politique de Confidentialité complète         |
| Art. 15    | Droit d'accès           | Utilisateur peut télécharger ses données      |
| Art. 16    | Droit de rectification  | Modification du profil                        |
| Art. 17    | Droit à l'oubli         | Suppression de compte                         |
| Art. 21    | Droit d'opposition      | Gestion des cookies                           |
| Art. 32    | Sécurité des données    | Chiffrement HTTPS, hachage argon              |

### 2. Consentement aux cookies

- **Bannière CNIL-conforme** : Affichée au premier accès
- **Consentement explicite** : "Accepter tout", "Refuser", "Personnaliser"
- **Stockage local** : `localStorage['cookieConsent']`
- **Durée recommandée** : 13 mois max (CNIL 2020-062)
- **Révocation facile** : Utilisateur peut changer d'avis

### 3. Traitement des données

**Données collectées :**

- Email (authentification)
- Mot de passe (hashé avec argon)
- Nom d'utilisateur (affichage public)
- Avatar sélectionné (parmi sélection prédéfinie)

**Durée de conservation :**

- Compte actif : pendant l'utilisation
- Après suppression : 30 jours
- Cookies consentement : 13 mois

---

## 📄 Pages Légales Implémentées

### 1. Politique de Confidentialité (`/privacy`)

**Conforme à :** RGPD Articles 13-14  
**Contenu :**

- Responsable de traitement
- Données collectées et pourquoi
- Base légale du traitement
- Droits RGPD (accès, rectification, suppression, etc.)
- Partage de données
- Mesures de sécurité
- Cookies
- Durée de conservation

**Fichier :** `/frontend/src/pages/Legal/PrivacyPolicy.tsx`

### 2. Mentions Légales (`/legal`)

**Conforme à :** Loi française  
**Contenu :**

- Identification éditeur
- Conditions d'accès
- Propriété intellectuelle
- Limitations de responsabilité
- Protection données
- Hébergement
- Juridiction

**Fichier :** `/frontend/src/pages/Legal/LegalNotice.tsx`

### 3. Conditions d'Utilisation (`/terms`)

**Conforme à :** Droit français + RGPD  
**Contenu :**

- Acceptation des conditions
- Utilisation autorisée
- Comportements interdits
- Gestion de compte
- Contenu utilisateur
- Propriété intellectuelle
- Limitations de responsabilité

**Fichier :** `/frontend/src/pages/Legal/TermsOfUse.tsx`

### 4. Banneau Cookie Consent

**Conforme à :** CNIL directives  
**Fonctionnalités :**

- Affichage au premier accès
- Mode classique (Accepter/Refuser)
- Mode avancé (personnalisation)
- Sauvegarde des préférences

**Fichier :** `/frontend/src/components/CookieConsent.tsx`

---

## Intégration dans l'application

### Routes

```typescript
// frontend/src/routes/routes.tsx
- /privacy          → Politique de Confidentialité
- /legal            → Mentions Légales
- /terms            → Conditions d'Utilisation
```

### Composants

```typescript
// Footer.tsx - Liens vers pages légales
// CookieConsent.tsx - Banneau cookie (affichage automatique)
// RootLayout.tsx - Intégration CookieConsent
```

### Stockage du consentement

```javascript
// localStorage structure
cookieConsent: {
  essential: true,      // Toujours true
  marketing: false,     // Optionnel
  analytics: false,     // Optionnel
  timestamp: 1234567890 // Date d'acceptation
}
```

### Expiration du consentement (13 mois - CNIL)

Le consentement **expire automatiquement après 13 mois** (directive CNIL 2020-062) :

```typescript
// Chaque fois que la page charge
const CONSENT_EXPIRATION = 13 * 30 * 24 * 60 * 60 * 1000; // 13 mois

const storedConsent = localStorage.getItem("cookieConsent");
const consentAge = Date.now() - storedConsent.timestamp;

if (consentAge > CONSENT_EXPIRATION) {
  localStorage.removeItem("cookieConsent");
  // Banneau réapparaît
}
```

---

## Approche MVP vs Production

### Implémentation actuelle

- localStorage uniquement (par navigateur)
- Consentement expire après 13 mois (directive CNIL 2020-062)
- Pas de tracking entre navigateurs

### Approche production

- Base de données `user_consents` liée au compte
- Historique complet pour audit légal
- Consentement persistent même avec changement de navigateur
- Logs traçables pour conformité RGPD

---

## 📖 Ressources officielles de référence

### CNIL (Commission Nationale de l'Informatique et des Libertés)

- **Site officiel :** https://www.cnil.fr
- **Directive cookies :** CNIL 2020-062

### RGPD (Règlement Général sur la Protection des Données)

- **Texte officiel :** https://eur-lex.europa.eu/eli/reg/2016/679/oj/fra

### OpenLibrary API

- **Documentation :** https://openlibrary.org/developers
- **Conditions d'utilisation :** https://openlibrary.org/terms

### Loi française

- **Loi Informatique et Libertés :** 6 janvier 1978 (modifiée par ordonnance 2018-1125)

---

## ✅ Checklist de conformité

- [x] Politique de Confidentialité publiée
- [x] Mentions Légales publiées
- [x] Conditions d'Utilisation publiées
- [x] Banneau consentement cookies RGPD
- [x] Consentement **expire après 13 mois** (CNIL 2020-062)
- [x] Données hachées (argon)
- [x] HTTPS/TLS activé
- [x] Droit d'accès implémenté
- [x] Droit de modification implémenté
- [x] Droit de suppression implémenté
- [x] Durée de conservation documentée
- [x] Base légale explicite
- [x] Responsable traitement identifié
- [x] Cookies essentiels vs optionnels séparés

---

## 📞 Contact

**Questions sur la conformité :**  
Email : contact@blablabook.local

**Contact CNIL (en cas de problème réel) :**  
https://www.cnil.fr/fr/nous-contacter

---

## 📅 Historique des modifications

| Date         | Version | Modification                                     |
| ------------ | ------- | ------------------------------------------------ |
| 29 mars 2026 | 1.0     | Création initiale - Implémentation RGPD complète |

---

**Dernière mise à jour :** 29 mars 2026  
**Responsable :** Jimmy (Développeur)  
**Statut :** ✅ Conforme RGPD
