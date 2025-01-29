import { useNavigationMAC } from '../../../../fournisseurs/hooks.ts';
import { useMACAPI } from '../../../../fournisseurs/api/useMACAPI.ts';
import { useNavigate } from 'react-router-dom';
import React, { useCallback, useReducer, useState } from 'react';
import {
  choixTypeAidantFait,
  demandeDevenirAidantCreee,
  Etape,
  initialiseReducteur,
  reducteurEtapes,
  retourEtapePrecedente,
  signeCharteAidant,
  TypeAidantEtSonEntite,
  valideCGU,
} from '../../../gestion-demandes/parcours-aidant/reducteurEtapes.ts';
import { useRecupereContexteNavigation } from '../../../../hooks/useRecupereContexteNavigation.ts';
import { MoteurDeLiens, ROUTE_MON_ESPACE } from '../../../MoteurDeLiens.ts';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  CorpsDemandeDevenirAidant,
  entiteEnFonctionDuTypeAidant,
  ReponseDemandeInitiee,
} from '../../../gestion-demandes/devenir-aidant/DevenirAidant.ts';
import { constructeurParametresAPI } from '../../../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { ChoixTypeAidant } from '../../../gestion-demandes/parcours-aidant/choix-type-aidant/ChoixTypeAidant.tsx';
import { SignatureCharteAidant } from '../../../gestion-demandes/parcours-aidant/SignatureCharteAidant.tsx';
import { SignatureCGU } from '../../../gestion-demandes/parcours-aidant/SignatureCGU.tsx';
import { FormulaireDevenirAidant } from '../../../gestion-demandes/devenir-aidant/formulaire-devenir-aidant/FormulaireDevenirAidant.tsx';
import { TypographieH5 } from '../../../../composants/communs/typographie/TypographieH5/TypographieH5.tsx';
import Button from '../../../../composants/atomes/Button/Button.tsx';
import { Toast } from '../../../../composants/communs/Toasts/Toast.tsx';
import illustrationSuivi from '../../../../../public/images/illustration-suivi.svg';
import { TypographieH4 } from '../../../../composants/communs/typographie/TypographieH4/TypographieH4.tsx';
import { LienMailtoMAC } from '../../../../composants/atomes/LienMailtoMAC.tsx';

