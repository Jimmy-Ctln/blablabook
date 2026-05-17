import { Link } from "@tanstack/react-router";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function LegalNotice() {
  usePageTitle("Mentions légales");
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
            Mentions Légales
          </h1>
          <p className="text-muted-foreground text-lg">
            Conformes à la loi française et aux directives CNIL
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
          </p>
        </header>

        <article className="prose prose-sm dark:prose-invert max-w-none space-y-8 text-foreground [&_p]:text-foreground [&_li]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_a]:text-primary [&_a]:hover:text-primary/80 [&_strong]:text-foreground [&_ul]:text-foreground">
          <section>
            <h2 className="text-2xl font-bold mb-4">
              1. Édition et Responsabilité
            </h2>
            <div className="bg-muted p-3 sm:p-4 rounded-lg space-y-3">
              <div>
                <p className="font-bold">Nom du site :</p>
                <p>Blablabook</p>
              </div>
              <div>
                <p className="font-bold">Éditeur et responsable :</p>
                <p>Jimmy (Développeur)</p>
              </div>
              <div>
                <p className="font-bold">Statut :</p>
                <p>Plateforme éducative/Démonstration pédagogique</p>
              </div>
              <div>
                <p className="font-bold">Contact :</p>
                <p>
                  <a
                    href="mailto:contact@blablabook.local"
                    className="text-primary hover:underline"
                  >
                    contact@blablabook.local
                  </a>
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              2. Conditions d'Accès au Site
            </h2>
            <p>
              L'accès au site <strong>Blablabook</strong> est gratuit pour tous
              les utilisateurs. L'éditeur s'efforce de rendre ce site accessible
              à tous.
            </p>
            <p className="mt-4">
              Néanmoins, certaines fonctionnalités nécessitent une création de
              compte et une authentification.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              3. Contenu Fourni par le Site
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-bold mb-2">3.1 Données de livres</h3>
                <p className="text-sm">
                  Les données sur les livres proviennent de l'API{" "}
                  <strong>OpenLibrary</strong> et sont soumises à leurs
                  conditions d'utilisation. Les données sur les livres
                  proviennent de l'API OpenLibrary et sont soumises à leurs
                  conditions d'utilisation.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">3.2 Propriété intellectuelle</h3>
                <p className="text-sm">
                  Le code source et le design de Blablabook sont la propriété
                  intellectuelle de l'éditeur. Les utilisateurs conservent les
                  droits sur le contenu qu'ils créent (photos de profil,
                  annotations).
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">3.3 Photographies et images</h3>
                <p className="text-sm">
                  Les couvertures de livres et images proviennent d'OpenLibrary.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              4. Garanties et Limitations de Responsabilité
            </h2>

            <div className="space-y-3">
              <div className="bg-muted p-3 rounded border-l-4 border-primary">
                <p className="font-bold text-sm">
                  Le site est fourni "en l'état"
                </p>
                <p className="text-sm mt-1">
                  Sans aucune garantie explicite ou implicite, y compris de
                  commercialité ou d'adéquation à un usage particulier.
                </p>
              </div>

              <div className="bg-muted p-3 rounded border-l-4 border-primary">
                <p className="font-bold text-sm">Disponibilité du service</p>
                <p className="text-sm mt-1">
                  L'éditeur ne garantit pas la disponibilité continue du
                  service. Des interruptions peuvent survenir pour maintenance.
                </p>
              </div>

              <div className="bg-muted p-3 rounded border-l-4 border-primary">
                <p className="font-bold text-sm">Exactitude des données</p>
                <p className="text-sm mt-1">
                  L'éditeur ne garantit pas l'exactitude des données sur les
                  livres provenant d'OpenLibrary.
                </p>
              </div>

              <div className="bg-muted p-3 rounded border-l-4 border-primary">
                <p className="font-bold text-sm">
                  Limitation de responsabilité
                </p>
                <p className="text-sm mt-1">
                  L'éditeur ne sera en aucun cas responsable des dommages
                  indirects, accidentels ou consécutifs résultant de
                  l'utilisation du site.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Données Personnelles</h2>
            <p>
              Pour les informations détaillées sur le traitement de vos données
              personnelles, consultez notre{" "}
              <Link
                to="/privacy"
                className="text-primary hover:underline font-bold"
              >
                Politique de Confidentialité
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              6. Cookies et Technologies de Suivi
            </h2>
            <p>
              Le site utilise des cookies essentiels pour fonctionner. Vous
              pouvez configurer votre navigateur pour les refuser, mais
              certaines fonctionnalités peuvent ne pas fonctionner correctement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Liens Externes</h2>
            <p>
              Le site contient des liens vers des sites externes (notamment
              OpenLibrary). L'éditeur ne peut pas être tenu responsable du
              contenu de ces sites externes. Nous vous recommandons de consulter
              leurs conditions d'utilisation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Hébergement</h2>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p>
                <strong>Plateforme d'hébergement :</strong> Docker / Serveur de
                développement
              </p>
              <p>
                <strong>Version :</strong> Démonstration / Prototype pédagogique
              </p>
              <p className="text-sm text-muted-foreground">
                Ce site est une création éducative présentée comme projet
                étudiant.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              9. Modification des Mentions Légales
            </h2>
            <p>
              L'éditeur se réserve le droit de modifier à tout moment et sans
              préavis les présentes mentions légales. L'utilisation continue du
              site implique l'acceptation des modifications.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Juridiction</h2>
            <p>
              Les présentes mentions légales sont régies par la loi française.
              En cas de litiges, une solution amiable sera d'abord recherchée.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Pour Nous Contacter</h2>
            <div className="bg-muted p-3 sm:p-4 rounded-lg">
              <p>
                <strong>Email :</strong>{" "}
                <a
                  href="mailto:contact@blablabook.local"
                  className="text-primary hover:underline"
                >
                  contact@blablabook.local
                </a>
              </p>
              <p className="mt-2">
                <strong>Objet :</strong> Mentions légales de Blablabook
              </p>
            </div>
          </section>

          <div className="border-t pt-4 mt-8">
            <p className="text-xs text-muted-foreground">
              <strong>Bases légales :</strong> Loi Informatique et Libertés du 6
              janvier 1978, Directive 2002/58/CE, RGPD (2016/679)
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}
