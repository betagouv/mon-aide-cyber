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
import { TypographieH5 } from '../../../../composants/communs/typographie/TypographieH5/TypographieH5.tsx';
import Button from '../../../../composants/atomes/Button/Button.tsx';
import { useState } from 'react';
import { LienMailtoMAC } from '../../../../composants/atomes/LienMailtoMAC.tsx';

export const CapteurFormulaireDevenirAidant = () => {
  const navigationMAC = useNavigationMAC();
  const macAPI = useMACAPI();
  const navigate = useNavigate();

  const [estValide, setEstValide] = useState(false);

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
    mutationFn: (corpsMutation: CorpsDemandeDevenirAidant) => {
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
            <LienMailtoMAC />
          </p>
          <a href="/">
            <Button type="button" variant="primary">
              Retour à la page d&apos;accueil
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <FormulaireDevenirAidant>
      <FormulaireDevenirAidant.AvantPropos>
        <div className="fr-mb-2w">
          Demande d&apos;inscription à un atelier Devenir Aidant MonAideCyber
        </div>
        <div className="fr-mt-2w introduction">
          <div>
            <TypographieH5>
              Vous souhaitez devenir Aidant MonAideCyber
            </TypographieH5>
            <p>Pour devenir aidant, il est nécessaire de&nbsp;:</p>
            <ul>
              <li>
                représenter un service de l&apos;Etat, un établissement public,
                une association ou toute autre entité morale à but non lucratif
              </li>
              <li>
                participer à un atelier devenir Aidant MonAideCyber animé par
                l&apos;ANSSI
              </li>
              <li>
                prendre connaissance de{' '}
                <a href="/charte-aidant">la charte de l&apos;aidant</a>, qui
                rappelle notamment le principe de gratuité du dispositif, et la
                signer avant ou après l&apos;atelier
              </li>
              <br />
            </ul>
            <p>
              Veuillez compléter les informations ci-dessous pour être averti de
              la prochaine session prévue sur votre territoire.
            </p>
          </div>
        </div>
      </FormulaireDevenirAidant.AvantPropos>
      <FormulaireDevenirAidant.Formulaire
        referentielDepartements={referentielDepartements}
        surSoumission={mutate}
        devientValide={(estFormulaireValide) =>
          setEstValide(estFormulaireValide)
        }
      >
        <Button
          type="submit"
          variant="primary"
          key="envoyer-demande-devenir-aidant"
          disabled={!estValide}
        >
          Envoyer
        </Button>
      </FormulaireDevenirAidant.Formulaire>
      {isError ? <Toast message={error.message} type="ERREUR" /> : null}
    </FormulaireDevenirAidant>
  );
};
