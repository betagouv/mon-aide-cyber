import { ReactElement, useCallback, useState } from 'react';
import {
  useModale,
  useNavigationMAC,
  useUtilisateur,
} from '../../fournisseurs/hooks.ts';

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
import { partageEmail } from '../../domaine/gestion-demandes/etre-aide/EtreAide.ts';

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
  surValidation: (emailEntiteAidee: string) => Promise<void | Error>;
}) => {
  const [emailEntiteAidee, setEmailEntiteAidee] = useState('');
  const [erreurAfficher, setErreurAfficher] = useState<
    ReactElement | undefined
  >(undefined);
  const surSaisieEmailEntiteAidee = useCallback(
    (email: string) => setEmailEntiteAidee(email),
    []
  );

  const lanceDiagnostic = () =>
    emailEntiteAidee.trim().length > 0 &&
    proprietesRealiserUnDiagnostic
      .surValidation(emailEntiteAidee)
      .then(() => {
        proprietesRealiserUnDiagnostic.surFermeture();
      })
      .catch((erreur: Error) => {
        setErreurAfficher(<p className="fr-error-text">{erreur.message}</p>);
      });

  const { utilisateur } = useUtilisateur();

  const forgeLienDemandeAide = () => {
    const urlMesServicesCyber = import.meta.env['VITE_URL_MSC'];
    if (urlMesServicesCyber) {
      const email = partageEmail().encodePourMSC(utilisateur!.email);
      return `${urlMesServicesCyber}/cyberdepart?${email}#formulaire-demande-aide`;
    }
    const email = partageEmail().encodePourMAC(utilisateur!.email);
    return `${import.meta.env['VITE_URL_MAC']}/beneficier-du-dispositif/etre-aide?${email}#formulaire-demande-aide`;
  };
  const lienDemandeAide = forgeLienDemandeAide();

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
            <div
              className={`fr-input-group ${erreurAfficher ? 'fr-input-group--error' : ''}`}
            >
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
              {erreurAfficher}
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
              <br />
              <a href={lienDemandeAide}>{lienDemandeAide}</a>
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
            onClick={() => lanceDiagnostic()}
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

  const { affiche, ferme } = useModale();

  const lanceDiagnostic = (lien: Lien, emailEntiteAidee: string) => {
    return macAPI.execute<string, FormatLien, CorpsLancerDiagnostic>(
      constructeurParametresAPI<CorpsLancerDiagnostic>()
        .corps({ emailEntiteAidee })
        .url(lien.url)
        .methode(lien.methode!)
        .construis(),
      async (lienDansHeader) => await lienDansHeader
    );
  };

  const lancerDiagnostic = useCallback(
    async (emailEntiteAidee: string) => {
      const lienLancerDiagnostic = new MoteurDeLiens(
        navigationMAC.etat
      ).trouveEtRenvoie('lancer-diagnostic');

      return lanceDiagnostic(lienLancerDiagnostic, emailEntiteAidee).then(
        (lien) => {
          return navigue({
            url: lien,
            methode: 'GET',
          });
        }
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
            return lancerDiagnostic(emailEntiteAidee);
          }}
        />
      ),
      taille: 'moyenne',
    });
  };

  return composant({ surClick: afficherModale });
};
