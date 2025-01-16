import {
  CorpsFormulaireCreationEspaceAidant,
  FormulaireCreationEspaceAidant,
} from './FormulaireCreationEspaceAidant.tsx';
import { useRecupereContexteNavigation } from '../../../hooks/useRecupereContexteNavigation.ts';
import { useMoteurDeLiens } from '../../../hooks/useMoteurDeLiens.ts';
import { TypographieH2 } from '../../../composants/communs/typographie/TypographieH2/TypographieH2.tsx';
import './ecran-creation-espace-aidant.scss';
import Button from '../../../composants/atomes/Button/Button.tsx';
import { useNavigate } from 'react-router-dom';
import illustrationDeuxPersonnesSvg from '../../../../public/images/illustration-deux-personnes.svg';
import { useMutation } from '@tanstack/react-query';
import { ReponseHATEOAS } from '../../Lien.ts';
import { constructeurParametresAPI } from '../../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { useMACAPI } from '../../../fournisseurs/api/useMACAPI.ts';

export type CorpsCreationEspaceAidant = {
  cguSignees?: boolean;
  motDePasse?: string;
  confirmationMotDePasse?: string;
  token: string;
};

type EcranCreationEspaceAidant = {
  token: string;
};
export const EcranCreationEspaceAidant = ({
  token,
}: EcranCreationEspaceAidant) => {
  const macAPI = useMACAPI();
  const navigate = useNavigate();

  useRecupereContexteNavigation(
    'demande-devenir-aidant:finalise-creation-espace-aidant'
  );

  const lienFinalisationEspaceAidantClassique = useMoteurDeLiens(
    'finalise-creation-espace-aidant'
  );
  const lienFinalisationNouvelEspaceAidant = useMoteurDeLiens(
    'finalise-creation-nouvel-espace-aidant'
  );

  const { mutate } = useMutation({
    mutationKey: ['finaliser-creation-espace-aidant'],
    mutationFn: (parametresMutation: CorpsCreationEspaceAidant) => {
      if (!parametresMutation.token) {
        throw new Error('Une erreur est survenue');
      }
      const lienAUtiliser =
        lienFinalisationNouvelEspaceAidant.ressource ||
        lienFinalisationEspaceAidantClassique.ressource;

      const corps = {
        ...(lienFinalisationNouvelEspaceAidant.accedeALaRessource
          ? {
              token: token,
            }
          : {
              cguSignees: parametresMutation.cguSignees,
              motDePasse: parametresMutation.motDePasse!,
              confirmationMotDePasse: parametresMutation.confirmationMotDePasse,
              token,
            }),
      };
      const parametresAPI =
        constructeurParametresAPI<CorpsCreationEspaceAidant>()
          .url(lienAUtiliser.url)
          .methode(lienAUtiliser.methode!)
          .corps(corps)
          .construis();

      return macAPI.execute<
        ReponseHATEOAS,
        ReponseHATEOAS,
        CorpsCreationEspaceAidant
      >(parametresAPI, async (json) => await json);
    },
    onSuccess: () => {
      navigate('/connexion');
    },
  });

  const soumetFormulaire = (corps: CorpsFormulaireCreationEspaceAidant) => {
    mutate({
      ...corps,
      token: token,
    });
  };

  if (lienFinalisationNouvelEspaceAidant.accedeALaRessource) {
    return (
      <main role="main" className="ecran-creation-espace-aidant">
        <div className="colonne-gauche">
          <TypographieH2 className="texte-centre">
            Création de votre espace Aidant cyber
          </TypographieH2>
          <p>
            Bienvenue dans la communauté des Aidants MonAideCyber ! Votre espace
            Aidant cyber a été créé, vous pouvez l’explorer et réaliser des
            diagnostics dès maintenant.
          </p>
          <div className="mac-callout mac-callout-information">
            <i className="mac-icone-information" />
            <div>
              Pensez à renseigner vos préférences afin d’apparaître sur
              l’annuaire et pour être mis en relation avec avec des entités en
              demande de diagnostic.
            </div>
          </div>
          <div className="texte-centre">
            <Button
              type="button"
              variant="primary"
              onClick={() =>
                mutate({
                  token: token,
                })
              }
            >
              J&apos;accède à mon espace
            </Button>
          </div>
        </div>
        <div className="fond-clair-mac colonne-droite">
          <img
            src={illustrationDeuxPersonnesSvg}
            alt="illustration de deux écrans de connexion"
          />
        </div>
      </main>
    );
  }

  return (
    <>
      <main role="main">
        <div className="fond-clair-mac creation-espace-aidant">
          <div className="fr-container">
            <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--center">
              <div className="fr-col-8">
                <FormulaireCreationEspaceAidant
                  surSoumission={soumetFormulaire}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
