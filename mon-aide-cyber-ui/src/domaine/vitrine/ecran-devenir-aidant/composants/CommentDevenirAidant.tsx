import {
  EtapeMarelle,
  Marelle,
} from '../../../../composants/communs/Marelle/Marelle';
import { TypographieH2 } from '../../../../composants/communs/typographie/TypographieH2/TypographieH2';

export const CommentDevenirAidant = () => {
  const etapesMarelle: EtapeMarelle[] = [
    {
      titre: 'Découvrir la démarche',
      description: (
        <>
          <b>Participez à un atelier Devenir Aidant cyber</b> organisé par votre
          délégation régionale de l&apos;ANSSI en remplissant le formulaire
          d&apos;inscription. <br />
          Des ateliers sont régulièrement organisés sur tout le territoire. Ils
          durent trois heures et sont animés en présentiel.
        </>
      ),
      illustration: '/images/illustration-echange.svg',
    },
    {
      titre: "Valider la charte de l'Aidant cyber",
      description: (
        <>
          Prenez connaissance de <b>la charte de l&apos;Aidant cyber</b> et
          remettez-la signée à la délégation ou à l&apos;équipe MonAideCyber
          avant, pendant ou après l&apos;atelier.
        </>
      ),
      illustration: '/images/illustration-mesures.svg',
    },
    {
      titre: 'Accéder à la plateforme',
      description: (
        <>
          Une fois votre compte activé, vous pouvez dès lors accéder à la
          plateforme et <b>réaliser vos premiers diagnostics</b>.
        </>
      ),
      illustration: '/images/illustration-securite-des-acces.svg',
    },
  ];

  return (
    <section className="fond-clair-mac comment-devenir-aidant-layout">
      <div className="fr-container">
        <TypographieH2>Comment devenir Aidant cyber ?</TypographieH2>
        <Marelle etapes={etapesMarelle} />
      </div>
    </section>
  );
};
