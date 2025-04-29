import illustrationQuiEstConcerne from '/images/illustration-qui-est-concerne.svg';
import { TypographieH4 } from '../../../../composants/communs/typographie/TypographieH4/TypographieH4';

export const QuiEstConcerne = () => {
  return (
    <section className="qui-est-concerne-layout fr-container">
      <div className="flex justify-center">
        <img src={illustrationQuiEstConcerne} alt="Deux futurs Aidants cyber" />
      </div>
      <div>
        <TypographieH4>
          <b>Qui est concerné ?</b>
        </TypographieH4>
        <p>
          <b>Engagés dans une démarche non commerciale</b> et avec une appétence
          pour les enjeux de cybersécurité, les Aidants cyber sont formés et
          outillés par l’ANSSI pour mener à bien la démarche d’accompagnement.{' '}
          <br />
          La communauté des Aidants cyber inclut entre autres :
          <ul>
            <li>
              des représentants de services de l’État (Police, Gendarmerie,
              réservistes...)
            </li>
            <li>
              des agents publics ou salariés d&apos;administrations publiques
            </li>
            <li>
              des salariés ou des adhérents d’entités morales à but non lucratif
              (associations à but non lucratif, Campus cyber, CSIRT, Clusir,
              CESIN, etc…)
            </li>
          </ul>
        </p>
      </div>
    </section>
  );
};
