import { constructeurParametresAPI } from '../../../../../fournisseurs/api/ConstructeurParametresAPI';
import { useMACAPI } from '../../../../../fournisseurs/api/useMACAPI';
import { useNavigationMAC } from '../../../../../fournisseurs/hooks';
import { MoteurDeLiens } from '../../../../MoteurDeLiens';
import { CarteAidant } from '../CarteAidant';
import { TypographieH6 } from '../../../../../composants/communs/typographie/TypographieH6/TypographieH6';
import illustrationFAQFemme from '../../../../../public/images/illustration-faq-femme.svg';
import Button from '../../../../../composants/atomes/Button/Button';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useRecupereContexteNavigation } from '../../../../../hooks/useRecupereContexteNavigation';
import { ReponseAidantAnnuaire } from './useListeAidants';

export const ListeAidants = () => {
  const macAPI = useMACAPI();
  const navigationMAC = useNavigationMAC();

  useRecupereContexteNavigation('afficher-annuaire-aidants');

  const afficheUnPlurielSiMultiplesResultats = (tableau: unknown[]) => {
    return tableau && tableau.length > 1 ? 's' : '';
  };

  const {
    data: ressourceAnnuaireAidant,
    isLoading: enCoursDeChargement,
    isError: enErreur,
    refetch: relanceLaRecherche,
  } = useQuery<ReponseAidantAnnuaire>({
    queryKey: ['afficher-annuaire-aidants'],
    enabled: new MoteurDeLiens(navigationMAC.etat).existe(
      'afficher-annuaire-aidants'
    ),
    refetchOnWindowFocus: false,
    queryFn: () => {
      const lien = new MoteurDeLiens(navigationMAC.etat).trouveEtRenvoie(
        'afficher-annuaire-aidants'
      );

      return macAPI.execute<ReponseAidantAnnuaire, ReponseAidantAnnuaire>(
        constructeurParametresAPI()
          .url(lien.url)
          .methode(lien.methode!)
          .construis(),
        (reponse) => reponse
      );
    },
  });

  const aidants = ressourceAnnuaireAidant?.aidants;

  useEffect(() => {
    if (ressourceAnnuaireAidant?.liens) {
      navigationMAC.ajouteEtat(ressourceAnnuaireAidant?.liens);
    }
  }, [ressourceAnnuaireAidant]);

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
    <div className="liste-aidants">
      <p>
        Il y a actuellement <b>{ressourceAnnuaireAidant.nombreAidants}</b>{' '}
        Aidant
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
