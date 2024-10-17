import { CarteAidant } from '../CarteAidant';
import { TypographieH6 } from '../../../../../composants/communs/typographie/TypographieH6/TypographieH6';
import illustrationFAQFemme from '../../../../../../public/images/illustration-faq-femme.svg';
import Button from '../../../../../composants/atomes/Button/Button';
import { Link } from 'react-router-dom';
import { AidantAnnuaire, useListeAidants } from './useListeAidants';
import { AutoCompletion } from '../../../../../composants/auto-completion/AutoCompletion';
import {
  Departement,
  estDepartement,
} from '../../../../gestion-demandes/departement';

const afficheUnPlurielSiMultiplesResultats = (tableau: unknown[]) => {
  return tableau && tableau.length > 1 ? 's' : '';
};

export type CartesAidant = {
  aidants: AidantAnnuaire[] | undefined;
  nombreAidants: number | undefined;
  enCoursDeChargement: boolean;
  enErreur: boolean;
  relanceLaRecherche: () => void;
};

export const CartesAidant = ({
  aidants,
  nombreAidants,
  enCoursDeChargement,
  enErreur,
  relanceLaRecherche,
}: CartesAidant) => {
  if (enCoursDeChargement) {
    return (
      <div className="cartes-aidants-messages">
        <TypographieH6>Chargement des Aidants...</TypographieH6>
      </div>
    );
  }

  if (enErreur) {
    return (
      <div className="cartes-aidants-messages">
        <img src={illustrationFAQFemme} alt="" />
        <p>Une erreur est survenue lors de la recherche d&apos;Aidants...</p>
        <Button type="button" onClick={() => relanceLaRecherche()}>
          Relancer la recherche d&apos;Aidants
        </Button>
      </div>
    );
  }

  if (!aidants || aidants?.length === 0) {
    return (
      <div className="cartes-aidants-messages">
        <img src={illustrationFAQFemme} alt="" />
        <p>
          Malheureusement, aucun résultat ne correspond à votre recherche.
          <br />
          Vous pouvez faire une nouvelle recherche dans un territoire proche du
          votre, <br /> ou bien effectuer une demande en ligne, à laquelle un
          aidant répondra !
        </p>
        <Link to="/beneficier-du-dispositif/etre-aide#formulaire-demande-aide">
          <Button type="button">Je fais une demande</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p>
        Il y a actuellement <b>{nombreAidants}</b> Aidant
        {afficheUnPlurielSiMultiplesResultats(aidants)} ayant souhaité
        apparaître publiquement dans l&apos;annuaire de MonAideCyber.
      </p>
      <div className="cartes-aidants">
        {aidants?.map((aidant) => (
          <CarteAidant key={aidant.identifiant} nomPrenom={aidant.nomPrenom} />
        ))}
      </div>
    </div>
  );
};

export const ListeAidants = () => {
  const {
    aidants,
    nombreAidants,
    enCoursDeChargement,
    enErreur,
    relanceLaRecherche,
    referentielDepartements,
    selectionneDepartement,
  } = useListeAidants();

  const departements: Departement[] | undefined = referentielDepartements?.map(
    (x) => ({
      nom: x,
      code: x,
    })
  );

  return (
    <div className="layout-annuaire">
      <div className="filtres">
        <span className="titre">Où est située votre entité ?</span>
        {!!departements && departements.length > 0 ? (
          <div className="fr-input-group">
            <AutoCompletion<Departement>
              nom="departement"
              valeurSaisie={{} as Departement}
              suggestionsInitiales={departements}
              mappeur={(departement) => {
                return estDepartement(departement)
                  ? `${departement.code} - ${departement.nom}`
                  : typeof departement === 'string'
                    ? departement
                    : '';
              }}
              surSelection={(departement) => {
                console.log('saisie dpt', departement);
                selectionneDepartement(departement.nom);
              }}
              surSaisie={(departement) => {
                console.log('saisie dpt', departement);
              }}
              clefsFiltrage={['code', 'nom']}
            />
          </div>
        ) : null}
      </div>
      <div className="liste-aidants">
        <span className="titre">Aidants trouvés</span>
        <CartesAidant
          aidants={aidants}
          nombreAidants={nombreAidants}
          enCoursDeChargement={enCoursDeChargement}
          enErreur={enErreur}
          relanceLaRecherche={relanceLaRecherche}
        />
      </div>
    </div>
  );
};
