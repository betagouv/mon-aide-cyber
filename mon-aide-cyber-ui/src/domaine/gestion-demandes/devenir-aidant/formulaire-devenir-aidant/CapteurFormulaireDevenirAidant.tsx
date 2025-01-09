import { useNavigationMAC } from '../../../../fournisseurs/hooks.ts';
import { useRecupereContexteNavigation } from '../../../../hooks/useRecupereContexteNavigation.ts';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FormulaireDevenirAidant } from './FormulaireDevenirAidant.tsx';
import { Toast } from '../../../../composants/communs/Toasts/Toast.tsx';
import { MoteurDeLiens } from '../../../MoteurDeLiens.ts';
import {
  CorpsDemandeDevenirAidant,
  ReponseDemandeInitiee,
} from '../DevenirAidant.ts';
import { constructeurParametresAPI } from '../../../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { useMACAPI } from '../../../../fournisseurs/api/useMACAPI.ts';
import { useNavigate } from 'react-router-dom';
import { TypographieH4 } from '../../../../composants/communs/typographie/TypographieH4/TypographieH4.tsx';

export type CorpsMutationDemandeDevenirAidant = {
  nom: string;
  prenom: string;
  mail: string;
  departement: string;
  cguValidees: boolean;
};

export const CapteurFormulaireDevenirAidant = () => {
  const navigationMAC = useNavigationMAC();
  const macAPI = useMACAPI();
  const navigate = useNavigate();

  useRecupereContexteNavigation(
    'demande-devenir-aidant:demande-devenir-aidant'
  );

  const action = new MoteurDeLiens(navigationMAC.etat).trouveEtRenvoie(
    'demande-devenir-aidant'
  );

  const { data } = useQuery({
    enabled: !!action,
    queryKey: ['recuperer-departements'],
    queryFn: () => {
      return macAPI.execute<ReponseDemandeInitiee, ReponseDemandeInitiee>(
        constructeurParametresAPI()
          .url(action.url)
          .methode(action.methode!)
          .construis(),
        (corps) => corps
      );
    },
  });

  const referentielDepartements = data?.departements;

  const { mutate, error, isError, isSuccess, isPending } = useMutation({
    mutationKey: ['demander-a-devenir-aidant'],
    mutationFn: (corpsMutation: CorpsMutationDemandeDevenirAidant) => {
      const actionSoumettre = new MoteurDeLiens(
        navigationMAC.etat
      ).trouveEtRenvoie('envoyer-demande-devenir-aidant');

      if (!actionSoumettre)
        throw new Error(
          'Une erreur est survenue lors de la demande devenir aidant'
        );

      return macAPI.execute<void, void, CorpsDemandeDevenirAidant>(
        constructeurParametresAPI<CorpsDemandeDevenirAidant>()
          .url(actionSoumettre.url)
          .methode(actionSoumettre.methode!)
          .corps(corpsMutation)
          .construis(),
        (corps) => corps
      );
    },
    onSuccess: () => {
      navigate('#formulaire-formation');
    },
  });

  if (!isPending && isSuccess) {
    return (
      <div className="fr-container fr-grid-row fr-grid-row--center formulaire-devenir-aidant-layout">
        <div className="fr-col-md-8 fr-col-sm-12 section confirmation">
          <TypographieH4>
            Votre demande a bien été prise en compte !
          </TypographieH4>
          <p>
            Celle-ci sera traitée dans les meilleurs délais.
            <br />
            <br />
            Vous allez être mis en relation avec le délégué régional de
            l&apos;ANSSI de votre territoire, qui reviendra vers vous par mail
            pour vous indiquer la prochaine date prévue de l&apos;atelier
            Devenir Aidant.
            <br />
            <br />
            Pensez à vérifier dans vos spams ou contactez-nous à&nbsp;
            <a
              href="mailto:monaidecyber@ssi.gouv.fr"
              target="_blank"
              rel="noreferrer"
            >
              monaidecyber@ssi.gouv.fr
            </a>
          </p>
          <a href="/">
            <button className="fr-btn bouton-mac bouton-mac-primaire">
              Retour à la page d&apos;accueil
            </button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <FormulaireDevenirAidant
      referentielDepartements={referentielDepartements}
      surSoumission={mutate}
    >
      {isError ? <Toast message={error.message} type="ERREUR" /> : null}
    </FormulaireDevenirAidant>
  );
};
