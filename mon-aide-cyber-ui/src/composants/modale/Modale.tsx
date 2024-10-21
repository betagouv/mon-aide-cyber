import {
  forwardRef,
  PropsWithChildren,
  ForwardedRef,
  useRef,
  useEffect,
  ReactElement,
} from 'react';
import { ElementModale, TailleModale } from '../../fournisseurs/ContexteModale';

type ProprietesElementModale = ElementModale & {
  boutonFermer: ReactElement;
  surClickEnDehors: () => void;
};

const taillesModale: Map<TailleModale, string> = new Map<TailleModale, string>([
  ['centree', 'fr-col-xl-6 fr-col-8'],
  ['moyenne', 'fr-col-xl-7 fr-col-10'],
  ['large', 'fr-col-12'],
]);

export const Modale = forwardRef(function Modale(
  proprietes: PropsWithChildren<ProprietesElementModale>,
  referenceDialogue: ForwardedRef<any>
) {
  const ref = useRef<HTMLDivElement | null>(null);

  const clickEnDehors = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      proprietes.surClickEnDehors();
    }
  };

  useEffect(() => {
    addEventListener('click', clickEnDehors, true);

    return () => {
      removeEventListener('click', clickEnDehors);
    };
  });

  const taille =
    taillesModale.get(proprietes.taille || 'centree') || 'fr-col-6';

  return (
    <div className="fr-container fr-container--fluid">
      <div className="fr-grid-row fr-grid-row--center">
        <div ref={ref} className={taille}>
          <div
            ref={referenceDialogue}
            className="fr-modal__body modale-mac fr-m-0 fr-p-0"
          >
            <div className="fr-modal__header">
              <div className="fr-grid-row fr-col-12">
                <div className="fr-col-10">
                  <h4 id="titre-modale">{proprietes.titre}</h4>
                </div>
                <div className="fr-col-2">{proprietes.boutonFermer}</div>
              </div>
            </div>
            <div className="fr-modal__content">{proprietes.corps}</div>
          </div>
        </div>
      </div>
    </div>
  );
});
