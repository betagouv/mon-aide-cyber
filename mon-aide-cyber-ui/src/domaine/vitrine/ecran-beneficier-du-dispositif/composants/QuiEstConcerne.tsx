import { TypographieH4 } from '../../../../composants/communs/typographie/TypographieH4/TypographieH4';
import illustrationQuiEstConcerne from '/images/illustration-qui-est-concerne-etre-aide.svg';
import { BoutonDemandeAide } from '../../../../composants/atomes/Lien/BoutonDemandeAide.tsx';

export const QuiEstConcerne = () => {
  return (
    <section className="qui-est-concerne-layout fr-container">
      <div className="flex justify-center">
        <img
          src={illustrationQuiEstConcerne}
          alt="Un aidé pensant à toutes les problématiques cyber de son entité"
        />
      </div>
      <div>
        <TypographieH4>
          <b>Qui est concerné ?</b>
        </TypographieH4>
        <p>
          Le dispositif s’adresse aux entités privées comme publiques, de toute
          taille. Elles sont déjà sensibilisées au risque cyber et souhaitent
          s’engager dans une première démarche de renforcement de leur sécurité
          numérique.
          <br />
          <br />À l’inverse, il n’est pas adapté aux particuliers, aux
          entreprises mono-salariés et aux auto-entrepreneurs, ainsi qu’aux
          entités jugées d’un bon niveau de maturité cyber (exemple : entité
          ayant déjà menée des audits de cybersécurité ou disposant des
          ressources cyber en interne).
        </p>

        <BoutonDemandeAide titre="Je fais une demande" />
      </div>
    </section>
  );
};
