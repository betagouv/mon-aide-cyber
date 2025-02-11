import { TypographieH4 } from '../../../../../composants/communs/typographie/TypographieH4/TypographieH4.tsx';
import Cadre from '../../../../../composants/a-propos/Cadre.tsx';

export const PublicationSurLesReseaux = () => {
  return (
    <div>
      <div className="fr-col-md-8 fr-col-sm-12">
        <TypographieH4>Publication sur les réseaux sociaux</TypographieH4>
        <p>
          Les modèles de posts à personnaliser sont des textes accompagnés de
          visuels optimisés pour Linkedin.
        </p>
      </div>
      <div className="fr-col-12">
        <div className="visuels-reseaux-sociaux">
          <Cadre>
            <img
              src="/images/kit-aidant/je-suis-aidant-sombre.png"
              alt="Exemple d'illustration MonAideCyber pour publication sur les réseaux sociaux"
            />
          </Cadre>
          <Cadre>
            <img
              src="/images/kit-aidant/MAC_5-diagnostics_blanc.png"
              alt="Exemple d'illustration de compteur de diagnostics pour publication sur les réseaux sociaux"
            />
          </Cadre>
        </div>
        <br />
        <a
          href="/fichiers/MonAideCyber_visuels_publications_linkedin.zip"
          target="_blank"
        >
          Télécharger tous les visuels
        </a>
      </div>
      <div className="fr-col-12">
        <br />
        <p>Exemple de post pour LinkedIn :</p>
        <Cadre className="kit-aidant-cadre-exemple-texte">
          <p>
            Cher réseau, <br />
            Je suis ravi de vous annoncer que je viens de devenir{' '}
            <b>Aidant MonAideCyber en [VOTRE TERRITOIRE]</b> ! <br />
            <br />
            Dans un monde de plus en plus connecté, la cybersécurité est plus
            cruciale que jamais pour nous protéger de la cybercriminalité de
            masse. Je suis enthousiaste à l’idée de pouvoir vous accompagner
            dans l’identification des vulnérabilités de votre entité dans le
            cadre d’une démarche de maturité cyber : ensemble, nous pouvons
            identifier les failles numériques de votre organisation et mettre en
            place des solutions adaptées.
            <br />
            <br />
            Je vous propose de nous rencontrer pour réaliser ensemble
            grauitement un <b>diagnostic cyber de premier niveau.</b> N‘hésitez
            pas à me contacter pour toute demande de renseignement.
            <br />
            <br />
            Ensemble, faisons de la cybersécurité une priorité !
          </p>
        </Cadre>
        <br />
        <a
          href="/fichiers/MonAideCyber_kit-aidant_publications-linkedin.pdf"
          target="_blank"
        >
          Téléchargez tous les modèles de posts
        </a>
      </div>
    </div>
  );
};
