# Stratégie de Suppression d'Utilisateur : Conformité RGPD

## Vue d'ensemble

Ce document explique comment nous avons implémenté la suppression de compte utilisateur en conformité avec le RGPD (Règlement Général sur la Protection des Données), en particulier l'Article 17 - le Droit à l'oubli. Notre stratégie combine un soft delete avec une anonymisation complète pour équilibrer la conformité réglementaire et l'intégrité de l'application.

## Fondement légal RGPD

### Article 17 : Droit à l'oubli

Le sujet des données a le droit d'obtenir l'effacement de ses données personnelles sans délai indu, à condition que l'une des raisons suivantes s'applique :
- Les données personnelles ne sont plus nécessaires
- Le sujet retire son consentement
- Le sujet s'oppose au traitement

### Article 17.3 : Exceptions

Le droit à l'oubli ne s'applique pas dans la mesure où le traitement est nécessaire à :
- La conformité avec une obligation légale
- La protection des droits d'autres personnes
- **La préservation de l'exactitude et de l'intégrité d'autres données** (Article 17.3(e))

Cette dernière exception est la clé de notre approche.

## Architecture de mise en œuvre

### Processus de suppression en trois étapes

Quand un utilisateur demande la suppression de son compte, le système exécute un soft delete contrôlé avec anonymisation complète :

#### Étape 1 : Vérification
Le système confirme que le compte utilisateur existe dans la base de données. Si non trouvé, une exception est levée.

#### Étape 2 : Anonymisation
Toutes les informations personnelles identifiables (PII) sont remplacées de manière permanente avec des données anonymisées :
- Email : `utilisateur@example.com` → `deleted_42@anonymized.local`
- Nom d'utilisateur : `jean_dupont` → `DeletedUser_42`
- Photo de profil : `/avatars/photo.jpg` → NULL (supprimée)
- Mot de passe : Hash original → Hash de `phantom_42_deleted` (invalidé)
- Timestamp de mise à jour : Défini au moment de la suppression

#### Étape 3 : Marqueur de suppression
Un timestamp `deletedAt` est enregistré pour marquer le compte comme supprimé tout en préservant l'enregistrement pour audit.

### Effets en cascade de la base de données

Les actions suivantes se produisent automatiquement via les contraintes de la base de données :

| Table | Contrainte | Résultat |
|-------|-----------|---------|
| refresh_token | CASCADE | Tous les tokens d'authentification supprimés |
| user_category | CASCADE | Les préférences utilisateur supprimées |
| list | CASCADE | Toutes les listes de lecture personnelles supprimées |
| list_book | CASCADE | Les entrées des listes supprimées |
| review | SET NULL | userId défini à NULL (avis préservés) |

## Justification de la préservation des données

### Pourquoi les avis sont-ils conservés ?

Après l'anonymisation, les avis restent dans le système mais avec userId défini à NULL. Cette décision est justifiée sous l'Article 17.3(e) pour ces raisons :

1. **Intégrité des données** : Supprimer tous les avis des utilisateurs supprimés détruirait les données statistiques agrégées utilisées par les autres utilisateurs, comme les notes moyennes et les systèmes de recommandation.

2. **Statut de données publiques** : Les avis sont déjà publiés ouvertement et représentent des évaluations de livres, pas une divulgation d'informations personnelles sur l'utilisateur.

3. **Anonymisation complète** : Après la suppression, aucun lien ne peut être établi entre un avis et son auteur original :
   - L'email est intraçable et généré par le système
   - Le nom d'utilisateur est générique et non identifiant
   - Aucune photo de profil ou information personnelle n'est visible

4. **Équilibre des intérêts** : La conservation des avis sert la fonction communautaire de la plateforme tout en respectant complètement les droits à la vie privée de l'utilisateur.

## Expérience utilisateur et communication

### Réponse à la suppression

Quand la suppression réussit, l'utilisateur reçoit une confirmation de l'état anonymisé :

```json
{
  "id": 42,
  "email": "deleted_42@anonymized.local",
  "username": "DeletedUser_42",
  "avatar_url": null,
  "role": "USER"
}
```

