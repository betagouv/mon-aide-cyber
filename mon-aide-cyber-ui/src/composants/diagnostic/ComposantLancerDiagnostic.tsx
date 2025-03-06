import { ReactElement, useCallback, useState } from 'react';
import { useModale, useNavigationMAC } from '../../fournisseurs/hooks.ts';

import { constructeurParametresAPI } from '../../fournisseurs/api/ConstructeurParametresAPI.ts';
import {
  MoteurDeLiens,
  ROUTE_MON_ESPACE,
} from '../../domaine/MoteurDeLiens.ts';
import { Lien } from '../../domaine/Lien.ts';
import { useMACAPI } from '../../fournisseurs/api/useMACAPI.ts';
import Button from '../atomes/Button/Button.tsx';
import { useNavigueVersModifierDiagnostic } from '../../fournisseurs/ContexteNavigationMAC.tsx';
import { Input } from '../atomes/Input/Input.tsx';
import './lancer-diagnostic.scss';
import { ChampsErreur } from '../alertes/Erreurs.tsx';

type ProprietesComposant = {
  surClick: () => void;
};
type ProprietesComposantLancerDiagnostic = {
  composant: ({
    surClick,
  }: ProprietesComposant) => ReactElement<
    HTMLButtonElement | HTMLAnchorElement
  >;
};

export const ComposantBoutonCreerDiagnostic = ({
  surClick,
}: ProprietesComposant): ReactElement<HTMLButtonElement> => {
  return (
    <button className="bouton-mac bouton-mac-primaire" onClick={surClick}>
      Créer un diagnostic
    </button>
  );
};

export const ComposantLienCreerDiagnostic = ({
  surClick,
}: ProprietesComposant): ReactElement<HTMLAnchorElement> => {
  return (
    <Button
      type="button"
      className="bouton-mac-icone-conteneur"
      variant="primary"
      onClick={surClick}
    >
      <span className="fr-icon-add-line"></span>
      <span>Créer un diagnostic</span>
    </Button>
  );
};
const RealiserUnDiagnostic = (proprietesRealiserUnDiagnostic: {
  surFermeture: () => void;
  surValidation: (emailEntiteAidee: string) => void;
  erreur: ReactElement | undefined;
}) => {
  const [emailEntiteAidee, setEmailEntiteAidee] = useState('');

  const surSaisieEmailEntiteAidee = useCallback(
    (email: string) => setEmailEntiteAidee(email),
    []
  );

  return (
    <>
      <section>
        <div>
          <fieldset>
            <div>
              <b>L’entité bénéficiaire a fait une demande en ligne</b>
            </div>
            <div className="fr-pt-2w">
              Si l’entité bénéficiaire a complété le formulaire de demande
              d’aide, veuillez indiquer l’adresse email utilisée ci-dessous.
            </div>
            <div className="fr-input-group">
              <label
                className="fr-label fr-pt-2w"
                htmlFor="saisie-email-entite-aidee"
              >
                Adresse électronique de l’entité :
              </label>
              <Input
                type="text"
                className="fr-pt-2w"
                id="saisie-email-entite-aidee"
                name="saisie-email-entite-aidee"
                onChange={(e) => surSaisieEmailEntiteAidee(e.target.value)}
              />
              {proprietesRealiserUnDiagnostic.erreur}
            </div>
          </fieldset>
          <div className="texte-centre fr-pt-2w">
            <hr className="separation-realiser-diagnostic" />
          </div>
          <div>
            <div>
              <b>
                Vous initiez un diagnostic à une entité qui n’a pas fait de
                demande en ligne
              </b>
            </div>
            <div className="fr-pt-2w">
              Si l’entité bénéficiaire n’a pas fait de demande en ligne,
              veuillez lui communiquer le lien vers le formulaire en ligne, et
              lui indiquer de renseigner votre adresse électronique afin que la
              demande vous soit attribuée.
            </div>
            <div className="fr-pt-2w">
              Le lien à communiquer :
              <br />-
              <a
                href={`${import.meta.env['VITE_URL_MAC']}/beneficier-du-dispositif/etre-aide#formulaire-demande-aide`}
              >{`${import.meta.env['VITE_URL_MAC']}/beneficier-du-dispositif/etre-aide#formulaire-demande-aide`}</a>
            </div>
          </div>
        </div>
        <div className="fr-pt-4w alignement-droite">
          <Button
            type="button"
            variant="secondary"
            key="annule-validation-cgu-entite"
            className="fr-mr-2w"
            onClick={proprietesRealiserUnDiagnostic.surFermeture}
          >
            Retour à la liste des diagnostics
          </Button>
          <Button
            disabled={!(emailEntiteAidee.trim().length > 0)}
            type="button"
            key="validation-cgu-entite"
            onClick={() =>
              emailEntiteAidee.trim().length > 0 &&
              proprietesRealiserUnDiagnostic.surValidation(emailEntiteAidee)
            }
          >
            Commencer le diagnostic
          </Button>
        </div>
      </section>
    </>
  );
};

export type FormatLien = `/api/${string}`;
type CorpsLancerDiagnostic = {
  emailEntiteAidee: string;
};
export const ComposantLancerDiagnostic = ({
  composant,
}: ProprietesComposantLancerDiagnostic) => {
  const navigationMAC = useNavigationMAC();
  const macAPI = useMACAPI();
  const { navigue } = useNavigueVersModifierDiagnostic(
    `${ROUTE_MON_ESPACE}/diagnostic`
  );
  const [erreur, setErreur] = useState<ReactElement | undefined>(undefined);

  const { affiche, ferme } = useModale();

  const lanceDiagnostic = useCallback(
    (lien: Lien, emailEntiteAidee: string) => {
      macAPI
        .execute<string, FormatLien, CorpsLancerDiagnostic>(
          constructeurParametresAPI<CorpsLancerDiagnostic>()
            .corps({ emailEntiteAidee })
            .url(lien.url)
            .methode(lien.methode!)
            .construis(),
          async (lienDansHeader) => await lienDansHeader
        )
        .then((lien) => {
          return navigue({
            url: lien,
            methode: 'GET',
          });
        })
        .catch((erreur) => setErreur(<ChampsErreur erreur={erreur} />));
    },
    [navigationMAC]
  );

  const lancerDiagnostic = useCallback(
    async (emailEntiteAidee: string) => {
      new MoteurDeLiens(navigationMAC.etat).trouve(
        'lancer-diagnostic',
        (lien: Lien) => lanceDiagnostic(lien, emailEntiteAidee)
      );
    },
    [navigationMAC.etat, lanceDiagnostic]
  );

  const afficherModale = () => {
    affiche({
      titre: 'Réaliser un diagnostic',
      corps: (
        <RealiserUnDiagnostic
          surFermeture={ferme}
          surValidation={async (emailEntiteAidee) => {
            ferme();
            await lancerDiagnostic(emailEntiteAidee);
          }}
          erreur={erreur}
        />
      ),
      taille: 'moyenne',
    });
  };

  return composant({ surClick: afficherModale });
};
