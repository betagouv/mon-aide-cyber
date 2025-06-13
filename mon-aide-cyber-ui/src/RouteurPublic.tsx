import { Accueil } from './Accueil.tsx';
import './assets/styles/index.scss';
import { Route, Routes } from 'react-router-dom';
import { ComposantIntercepteur } from './composants/intercepteurs/ComposantIntercepteur.tsx';
import { EcranCharteAidant } from './vues/EcranCharteAidant.tsx';
import { ComposantCGU } from './vues/ComposantCGU.tsx';
import { MentionsLegales } from './vues/MentionsLegales.tsx';
import { LayoutPublic } from './composants/layout/LayoutPublic.tsx';
import { CapteurEcranCreationEspaceAidant } from './domaine/espace-aidant/demande-aidant-creation-espace-aidant/EcranCreationEspaceAidant.tsx';
import { LayoutCreationEspaceAidant } from './composants/layout/LayoutCreationEspaceAidant.tsx';
import { EcranAccessibilite } from './vues/EcranAccessibilite.tsx';
import { EcranStatistiques } from './domaine/vitrine/ecran-statistiques/EcranStatistiques.tsx';
import { EcranAnnuaire } from './domaine/vitrine/ecran-annuaire/EcranAnnuaire.tsx';
import { EcranConnexion } from './domaine/connexion/EcranConnexion.tsx';
import { EcranMotDePasseOublie } from './domaine/vitrine/mot-de-passe-oublie/EcranMotDePasseOublie.tsx';
import { EcranReinitialiserMotDePasse } from './domaine/vitrine/reinitialiser-mot-de-passe/EcranReinitialiserMotDePasse.tsx';
import { LayoutDiagnostic } from './composants/layout/LayoutDiagnostic.tsx';
import { EcranDiagnosticLibreAcces } from './composants/diagnostic/EcranDiagnosticAidant.tsx';
import { ComposantRestitutionLibreAcces } from './composants/diagnostic/ComposantRestitution/ComposantRestitution.tsx';
import { EcranDemandeAutodiagnostic } from './domaine/auto-diagnostic/EcranDemandeAutodiagnostic.tsx';
import { EcranSecurite } from './domaine/vitrine/ecran-securite/EcranSecurite.tsx';
import { EcranRepondreAUneDemande } from './domaine/gestion-demandes/repondre-a-une-demande/EcranRepondreAUneDemande.tsx';
import { PageCrisp } from './domaine/crisp/PageCrisp.tsx';
import { EcranInscription } from './domaine/connexion/ecran-inscription/EcranInscription.tsx';

export const RouteurPublic = () => {
  return (
    <Routes>
      <Route path="/" element={<LayoutPublic />}>
        <Route index element={<Accueil />} />
        <Route path="accessibilite" element={<EcranAccessibilite />} />
        <Route
          path="statistiques-utilisation"
          element={<EcranStatistiques />}
        />
        <Route path="cgu" element={<ComposantCGU />} />
        <Route path="securite" element={<EcranSecurite />} />
        <Route path="charte-aidant" element={<EcranCharteAidant />} />
        <Route
          path="relais-associatifs"
          element={
            <PageCrisp
              idArticle="relais-associatifs"
              key="relais-associatifs"
            />
          }
        />
        <Route path="beneficier-du-dispositif">
          <Route path="annuaire">
            <Route index element={<EcranAnnuaire />} />
          </Route>
        </Route>
        <Route
          path="guide-des-aidants-cyber"
          element={
            <PageCrisp
              idArticle="guide-aidant-cyber"
              key="guide-des-aidants-cyber"
            />
          }
        />
        <Route
          path="promouvoir-diagnostic-cyber"
          element={
            <PageCrisp
              idArticle="promouvoir-diagnostic-cyber"
              key="promouvoir-diagnostic-cyber"
            />
          }
        />
        <Route
          path="promouvoir-communaute-aidants-cyber"
          element={
            <PageCrisp
              key="promouvoir-communaute-aidants-cyber"
              idArticle="promouvoir-communaute-aidants-cyber"
            />
          }
        />
        <Route
          path="realiser-des-diagnostics-anssi"
          element={<EcranConnexion />}
        />
        <Route path="mentions-legales" element={<MentionsLegales />} />
      </Route>

      <Route element={<LayoutCreationEspaceAidant />}>
        <Route
          path="demandes/devenir-aidant/finalise"
          element={
            <ComposantIntercepteur
              composant={CapteurEcranCreationEspaceAidant}
            />
          }
        />
      </Route>

      <Route
        path="repondre-a-une-demande"
        element={<LayoutPublic afficheNavigation={false} enteteSimple={true} />}
      >
        <Route
          index
          element={
            <ComposantIntercepteur composant={EcranRepondreAUneDemande} />
          }
        />
      </Route>

      <Route
        path="/connexion"
        element={<LayoutPublic afficheNavigation={false} />}
      >
        <Route index element={<EcranConnexion />} />
      </Route>
      <Route
        path="/inscription"
        element={<LayoutPublic afficheNavigation={false} />}
      >
        <Route index element={<EcranInscription />} />
      </Route>
      <Route
        path="/diagnostic-libre-acces"
        element={<LayoutPublic afficheNavigation={false} />}
      >
        <Route index element={<EcranDemandeAutodiagnostic />} />
      </Route>
      <Route path="diagnostic" element={<LayoutDiagnostic />}>
        <Route
          path=":idDiagnostic"
          element={
            <ComposantIntercepteur composant={EcranDiagnosticLibreAcces} />
          }
        ></Route>
        <Route
          path=":idDiagnostic/restitution"
          element={
            <ComposantIntercepteur composant={ComposantRestitutionLibreAcces} />
          }
        ></Route>
      </Route>
      <Route
        path="/utilisateur"
        element={<LayoutPublic afficheNavigation={false} />}
      >
        <Route path="mot-de-passe-oublie" element={<EcranMotDePasseOublie />} />
        <Route
          path="reinitialiser-mot-de-passe"
          element={<EcranReinitialiserMotDePasse />}
        />
      </Route>
    </Routes>
  );
};
