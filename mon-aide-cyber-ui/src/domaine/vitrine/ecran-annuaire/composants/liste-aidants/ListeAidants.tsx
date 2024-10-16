import { constructeurParametresAPI } from '../../../../../fournisseurs/api/ConstructeurParametresAPI';
import { useMACAPI } from '../../../../../fournisseurs/api/useMACAPI';
import { useNavigationMAC } from '../../../../../fournisseurs/hooks';
import { MoteurDeLiens } from '../../../../MoteurDeLiens';
import { ReponseAidantAnnuaire } from '../../EcranAnnuaire';
import { CarteAidant } from '../CarteAidant';
import { TypographieH6 } from '../../../../../composants/communs/typographie/TypographieH6/TypographieH6';
import illustrationFAQFemme from '../../../../../public/images/illustration-faq-femme.svg';
import Button from '../../../../../composants/atomes/Button/Button';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useRecupereContexteNavigation } from '../../../../../hooks/useRecupereContexteNavigation';

export const ListeAidants = () => {
  const macAPI = useMACAPI();
  const navigationMAC = useNavigationMAC();

  useRecupereContexteNavigation(macAPI, 'afficher-annuaire-aidants');

  const afficheUnPlurielSiMultiplesResultats = (tableau: unknown[]) => {
    return tableau && tableau.length > 1 ? 's' : '';
  };

  const {
    data: annuaire,
    isLoading: enCoursDeChargement,
    isError: enErreur,
  } = useQuery<ReponseAidantAnnuaire>({
    queryKey: ['afficher-annuaire-aidants', navigationMAC.etat],
    queryFn: () => {
      const lien = new MoteurDeLiens(navigationMAC.etat).trouveSansCallback(
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

  const aidants = annuaire?.aidants;

  useEffect(() => {
    if (annuaire?.liens) {
      navigationMAC.ajouteEtat(annuaire?.liens);
    }
  }, [annuaire]);

  if (enCoursDeChargement) {
    return (
      <div className="cartes-aidants-messages">
        <TypographieH6>Chargement des Aidants...</TypographieH6>
      </div>
    );
  }

  if (enErreur) {
    return <></>;
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
        Il y a actuellement <b>{aidants.length}</b> Aidant
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
