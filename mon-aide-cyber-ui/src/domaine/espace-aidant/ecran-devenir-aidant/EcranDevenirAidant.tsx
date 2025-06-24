import { TypographieH2 } from '../../../composants/communs/typographie/TypographieH2/TypographieH2.tsx';
import './ecran-devenir-aidant.scss';
import illustrationQuiEstConcerne from '/images/illustration-interet-general-mac.svg';
import { TypographieH4 } from '../../../composants/communs/typographie/TypographieH4/TypographieH4.tsx';
import Button from '../../../composants/atomes/Button/Button.tsx';
import { Link, useNavigate } from 'react-router-dom';
import { LienMailtoMAC } from '../../../composants/atomes/LienMailtoMAC.tsx';

export const EcranDevenirAidant = () => {
  const navigate = useNavigate();

  return (
    <article className="w-100 ecran-devenir-aidant">
      <section className="entete">
        <div>
          <TypographieH2 className="fr-mb-2w">
            Devenir Aidant cyber
          </TypographieH2>
          <p>
            Si vous êtes un professionnel, salarié d’une entreprise ou d’une
            organisation privée à but lucratif, vous avez la possibilité de
            devenir Aidant cyber en rejoignant une association. Devenir Aidant
            cyber vous permettra d’apparaître sur l’annuaire des Aidants cyber
            et d’être mis en relation avec les entités qui font des demandes en
            ligne.
          </p>
        </div>
        <div>
          <img src={illustrationQuiEstConcerne} alt="" />
        </div>
      </section>
      <section className="contenu">
        <div className="fr-grid-row">
          <div className="fr-col-md-8 fr-col-sm-12">
            <TypographieH4>Comment devenir Aidant cyber ?</TypographieH4>
            <p>
              Si vous n’êtes pas un représentant de l’État, il est nécessaire
              d’être adhérent à une association pour devenir Aidant cyber. Vous
              êtes déjà membre d’une association ou vous en connaissez une ?
              Vous souhaitez recevoir une liste des associations reconnues par
              MonAideCyber ? Contactez l’équipe à l’adresse suivante :{' '}
              <LienMailtoMAC /> pour que nous puissions prendre en compte votre
              demande.
            </p>
            <p>
              Afin de finaliser votre référencement en tant qu’Aidant cyber,
              vous devrez
              <ul>
                <li>
                  Participer à un atelier Devenir Aidant cyber. Animé par
                  l’ANSSI et d&apos;une durée d’environ trois heures, ces
                  ateliers sont organisés régulièrement dans tous les
                  territoires.
                </li>
                <li>
                  Prendre connaissance de la{' '}
                  <Link to="/charte-aidant">Charte de l’Aidant cyber</Link> et
                  l’accepter.
                </li>
              </ul>
            </p>
            <Button
              type="button"
              variant="primary"
              onClick={() => navigate('/mon-espace/demande-devenir-aidant')}
            >
              Je veux devenir Aidant cyber
            </Button>
          </div>
        </div>
        <br />
        <br />
        <div className="fr-grid-row">
          <div className="fr-col-md-8 fr-col-sm-12">
            <TypographieH4>Pourquoi devenir Aidant cyber ?</TypographieH4>
            <p>
              Les Aidants cyber, s’ils le souhaitent, peuvent apparaître sur le
              futur Annuaire des Aidants cyber, depuis lequel des entités
              peuvent les solliciter directement. Ils sont également mis en
              relation avec des entités qui font des demandes en ligne, selon
              leurs préférences : types d’entités, secteurs d’activités et
              secteurs géographiques où ils sont disposés à intervenir.
            </p>
          </div>
        </div>
        <br />
        <div className="fr-grid-row">
          <div className="fr-col-md-8 fr-col-sm-12">
            <TypographieH4>Qui sont les Aidants cyber ?</TypographieH4>
            <p>Les Aidants cyber sont :</p>
            <ul>
              <li>
                des représentants des services de l’État (Police, Gendarmerie,
                etc.)
              </li>
              <li>
                des agents publics ou des salariés de l’administration,
                d’établissements publics, de collectivités, de chambres
                consulaires ou syndicales, ou de tout autre opérateur public
              </li>
              <li>
                des salariés ou des adhérents d’entités morales à but non
                lucratif (ex : associations, Campus cyber, CSIRT, Clusir, CESIN,
                etc.) souhaitant participer à un monde numérique plus
                responsable
              </li>
            </ul>
          </div>
        </div>
        <br />
        <div className="fr-grid-row">
          <div className="fr-col-md-8 fr-col-sm-12">
            <TypographieH4>Les relais associatifs</TypographieH4>
            <p>
              L’équipe MonAideCyber collabore avec plusieurs associations
              ouvertes à l’intégration de nouveaux membres désireux de devenir
              Aidants cyber. Les associations partenaires partagent l’engagement
              en faveur d’un monde numérique plus responsable.
              <br /> <br />
              Si vous souhaitez proposer un partenariat avec MonAideCyber, ou si
              vous êtes intéressé par une liste d’associations correspondant à
              vos attentes, contactez l’équipe à l’adresse : <LienMailtoMAC />
            </p>
          </div>
        </div>
      </section>
    </article>
  );
};
