import illustrationQuiEstConcerne from '/images/illustration-qui-est-concerne.svg';
import { TypographieH4 } from '../../../../composants/communs/typographie/TypographieH4/TypographieH4';

export const QuiEstConcerne = () => {
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
          <b>Qui est concerné ?</b>
        </TypographieH4>
        <p>
          <b>Engagés sur la base du volontariat</b>, avec une appétence pour les
          enjeux de cybersécurité, les Aidants cyber sont formés et outillés par
          l’ANSSI pour mener à bien la démarche d’accompagnement.
          <b> La communauté des Aidants cyber</b> inclue entre autres des
          représentants de services de l’État (Police, Gendarmerie,
          réservistes...), des collectivités, des associations (Campus Cyber,
          OPSN - Opérateurs Publics de Services Numériques...) et des
          volontaires de sociétés privées agissant à but non lucratif.
        </p>
      </div>
    </section>
  );
};
