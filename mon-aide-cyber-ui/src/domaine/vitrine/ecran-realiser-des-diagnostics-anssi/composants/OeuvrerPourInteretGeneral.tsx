import illustrationQuiEstConcerne from '../../../../../public/images/illustration-qui-est-concerne.svg';
import { TypographieH4 } from '../../../../composants/communs/typographie/TypographieH4/TypographieH4.tsx';

export const OeuvrerPourInteretGeneral = () => {
  return (
    <section className="qui-est-concerne-layout fr-container">
      <div className="flex justify-center">
        <img
          src={illustrationQuiEstConcerne}
          alt="Deux futurs Aidants MonAideCyber"
        />
      </div>
      <div>
        <TypographieH4>
          <b>Œuvrez pour l’intérêt général !</b>
        </TypographieH4>
        <p>
          Vous êtes prêts à accompagner des entités dans leur démarche de
          sécurisation cyber ? MonAideCyber regroupe une communauté animée par
          l’ANSSI pour aider l&apos;agence à renforcer le niveau de
          cybersécurité des entités publiques et privées les moins matures, en
          leur permettant de bénéficier d&apos;un diagnostic cyber de premier
          niveau.
        </p>
      </div>
    </section>
  );
};
