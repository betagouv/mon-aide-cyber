import HeroBloc from '../../../../composants/communs/HeroBloc';
import { TypographieH1 } from '../../../../composants/communs/typographie/TypographieH1/TypographieH1';
import dialogueSvg from '../../../../../public/images/illustration-echange.svg';
import { BoutonDemandeAide } from '../../../../composants/atomes/Lien/BoutonDemandeAide.tsx';

export const HeroDemandeAide = () => {
  return (
    <HeroBloc>
      <div id="corps" className="fr-container hero-layout">
        <section>
          <TypographieH1>Faire une demande MonAideCyber</TypographieH1>
          <p>
            Vous souhaitez bénéficier du dispositif MonAideCyber en tant
            qu&apos;entité publique ou privée ? Rien de plus simple !
            <br />
            <br />
            Remplissez le formulaire ci-dessous afin d’être mis en relation avec
            un Aidant cyber de proximité et réaliser un diagnostic cyber de
            premier niveau.
          </p>
          <div>
            <BoutonDemandeAide
              titre="Je fais une demande"
              className="bouton-mac-primaire-inverse"
            />
          </div>
        </section>
        <section>
          <img
            src={dialogueSvg}
            alt="illustration de deux personnes de face bras croisés et souriants"
          />
        </section>
      </div>
    </HeroBloc>
  );
};
