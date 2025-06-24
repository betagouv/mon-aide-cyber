import { useNavigationMAC } from '../../../../fournisseurs/hooks.ts';
import { useMACAPI } from '../../../../fournisseurs/api/useMACAPI.ts';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import {
  avancerEtapeSuivante,
  Etape,
} from '../../../gestion-demandes/parcours-aidant/reducteurMonEspaceDemandeDevenirAidant.ts';
import { useRecupereContexteNavigation } from '../../../../hooks/useRecupereContexteNavigation.ts';
import { MoteurDeLiens, ROUTE_MON_ESPACE } from '../../../MoteurDeLiens.ts';
import { useMutation } from '@tanstack/react-query';
import {
  CorpsDemandeDevenirAidant,
  entiteEnFonctionDuTypeAidant,
  TypeAidant,
} from '../../../gestion-demandes/devenir-aidant/DevenirAidant.ts';
import { constructeurParametresAPI } from '../../../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { ChoixTypeAidant } from '../../../gestion-demandes/parcours-aidant/choix-type-aidant/ChoixTypeAidant.tsx';
import { SignatureCharteAidant } from '../../../gestion-demandes/parcours-aidant/SignatureCharteAidant.tsx';
import {
  ChampsFormulaireDevenirAidant,
  FormulaireDevenirAidant,
} from '../../../gestion-demandes/devenir-aidant/formulaire-devenir-aidant/FormulaireDevenirAidant.tsx';
import { TypographieH5 } from '../../../../composants/communs/typographie/TypographieH5/TypographieH5.tsx';
import Button from '../../../../composants/atomes/Button/Button.tsx';
import { Alerte } from '../../../../composants/communs/messages/Alerte.tsx';
import illustrationSuivi from '../../../../../public/images/illustration-suivi.svg';
import { TypographieH4 } from '../../../../composants/communs/typographie/TypographieH4/TypographieH4.tsx';
import { LienMailtoMAC } from '../../../../composants/atomes/LienMailtoMAC.tsx';
import { useRecupereLesInformationsLieesALaDemande } from '../../../../hooks/useRecupereLesInformationsLieesALaDemande.ts';
import { ReponseHATEOAS } from '../../../Lien.ts';
import { Entreprise } from '../../../gestion-demandes/parcours-aidant/Entreprise';
import useEcranMonEspaceDemandeDevenirAidant from './useEcranMonEspaceDemandeDevenirAidant.ts';

type ReponseDemandeDevenirAidant = ReponseHATEOAS;

export type InformationsTypeAidant = {
  typeAidant: TypeAidant | undefined;
  entite: Entreprise | undefined;
};

export type InformationsAidant = InformationsTypeAidant & {
  charteValidee: boolean;
};

export const EcranMonEspaceDemandeDevenirAidant = () => {
  const navigationMAC = useNavigationMAC();
  const macAPI = useMACAPI();
  const navigate = useNavigate();

  const {
    reducteurEtapesPourDevenirAidant,
    reducteurInformationsAidant,
    surClickChoixTypeAidant,
    surSignatureCharteAidant,
    surClickEtapePrecedente,
  } = useEcranMonEspaceDemandeDevenirAidant();

  const [estValide, setEstValide] = useState(false);

  useRecupereContexteNavigation(
    'demande-devenir-aidant:demande-devenir-aidant'
  );
  const informationsLieesALaDemande =
    useRecupereLesInformationsLieesALaDemande();

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

      return macAPI.execute<
        ReponseDemandeDevenirAidant,
        ReponseDemandeDevenirAidant,
        CorpsDemandeDevenirAidant
      >(
        constructeurParametresAPI<CorpsDemandeDevenirAidant>()
          .url(actionSoumettre.url)
          .methode(actionSoumettre.methode!)
          .corps(corpsMutation)
          .construis(),
        (corps) => corps
      );
    },
    onSuccess: (reponse) => {
      navigationMAC.setEtat(reponse.liens);
      reducteurEtapesPourDevenirAidant.declencheChangement(
        avancerEtapeSuivante()
      );
      window.scrollTo({ top: 0 });
    },
  });

  const retourAuChoixUtilisation = () => {
    window.history.back();
  };

  const surSoumission = (formulaire: ChampsFormulaireDevenirAidant) => {
    const { typeAidant, entite, charteValidee } =
      reducteurInformationsAidant.etatInformationsAidant.informations;
    if (!typeAidant || !entite) return;

    const entiteCorrespondante = entiteEnFonctionDuTypeAidant.get(typeAidant);

    if (!charteValidee) return;

    mutate({
      ...formulaire,
      signatureCharte: charteValidee,
      ...(entiteCorrespondante && {
        entite: entiteCorrespondante(entite?.nom, entite?.siret),
      }),
    });
  };

  const etapes: Map<Etape, React.ReactElement> = new Map([
    [
      'choixTypeAidant',
      <ChoixTypeAidant
        key="choixTypeAidant"
        typeAidant={{
          typeAidant:
            reducteurInformationsAidant.etatInformationsAidant.informations
              .typeAidant,
          entite:
            reducteurInformationsAidant.etatInformationsAidant.informations
              .entite,
        }}
        surChoixTypeAidant={surClickChoixTypeAidant}
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
                  informé des prochains ateliers Devenir Aidant cyber dans votre
                  territoire
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
            informationsLieesALaDemande={informationsLieesALaDemande}
            surSoumission={surSoumission}
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
            <Alerte message={erreur.message} type="ERREUR" />
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
      {etapes.get(
        reducteurEtapesPourDevenirAidant.etatEtapeCourante.etapeCourante
      )}
    </div>
  );
};