export const EcranMonEspaceDemandeDevenirAidant = () => {
  const navigationMAC = useNavigationMAC();
  const macAPI = useMACAPI();
  const navigate = useNavigate();

  const [etatEtapeCourante, envoie] = useReducer(reducteurEtapes, {
    ...initialiseReducteur(),
    etapeCourante: 'choixTypeAidant',
  });

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

  const {
    mutate,
    error: erreur,
    isError: mutationEnErreur,
  } = useMutation({
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
      envoie(demandeDevenirAidantCreee());
      window.scrollTo({ top: 0 });
    },
  });

  const surClickChoixTypeAidant = useCallback(
    ({ typeAidant, entite }: TypeAidantEtSonEntite) => {
      envoie(
        choixTypeAidantFait({
          typeAidant,
          entite,
        })
      );
      window.scrollTo({ top: 0 });
    },
    []
  );

  const surSignatureCharteAidant = useCallback(() => {
    envoie(signeCharteAidant());
    window.scrollTo({ top: 0 });
  }, []);

  const surValidationCGU = useCallback(() => {
    envoie(valideCGU());
    window.scrollTo({ top: 0 });
  }, []);

  const retourAuChoixUtilisation = () => {
    window.history.back();
  };

  const surClickEtapePrecedente = useCallback(() => {
    envoie(retourEtapePrecedente());
    window.scrollTo({ top: 0 });
  }, []);

  const etapes: Map<Etape, React.ReactElement> = new Map([
    [
      'choixTypeAidant',
      <ChoixTypeAidant
        key="choixTypeAidant"
        typeAidant={etatEtapeCourante.demande?.type}
        surClick={surClickChoixTypeAidant}
        precedent={retourAuChoixUtilisation}
      />,
    ],
    [
      'signatureCharteAidant',
      <SignatureCharteAidant
        key="signatureCharteAidant"
        signeCharteAidant={surSignatureCharteAidant}
        precedent={surClickEtapePrecedente}
      />,
    ],
    [
      'signatureCGUs',
      <div
        key="signatureCGUs"
        className="fr-container fr-grid-row fr-grid-row--center zone-signature-cgu"
      >
        <SignatureCGU
          valideCGUs={surValidationCGU}
          precedent={surClickEtapePrecedente}
        />
      </div>,
    ],
    [
      'formulaireDevenirAidant',
      <div
        key="formulaireDevenirAidant"
        className="fr-container fr-grid-row fr-grid-row--center zone-formulaire-devenir-aidant"
      >
        <FormulaireDevenirAidant>
          <FormulaireDevenirAidant.AvantPropos>
            <div className="fr-mt-2w introduction">
              <div>
                <TypographieH5>
                  Vous souhaitez utiliser l’outil de diagnostic de l’ANSSI et
                  être référencé Aidant cyber.
                </TypographieH5>
                <p>
                  Veuillez compléter les informations ci-dessous pour être
                  informé des prochains ateliers Devenir Aidant MonAideCyber
                  dans votre territoire
                </p>
                <p>
                  Les informations que vous fournissez via ce formulaire sont
                  strictement confidentielles et respectent nos conditions
                  générales d’utilisation.
                </p>
              </div>
            </div>
          </FormulaireDevenirAidant.AvantPropos>
          <FormulaireDevenirAidant.Formulaire
            referentielDepartements={referentielDepartements}
            surSoumission={(formulaire) => {
              const { typeAidant, entite: entiteDuFormulaire } =
                etatEtapeCourante.demande!.type;

              const entiteCorrespondante =
                entiteEnFonctionDuTypeAidant.get(typeAidant);

              mutate({
                ...formulaire,
                signatureCharte: etatEtapeCourante.demande!.signatureCharte,
                ...(entiteCorrespondante && {
                  entite: entiteCorrespondante(
                    entiteDuFormulaire?.nom,
                    entiteDuFormulaire?.siret
                  ),
                }),
              });
            }}
            devientValide={(estFormulaireValide) => {
              setEstValide(estFormulaireValide);
            }}
          >
            <div className="actions">
              <Button
                type="submit"
                variant="secondary"
                key="envoyer-demande-devenir-aidant"
                onClick={surClickEtapePrecedente}
              >
                <span>Précédent</span>
              </Button>
              <Button
                type="submit"
                key="envoyer-demande-devenir-aidant"
                disabled={!estValide}
              >
                Envoyer
              </Button>
            </div>
          </FormulaireDevenirAidant.Formulaire>

          {mutationEnErreur ? (
            <Toast message={erreur.message} type="ERREUR" />
          ) : null}
        </FormulaireDevenirAidant>
      </div>,
    ],
    [
      'confirmationDemandeDevenirAidantPriseEnCompte',
      <div
        key="confirmationDemandeDevenirAidantPriseEnCompte"
        id="confirmationDemandeDevenirAidantPriseEnCompte"
        className="fr-container fr-grid-row fr-grid-row--center zone-confirmation-formulaire-devenir-aidant"
      >
        <div className="fr-col-md-8 fr-col-sm-12 section confirmation">
          <img
            src={illustrationSuivi}
            alt="illustration de suivi MonAideCyber"
          />
          <TypographieH4>
            Votre demande a bien été prise en compte !
          </TypographieH4>
          <p>
            Celle-ci sera traitée dans les meilleurs délais. Pensez à vérifier
            dans vos spams ou contactez-nous à <LienMailtoMAC />
          </p>
        </div>
        <div className="fr-col-md-8 fr-col-sm-12 section confirmation">
          <TypographieH4>
            Réalisez des diagnostics dès maintenant !
          </TypographieH4>
          <p>
            Accédez à votre espace dès maintenant. Vous pourrez vous
            familiariser avec l’outil et réaliser des premiers diagnostics si
            vous le souhaitez.
          </p>
          <Button
            type="button"
            variant="primary"
            onClick={() => navigate(ROUTE_MON_ESPACE + '/tableau-de-bord')}
          >
            Je réalise un diagnostic
          </Button>
        </div>
      </div>,
    ],
  ]);

  return (
    <div className="ecran-demande-devenir-aidant fond-clair-mac">
      {etapes.get(etatEtapeCourante.etapeCourante)}
    </div>
  );
};