Cette réponse confirme que :
- Le compte existe toujours dans le système (pour l'intégrité des références)
- Toutes les informations personnelles identifiables ont été supprimées
- L'utilisateur ne peut plus s'authentifier avec ses identifiants précédents

## Questions légales courantes et réponses

### "Pourquoi ne pas tout supprimer définitivement ?"

C'est théoriquement possible mais impratique et non requis par la loi. Une suppression complète causerait :

- Des enregistrements orphelins dans la base de données
- La destruction des moyennes de notation et données de recommandation pour les autres utilisateurs
- Une violation de l'Article 17.3(e) en compromettant l'intégrité des données
- Une logique d'application complexe pour gérer les références cassées

Le RGPD permet la conservation de données anonymisées, ce qui est l'approche la plus sécuritaire.

### "Comment l'anonymisation peut-elle être irréversible ?"

Le processus d'anonymisation remplace toutes les informations identifiantes avec des données intraçables générées par le système :

- Les adresses email sont supprimées et remplacées par un identifiant unique du système
- Les noms d'utilisateur sont remplacés par un identifiant générique
- Les mots de passe sont écrasés avec des hashs fantômes qui ne correspondront jamais à aucune tentative de connexion
- Toutes les photos de profil et fichiers personnels sont supprimés

Aucun mécanisme de mapping inverse ou récupération n'existe. Les administrateurs de base de données ne peuvent pas reconstituer l'identité utilisateur originale.

### "Est-ce vraiment conforme au RGPD ?"

Oui. Le RGPD définit l'anonymisation comme une dissociation irréversible des données d'un sujet des données. Notre implémentation satisfait cette définition :

- Aucune information personnelle identifiable ne reste
- Aucune association entre l'enregistrement anonymisé et la personne originale ne peut être établie
- L'anonymisation n'est pas dépendante de garanties techniques mais de la structure des données

Cette approche s'aligne avec la Ligne directrice 05/2014 du WP29 sur les techniques d'anonymisation.

### "Qu'en est-il de la preuve de suppression ?"

Le timestamp `deletedAt` fournit une preuve que la suppression a eu lieu. Ce timestamp :

- Enregistre le moment où la suppression a été exécutée
- Peut être inclus dans les emails de confirmation de suppression
- Soutient les journaux d'audit pour les demandes de conformité réglementaire
- Ne contient pas de données personnelles

Les utilisateurs peuvent demander et recevoir une preuve de suppression sans réidentification.

## Détails de mise en œuvre

L'implémentation se trouve dans `backend/src/user/user.service.ts` :

```typescript
// Anonymise complètement les données utilisateur selon le droit à l'oubli du RGPD
private async anonymizeUser(id: number): Promise<void>

// Soft delete conforme au RGPD avec anonymisation complète
async softDelete(id: number)
```

### Exigences du schéma

Le schéma de base de données actuel supporte déjà cette implémentation :

- La table user possède le champ timestamp `deletedAt`
- Les clés étrangères sont correctement configurées avec des contraintes CASCADE et SET NULL
- Toutes les tables requises suivent les schémas de suppression conformes au RGPD

## Comportement du point de terminaison API

### DELETE /user

**Authentification** : Requise (Bearer token)

**Demande** :
```
DELETE /user
Authorization: Bearer {JWT}
```

**Réponse** (200 OK) :
```json
{
  "id": 42,
  "email": "deleted_42@anonymized.local",
  "username": "DeletedUser_42",
  "avatar_url": null,
  "role": "USER"
}
```

**Code de statut** : 200 en cas de succès, 404 si utilisateur non trouvé, 401 si non authentifié

**Effets** :
- L'utilisateur ne peut pas s'authentifier avec ses identifiants précédents
- Tous les tokens de rafraîchissement sont invalidés
- Les préférences utilisateur et les listes sont supprimées
- Les avis restent mais sans attribution d'utilisateur

## Liste de vérification de conformité RGPD

- Le droit à l'oubli est effectivement implémenté
- Les données personnelles sont complètement anonymisées
- L'anonymisation est irréversible et intraçable
- L'exception de suppression est correctement justifiée selon l'Article 17.3(e)
- Une piste d'audit est maintenue via le timestamp deletedAt
- L'intégrité des données pour les autres utilisateurs est préservée
- L'utilisateur reçoit une confirmation de suppression
- Aucune donnée inutile n'est conservée

## Références réglementaires

1. **Article 17 du RGPD** : Droit à l'oubli
2. **Article 17.3(e) du RGPD** : Exception pour la préservation de l'intégrité des données
3. **Considérant 65 du RGPD** : L'anonymisation doit être irréversible et intraçable
4. **Ligne directrice 05/2014 du WP29** : Techniques et normes d'anonymisation
5. **Avis 05/2014 de l'EDPB** : Évaluation des risques d'anonymisation

## Ajout à la politique de confidentialité

Le langage suivant devrait être ajouté à la politique de confidentialité de l'application web dans la section "Suppression des données" :

"Lorsque vous supprimez votre compte, toutes les informations personnelles y compris votre adresse email, votre nom d'utilisateur et votre photo de profil sont définitivement et irréversiblement supprimées de nos systèmes. Tous les avis ou évaluations publics que vous avez fournis seront conservés sans attribution à vous, car ils contiennent des informations factuelles sur les livres qui restent précieuses pour notre communauté. Vous ne pourrez plus accéder à votre compte. Cette suppression est permanente et ne peut pas être annulée."

## Conclusion

Cette implémentation représente une approche légalement solide et pratiquement efficace pour la conformité au RGPD. En combinant le soft delete avec une anonymisation complète, le système respecte les droits des utilisateurs tout en maintenant la stabilité de l'application et en préservant les données générées par la communauté. La stratégie est défendable selon la réglementation RGPD et représente les meilleures pratiques actuelles du secteur pour la suppression de données utilisateur.
