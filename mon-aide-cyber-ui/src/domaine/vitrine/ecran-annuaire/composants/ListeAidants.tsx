import { useEffect, useState } from 'react';
import { constructeurParametresAPI } from '../../../../fournisseurs/api/ConstructeurParametresAPI';
import { useMACAPI } from '../../../../fournisseurs/api/useMACAPI';
import { useNavigationMAC } from '../../../../fournisseurs/hooks';
import { useContexteNavigation } from '../../../../hooks/useContexteNavigation';
import { ReponseHATEOAS, Lien } from '../../../Lien';
import { MoteurDeLiens } from '../../../MoteurDeLiens';
import { AidantAnnuaire, ReponseAidantAnnuaire } from '../EcranAnnuaire';
import { CarteAidant } from './CarteAidant';
import { TypographieH6 } from '../../../../composants/communs/typographie/TypographieH6/TypographieH6';
import illustrationFAQFemme from '../../../../../public/images/illustration-faq-femme.svg';
import Button from '../../../../composants/atomes/Button/Button';
import { Link } from 'react-router-dom';

export const ListeAidants = () => {
  const macAPI = useMACAPI();
  const navigationMAC = useNavigationMAC();
  const { recupereContexteNavigation } = useContexteNavigation();
  const [enCoursDeChargement, setEnCoursDeChargement] = useState(true);
  const [aidants, setAidants] = useState<AidantAnnuaire[]>([]);

  const afficheUnPlurielSiMultiplesResultats = (tableau: unknown[]) => {
    return tableau && tableau.length > 1 ? 's' : '';
  };

  useEffect(() => {
    recupereContexteNavigation({ contexte: 'afficher-annuaire-aidants' }).then(
      (reponse) => {
        navigationMAC.ajouteEtat((reponse as ReponseHATEOAS).liens);
      }
    );
  }, []);

  useEffect(() => {
    new MoteurDeLiens(navigationMAC.etat).trouve(
      'afficher-annuaire-aidants',
      (lien: Lien) => {
        if (enCoursDeChargement) {
          macAPI
            .execute<ReponseAidantAnnuaire, ReponseAidantAnnuaire>(
              constructeurParametresAPI()
                .url(lien.url)
                .methode(lien.methode!)
                .construis(),
              (reponse) => reponse
            )
            .then((reponse: ReponseAidantAnnuaire) => {
              navigationMAC.ajouteEtat((reponse as ReponseHATEOAS).liens);
              setAidants(reponse.aidants!);
            })
            .catch((erreur: ReponseHATEOAS) => {
              console.log(erreur);
            })
            .finally(() => {
              setEnCoursDeChargement(false);
            });
        }
      }
    );
  }, [navigationMAC.etat]);

  if (enCoursDeChargement)
    return (
      <div className="cartes-aidants">
        <TypographieH6>Chargement des Aidants...</TypographieH6>
      </div>
    );

  if (!enCoursDeChargement && aidants?.length === 0)
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

  return (
    <div className="liste-aidants">
      <p>
        Il y a actuellement <b>{aidants.length}</b> Aidant
        {afficheUnPlurielSiMultiplesResultats(aidants)} ayant souhaité
        apparaître publiquement
        {afficheUnPlurielSiMultiplesResultats(aidants)} dans l&apos;annuaire de
        MonAideCyber.
      </p>
      <div className="cartes-aidants">
        {aidants?.map((aidant) => (
          <CarteAidant key={aidant.identifiant} nomPrenom={aidant.nomPrenom} />
        ))}
      </div>
    </div>
  );
};
