import { useCallback } from 'react';
import './marelle.scss';

export type EtapeMarelle = {
  titre: string;
  description: JSX.Element;
  illustration: string;
};

type ProprietesMarelle = {
  etapes: EtapeMarelle[];
} & React.HTMLAttributes<HTMLDivElement>;

const OPACITE_INITIALE = 0.3;
const OPACITE_FINALE = 1;
const ECART_OPACITE = OPACITE_FINALE - OPACITE_INITIALE;

export const Marelle = ({
  etapes,
  ...proprietesRestantes
}: ProprietesMarelle) => {
  const nombreEtapes = etapes.length;
  const pas = ECART_OPACITE / nombreEtapes;

  const calculeOpacite = useCallback(
    (index: number) =>
      index === 0 ? OPACITE_INITIALE : (index + nombreEtapes - 1) * pas,
    [nombreEtapes, pas]
  );

  const estPair = useCallback((index: number) => (index + 1) % 2 === 0, []);

  return (
    <section className="marelle-etapes" {...proprietesRestantes}>
      {etapes.map((etape, index) => (
        <div
          className={`marelle-etape ${estPair(index) ? 'pair' : ''}`}
          key={etape.titre}
        >
          <img
            className="taille-maximale tres-petite-marge-basse"
            src={etape.illustration}
            alt=""
          />
          <div
            style={{
              opacity: calculeOpacite(index),
            }}
            className="numero-etape visible-uniquement-desktop tres-petite-marge-basse"
          >
            <span>{index + 1}</span>
          </div>
          <div>
            <h4 className="alignement-gauche">{etape.titre}</h4>
            <p className="alignement-gauche">{etape.description}</p>
          </div>
          {etapes.length - 1 !== index ? (
            <img
              className={`visible-uniquement-desktop chemin ${estPair(index) ? 'pair' : ''}`}
              src="/images/chemin-etape.svg"
            ></img>
          ) : null}
        </div>
      ))}
    </section>
  );
};
