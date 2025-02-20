import {
  EtapeMarelle,
  Marelle,
} from '../../../../composants/communs/Marelle/Marelle';
import { TypographieH2 } from '../../../../composants/communs/typographie/TypographieH2/TypographieH2';

export const FonctionnementDispositif = () => {
  const etapesMarelle: EtapeMarelle[] = [
    {
      titre: 'La mise en relation avec un Aidant',
      description: (
        <>
          À la suite de votre demande et de la validation des conditions
          générales d&apos;utilisation, vous êtes{' '}
          <b>mis en lien avec un Aidant</b> de proximité, qui vous accompagne
          (sur une durée d&apos;environ une heure et trente minutes) pour
          réaliser un <b>diagnostic cyber de premier niveau</b>. À
          cette occasion, il est fortement recommandé d’associer le responsable
          informatique et/ou le prestataire cyber, ainsi qu’un décideur.
        </>
      ),
      illustration: '/images/illustration-echange.svg',
    },
    {
      titre: 'Un diagnostic adapté aux enjeux cyber actuels',
      description: (
        <>
          MonAideCyber a pour objectif d’
          <b>
            accompagner les entités à mettre en place une première démarche
          </b>{' '}
          “d’hygiène informatique”. Les questions du diagnostic couvrent ainsi
          un périmètre défini par l’ANSSI, avec un focus sur les enjeux liés à
          la menace cybercriminelle.
        </>
      ),
      illustration: '/images/illustration-marelle.svg',
    },
    {
      titre: 'Une liste de mesures utiles et classées par priorité',
      description: (
        <>
          <b>Six mesures prioritaires sont proposées</b> à l’issue du
          diagnostic. Facilement compréhensibles et actionnables, elles doivent
          pouvoir être mises en œuvre par les équipes de l’entité ou celles du
          prestataire. Une liste de ressources utiles complète par ailleurs la
          restitution, afin d’<b>orienter la mise en place du plan d’action</b>.
        </>
      ),
      illustration: '/images/illustration-mesures.svg',
    },
    {
      titre: "Un point d'étape pour vous guider",
      description: (
        <>
          Quelques mois après la réalisation du diagnostic,{' '}
          <b>un point d’étape est proposé</b> par l’Aidant, afin de suivre vos
          avancées et apporter des conseils additionnels.
        </>
      ),
      illustration: '/images/illustration-suivi.svg',
    },
  ];

  return (
    <section className="fond-clair-mac comment-fonctionne-le-dispositif-layout">
      <div className="fr-container">
        <TypographieH2>Comment fonctionne le dispositif ?</TypographieH2>
        <Marelle etapes={etapesMarelle} />
      </div>
    </section>
  );
};
