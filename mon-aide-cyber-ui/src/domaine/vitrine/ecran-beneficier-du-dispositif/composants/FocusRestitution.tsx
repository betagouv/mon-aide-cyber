import { TypographieH3 } from '../../../../composants/communs/typographie/TypographieH3/TypographieH3';
import restitutionRadarSvg from '/images/illustration-indicateurs-maturite.svg';
import { BoutonDemandeAide } from '../../../../composants/atomes/Lien/BoutonDemandeAide.tsx';

export const FocusRestitution = () => {
  return (
    <div>
      <div className="fr-container focus-restitution-layout">
        <section>
          <TypographieH3>Focus sur la restitution du diagnostic</TypographieH3>
          <p>
            À l’issue du diagnostic, un document de restitution vous est
            proposé. Ce document est composé des éléments suivants :
          </p>
          <ul>
            <li>Un indicateur de maturité par thématique</li>
            <li>Un liste de six mesures prioritaires</li>
            <li>Un catalogue de prestataires référencés</li>
            <li>Les contacts utiles de votre territoire</li>
            <li>De ressources complémentaires adaptées à vos besoins</li>
          </ul>
          <div>
            <BoutonDemandeAide titre="Je fais une demande" />
          </div>
        </section>
        <section>
          <img
            src={restitutionRadarSvg}
            alt="Représentation graphique de la restitution sous forme de radar par catégorie cyber"
          />
        </section>
      </div>
    </div>
  );
};
