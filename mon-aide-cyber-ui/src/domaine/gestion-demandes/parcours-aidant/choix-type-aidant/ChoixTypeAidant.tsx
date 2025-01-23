import { useEffect, useState } from 'react';
import Button from '../../../../composants/atomes/Button/Button.tsx';
import { TypeAidant, TypeAidantEtSonEntite } from '../reducteurEtapes.ts';
import { Entreprise } from '../Entreprise';
import { SelecteurTypeAidant } from './SelecteurTypeAidant.tsx';
import { RechercheEntreprise } from './RechercheEntreprise.tsx';
import { TypographieH5 } from '../../../../composants/communs/typographie/TypographieH5/TypographieH5.tsx';
import { LienMailtoMAC } from '../../../../composants/atomes/LienMailtoMAC.tsx';
import illustrationInteretGeneralMAC from '../../../../../public/images/illustration-interet-general-mac.svg';

export const ChoixTypeAidant = ({
  surClick,
  precedent,
  typeAidant,
}: {
  surClick: (reponseChoisie: TypeAidantEtSonEntite) => void;
  precedent: () => void;
  typeAidant: TypeAidantEtSonEntite | undefined;
}) => {
  const [choix, setChoix] = useState<TypeAidant | undefined>(
    typeAidant?.typeAidant
  );
  const [entite, setEntite] = useState<Entreprise | undefined | null>(
    typeAidant?.entite
  );

  useEffect(() => {
    setEntite(null);
  }, [choix]);

  const peutValiderEtape = (!!choix && !!entite) || choix === 'FuturAdherent';

  return (
    <div className="fr-container fr-grid-row fr-grid-row--center zone-choix-type-aidant">
      <div className="fr-col-md-8 fr-col-sm-12 section">
        <div>
          <TypographieH5>
            Vous souhaitez utiliser l’outil de diagnostic de l’ANSSI et être
            référencé Aidant cyber.
          </TypographieH5>
          <div className="texte-centre">
            <img
              src={illustrationInteretGeneralMAC}
              alt="Illustration d’une personne oeuvrant pour l’intérêt général."
            />
          </div>
          <p>
            <b>Vous êtes :</b>
          </p>
          <div className="liste-choix-type-aidants">
            <SelecteurTypeAidant
              libelle="Un représentant des services de l’État"
              surChoix={() => setChoix('RepresentantEtat')}
              coche={choix === 'RepresentantEtat' || false}
              contenuZoneDepliee={
                <RechercheEntreprise
                  key={`RepresentantEtat-${entite?.nom}`}
                  type="servicePublic"
                  entrepriseSelectionnee={entite}
                  surChoixEntite={setEntite}
                />
              }
            />
            <SelecteurTypeAidant
              libelle="Un agent public ou salarié de l’administration, d’un établissement
              public, d’une collectivité, d’une chambre consulaire ou syndicale,
              ou autre opérateur public"
              surChoix={() => setChoix('AgentPublic')}
              coche={choix === 'AgentPublic'}
              contenuZoneDepliee={
                <RechercheEntreprise
                  key={`AgentPublic-${entite?.nom}`}
                  type="representantEtat"
                  entrepriseSelectionnee={entite}
                  surChoixEntite={setEntite}
                />
              }
            />
            <SelecteurTypeAidant
              libelle="Un salarié ou adhérent d’une entité morale à but non lucratif (ex
              : association à but non lucratif, campus cyber, CSIRT, Clusir,
              CESIN, etc.)"
              surChoix={() => setChoix('Association')}
              coche={choix === 'Association'}
              contenuZoneDepliee={
                <RechercheEntreprise
                  key={`Association-${entite?.nom}`}
                  type="association"
                  entrepriseSelectionnee={entite}
                  surChoixEntite={setEntite}
                />
              }
            />
            <hr className="separation-formulaire" />
            <SelecteurTypeAidant
              libelle="Pas encore adhérent d’une association mais prêt à le devenir."
              surChoix={() => setChoix('FuturAdherent')}
              coche={choix === 'FuturAdherent'}
              contenuZoneDepliee={
                <p>
                  Contactez l’équipe MonAideCyber pour déterminer quels relais
                  associatifs vous correspondent.
                  <br />
                  Vous pouvez aussi proposer un partenariat. <br />
                  Envoyez un mail à : <LienMailtoMAC />
                </p>
              }
            />
          </div>
          <br />
          <div className="validation alignee-droite">
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                precedent();
              }}
            >
              <span>Précédent</span>
            </Button>
            <Button
              disabled={!peutValiderEtape}
              variant="primary"
              type="button"
              className="fr-btn bouton-mac bouton-mac-primaire"
              onClick={() => {
                if (choix) {
                  surClick({ typeAidant: choix, entite: entite || undefined });
                }
              }}
            >
              <span>Suivant</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
