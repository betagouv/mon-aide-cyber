import { ComposantReponsePossible } from './ComposantReponsePossible.tsx';
import {
  Question,
  ReponsePossible,
} from '../../domaine/diagnostic/Referentiel.ts';
import { useEffect, useState } from 'react';

export type ReponseTiroir = {
  identifiant: string;
  questionTiroir: {
    identifiant: string;
    valeur: string;
  };
};
type ProprietesConteneurReponsePossible = {
  reponse: ReponsePossible;
  question: Question;
  typeDeSaisie: 'radio' | 'checkbox';
  repondQuestionUnique: (identifiantReponse: string) => void;
  repondQuestionMultiple: (reponse: string) => void;
  repondQuestionTiroirMultiple: (reponse: ReponseTiroir) => void;
  repondQuestionTiroirUnique: (reponse: ReponseTiroir) => void;
};

export const ConteneurReponsePossible = ({
  reponse,
  question,
  typeDeSaisie,
  repondQuestionUnique,
  repondQuestionMultiple,
  repondQuestionTiroirMultiple,
  repondQuestionTiroirUnique,
}: ProprietesConteneurReponsePossible) => {
  const [deploieTiroir, setDeploieTiroir] = useState(
    question.reponseDonnee.valeur === reponse.identifiant
  );

  useEffect(() => {
    setDeploieTiroir(question.reponseDonnee.valeur === reponse.identifiant);
  }, [question.reponseDonnee.valeur, reponse.identifiant]);

  useEffect(() => {
    if (deploieTiroir) {
      new Promise((r) => setTimeout(r, 500)).then(() =>
        document
          .getElementById(question.identifiant)
          ?.scrollIntoView({ behavior: 'smooth' })
      );
    }
  }, [deploieTiroir, question.identifiant]);

  return (
    <ComposantReponsePossible
      key={reponse.identifiant}
      reponsePossible={reponse}
      identifiantQuestion={question.identifiant}
      typeDeSaisie={typeDeSaisie}
      onChange={(identifiantReponse) => {
        setDeploieTiroir(!deploieTiroir);
        typeDeSaisie === 'radio'
          ? repondQuestionUnique(identifiantReponse)
          : repondQuestionMultiple(identifiantReponse);
      }}
      selectionnee={
        typeDeSaisie === 'radio'
          ? question.reponseDonnee.valeur === reponse.identifiant
          : question.reponseDonnee.reponses.some((rep) =>
              rep.reponses.has(reponse.identifiant)
            )
      }
    >
      {reponse.questions?.map((questionTiroir) => (
        <div
          className={`question-tiroir ${deploieTiroir ? `question-tiroir-visible` : `question-tiroir-invisible`}`}
          key={questionTiroir.identifiant}
        >
          <legend className="fr-fieldset__legend">
            <h5>{questionTiroir.libelle}</h5>
            {questionTiroir.type === 'choixMultiple' && (
              <p>Cette question est à choix multiple</p>
            )}
          </legend>
          {questionTiroir.reponsesPossibles.map((rep) => {
            const typeDeSaisie =
              questionTiroir?.type === 'choixMultiple' ? 'checkbox' : 'radio';

            return (
              <ComposantReponsePossible
                key={rep.identifiant}
                reponsePossible={rep}
                identifiantQuestion={questionTiroir.identifiant}
                typeDeSaisie={typeDeSaisie}
                selectionnee={question.reponseDonnee.reponses.some((reponse) =>
                  reponse.reponses.has(rep.identifiant)
                )}
                onChange={(identifiantReponse) => {
                  typeDeSaisie === 'checkbox'
                    ? repondQuestionTiroirMultiple({
                        identifiant: reponse.identifiant,
                        questionTiroir: {
                          identifiant: questionTiroir.identifiant,
                          valeur: identifiantReponse,
                        },
                      })
                    : repondQuestionTiroirUnique({
                        identifiant: reponse.identifiant,
                        questionTiroir: {
                          identifiant: questionTiroir.identifiant,
                          valeur: identifiantReponse,
                        },
                      });
                }}
              />
            );
          })}
        </div>
      ))}
    </ComposantReponsePossible>
  );
};
