import illustrationInteretGeneral from '../../../../public/images/illustration-interet-general.svg';
import { Input } from '../../../composants/atomes/Input/Input.tsx';
import { ReactElement, useState } from 'react';
import { useMACAPI } from '../../../fournisseurs/api/useMACAPI.ts';
import { useQuery } from '@tanstack/react-query';
import { AutoCompletion } from '../../../composants/auto-completion/AutoCompletion.tsx';
import { constructeurParametresAPI } from '../../../fournisseurs/api/ConstructeurParametresAPI.ts';
import Button from '../../../composants/atomes/Button/Button.tsx';
import { TypeAidant, TypeAidantEtSonEntreprise } from './reducteurEtapes.ts';
import { useNavigationMAC } from '../../../fournisseurs/hooks.ts';
import { MoteurDeLiens } from '../../MoteurDeLiens.ts';

type ProprietesSelecteurTypeAidant = {
  libelle: string;
  contenuZoneDepliee?: ReactElement;
  surChoix: () => void;
  coche: boolean;
};

export const SelecteurTypeAidant = ({
  libelle,
  surChoix,
  contenuZoneDepliee,
  coche,
}: ProprietesSelecteurTypeAidant) => {
  return (
    <label className="selecteur-type-aidant">
      <div className="zone-radiobutton">
        <div>
          <input
            name="choix-type-aidant"
            type="radio"
            onChange={surChoix}
            checked={coche}
          />
        </div>
        <p>{libelle}</p>
      </div>
      {contenuZoneDepliee ? (
        <div className="selecteur-type-aidant-saisie-entite">
          {contenuZoneDepliee}
        </div>
      ) : null}
    </label>
  );
};

type EntrepriseAPI = {
  nom: string;
  siret: string;
  commune: string;
  departement: string;
};

type TypeEntreprise = 'servicePublic';
const RechercheEntreprise = (props: {
  surChoixEntite: (entreprise: Entreprise) => void;
  type: TypeEntreprise;
  entrepriseSelectionnee: Entreprise | undefined;
}) => {
  const macAPI = useMACAPI();
  const [saisie, setSaisie] = useState<string>('');
  const navigationMAC = useNavigationMAC();

  const criteresRecherche: Map<TypeEntreprise, string> = new Map([
    ['servicePublic', '&est_service_public=true'],
  ]);

  const { data: entrepriseTrouvees } = useQuery({
    enabled: saisie.length > 2,
    queryKey: ['recherche-entreprise', saisie],
    queryFn: () => {
      const rechercheEntreprise = new MoteurDeLiens(
        navigationMAC.etat
      ).trouveEtRenvoie('rechercher-entreprise');
      const url = `${rechercheEntreprise.url}?nom=${saisie}${criteresRecherche.get(props.type)}`;
      return macAPI.execute<Entreprise[], EntrepriseAPI[]>(
        constructeurParametresAPI()
          .url(url)
          .methode(rechercheEntreprise.methode!)
          .construis(),
        async (json) => {
          return await json;
        }
      );
    },
  });

  const estEntreprise = (
    entreprise: string | Entreprise
  ): entreprise is Entreprise => {
    const ent = entreprise as Entreprise;
    return (
      ent.nom !== undefined &&
      ent.commune !== undefined &&
      ent.siret !== undefined &&
      ent.departement !== undefined
    );
  };

  return (
    <>
      <p>Veuillez indiquer le nom de votre structure/employeur</p>
      <AutoCompletion<Entreprise>
        nom="entreprise"
        mappeur={(entreprise) => {
          const ent = entreprise as Entreprise;
          if (estEntreprise(entreprise)) {
            return `${ent.nom} - ${ent.commune} (${ent.departement}) - (${ent.siret})`;
          }
          return ent.nom;
        }}
        surSelection={(valeur) => props.surChoixEntite(valeur)}
        surSaisie={(saisie) => {
          if (estEntreprise(saisie)) {
            props.surChoixEntite(saisie);
          }
          setSaisie(saisie as string);
        }}
        valeurSaisie={
          props.entrepriseSelectionnee
            ? props.entrepriseSelectionnee
            : ({
                nom: saisie,
              } as Entreprise)
        }
        suggestionsInitiales={entrepriseTrouvees ? entrepriseTrouvees : []}
      />
    </>
  );
};

export type Entreprise = {
  siret: string;
  nom: string;
  commune: string;
  departement: string;
};

export const ChoixTypeAidant = ({
  surClick,
  precedent,
  typeAidant,
}: {
  surClick: (reponseChoisie: TypeAidantEtSonEntreprise) => void;
  precedent: () => void;
  typeAidant: TypeAidantEtSonEntreprise | undefined;
}) => {
  const [choix, setChoix] = useState<TypeAidant | undefined>(
    typeAidant?.typeAidant
  );
  const [entreprise, setEntreprise] = useState<Entreprise | undefined>();

  return (
    <div className="fr-container fr-grid-row fr-grid-row--center zone-choix-type-aidant">
      <div className="fr-col-md-8 fr-col-sm-12 section">
        <div>
          <p>Vous souhaitez œuvrer exclusivement pour l’intérêt général</p>
          <img
            className="text-center"
            src={illustrationInteretGeneral}
            alt="Illustration d’une personne oeuvrant pour l’intérêt général."
          />
          <p>Vous êtes :</p>
          <div className="liste-choix-type-aidants">
            <SelecteurTypeAidant
              libelle="Un représentant des services de l’État"
              surChoix={() => setChoix('RepresentantEtat')}
              coche={choix === 'RepresentantEtat' || false}
              contenuZoneDepliee={
                <RechercheEntreprise
                  type="servicePublic"
                  entrepriseSelectionnee={typeAidant?.entreprise}
                  surChoixEntite={(entite: Entreprise) => setEntreprise(entite)}
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
                <>
                  <p>Veuillez indiquer le nom de votre structure/employeur</p>
                  <Input type="text" />
                </>
              }
            />
            <SelecteurTypeAidant
              libelle="Un salarié ou adhérent d’une entité morale à but non lucratif (ex
              : association à but non lucratif, campus cyber, CSIRT, Clusir,
              CESIN, etc.)"
              surChoix={() => setChoix('Association')}
              coche={choix === 'Association'}
              contenuZoneDepliee={
                <>
                  <p>Veuillez indiquer le nom de votre structure/employeur</p>
                  <Input type="text" />
                </>
              }
            />
            <hr className="separation-formulaire" />
            <SelecteurTypeAidant
              libelle="Pas encore adhérent d’une association mais prêt à devenir membre d’une organisation à but non lucratif"
              surChoix={() => setChoix('FuturAdherent')}
              coche={choix === 'FuturAdherent'}
              contenuZoneDepliee={
                <>
                  Vous pouvez consulter une liste d’associations dont font
                  partie certains de nos Aidants cyber : <br />
                  monaide.cyber.gouv.fr/associations-partenaires. <br />
                  Vous pouvez aussi proposer un partenariat en contactant
                  l’équipe via monaidecyber@ssi.gouv.fr
                </>
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
              Précédent
            </Button>
            <Button
              disabled={!entreprise || !choix}
              variant="primary"
              type="button"
              className="fr-btn bouton-mac bouton-mac-primaire"
              onClick={() => {
                if (entreprise && choix) {
                  surClick({ entreprise, typeAidant: choix });
                }
              }}
            >
              Je valide ma sélection
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
