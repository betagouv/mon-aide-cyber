import {
  EtapeMarelle,
  Marelle,
} from '../../../../composants/communs/Marelle/Marelle';
import { TypographieH2 } from '../../../../composants/communs/typographie/TypographieH2/TypographieH2';

export const CommentDevenirAidant = () => {
  const etapesMarelle: EtapeMarelle[] = [
    {
      titre: 'Être formé à la démarche',
      description: (
        <>
          <b>Participez à une formation</b> MonAideCyber organisée par votre
          délégation régionale de l&apos;ANSSI en remplissant le formulaire
          d&apos;inscription. <br />
          Des formations sont régulièrement organisée sur tout le territoire.
          Elle durent trois heures et sont animées en présentiel.
        </>
      ),
      illustration: '/images/illustration-echange.svg',
    },
    {
      titre: "Valider la charte de l'Aidant",
      description: (
        <>
          Prenez connaissance de <b>la charte de l&apos;Aidant</b> et
          remettez-la signée à la délégation ou à l&apos;équipe MonAideCyber
          avant, pendant ou après la formation.
        </>
      ),
      illustration: '/images/illustration-mesures.svg',
    },
    {
      titre: 'Accéder à la plateforme',
      description: (
        <>
          Prenez connaissance de <b>la charte de l&apos;Aidant</b> et
          remettez-la signée à la délégation ou à l&apos;équipe MonAideCyber
          avant, pendant ou après la formation.
        </>
      ),
      illustration: '/images/illustration-mesures.svg',
    },
  ];

  return (
    <section className="fond-clair-mac comment-devenir-aidant-layout">
      <div className="fr-container">
        <TypographieH2>Comment devenir Aidant MonAideCyber ?</TypographieH2>
        <Marelle etapes={etapesMarelle} />
      </div>
    </section>
  );
};
