import { ComposantReponsePossible } from './ComposantReponsePossible.tsx';
import {
  Question,
  ReponseMultiple,
  ReponsePossible,
} from '../../domaine/diagnostic/Referentiel.ts';
import { useEffect, useState } from 'react';

type ProprietesConteneurReponsePossible = {
  reponse: ReponsePossible;
  question: Question;
  typeDeSaisie: 'radio' | 'checkbox';
  repondQuestionUnique: (identifiantReponse: string) => void;
  repondQuestionMultiple: (elementReponse: {
    identifiantReponse: string;
    reponse: string;
  }) => void;
  repondQuestionTiroirMultiple: (
    identifiantReponse: string,
    elementReponse: {
      identifiantReponse: string;
      reponse: string;
    }
  ) => void;
  repondQuestionTiroirUnique: (
    identifiantReponse: string,
    elementReponse: {
      identifiantReponse: string;
      reponse: string;
    }
  ) => void;
  reponseDonnee: {
    valeur: () => string | undefined;
    reponses: ReponseMultiple[];
  };
};

export const ConteneurReponsePossible = ({
  reponse,
  question,
  typeDeSaisie,
  repondQuestionUnique,
  repondQuestionMultiple,
  repondQuestionTiroirMultiple,
  repondQuestionTiroirUnique,
  reponseDonnee,
}: ProprietesConteneurReponsePossible) => {
  const [deploieTiroir, setDeploieTiroir] = useState(
    reponseDonnee.valeur() === reponse.identifiant
  );

  useEffect(() => {
    setDeploieTiroir(reponseDonnee.valeur() === reponse.identifiant);
  }, [reponse.identifiant, reponseDonnee]);
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
          : repondQuestionMultiple({
              identifiantReponse: question.identifiant,
              reponse: identifiantReponse,
            });
      }}
      selectionnee={
        typeDeSaisie === 'radio'
          ? reponseDonnee.valeur() === reponse.identifiant
          : reponseDonnee.reponses.some((rep) =>
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
                selectionnee={reponseDonnee.reponses.some((reponse) =>
                  reponse.reponses.has(rep.identifiant)
                )}
                onChange={(identifiantReponse) => {
                  typeDeSaisie === 'checkbox'
                    ? repondQuestionTiroirMultiple(reponse.identifiant, {
                        identifiantReponse: questionTiroir.identifiant,
                        reponse: identifiantReponse,
                      })
                    : repondQuestionTiroirUnique(reponse.identifiant, {
                        identifiantReponse: questionTiroir.identifiant,
                        reponse: identifiantReponse,
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
