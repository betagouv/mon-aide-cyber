import { ContexteModale, ElementModale } from '../../fournisseurs/ContexteModale.ts';
import { createPortal } from 'react-dom';
import { PropsWithChildren, ReactElement, useCallback, useEffect, useRef, useState } from 'react';

type ProprietesElementModale = ElementModale & {
  boutonFermer: ReactElement;
  surClickEnDehors: () => void
};
export const Modale = (
  proprietes: PropsWithChildren<ProprietesElementModale>,
) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const clickEnDehors = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      console.log("je ferme la modale");
      proprietes.surClickEnDehors();
    }
  };

  useEffect(() => {
    addEventListener('click', clickEnDehors, true);

    return () => {
      removeEventListener('click', clickEnDehors);
    }
  });

  return (
    <div className="fr-container fr-container--fluid fr-container-md">
      <div className="fr-grid-row fr-grid-row--center">
        <div ref={ref} className="fr-col-12 fr-col-md-8 fr-col-lg-6">
          <div className="fr-modal__body modale-mac">
            <div className="fr-modal__header">{proprietes.boutonFermer}</div>
            <div className="fr-modal__content">
              <h3 id="titre-modale">{proprietes.titre}</h3>
              {proprietes.corps}
            </div>
            <div className="fr-modal__footer">
              <ul className="fr-btns-group fr-btns-group--left fr-btns-group--inline-lg">
                {proprietes.actions.map((action) => {
                  return <li key={action.key}>{action}</li>;
                })}
              </ul>
            </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export const PortailModale = ({ children }: PropsWithChildren) => {
  const [elementModale, setElementModale] = useState<null | ElementModale>(
    null,
  );
  const [classModale, setClasseModale] = useState<string | undefined>(
    undefined,
  );
  const [ariaModale, setAriaModale] = useState<boolean>(false);
  const [modaleOuverte, setModaleOuverte] = useState<boolean>(false);

  const fermeModale = useCallback(() => {
    setClasseModale('');
    setAriaModale(false);
    setModaleOuverte(false);
    setElementModale(null);
  }, []);

  return (
    <ContexteModale.Provider
      value={{
        ferme: () => fermeModale(),
        affiche: (element: ElementModale) => {
          setClasseModale('fr-modal--opened');
          setAriaModale(true);
          setModaleOuverte(true);
          setElementModale(element);
        },
      }}
    >
      {children}
      <dialog
        aria-labelledby="modale-title"
        id="modale"
        className={`fr-modal ${classModale}`}
        aria-modal={ariaModale}
        open={modaleOuverte}
        role="dialog"
      ></dialog>
      {elementModale
        ? createPortal(
              <Modale
                titre={elementModale.titre}
                corps={elementModale.corps}
                boutonFermer={
                  <button
                    className="fr-btn fr-btn--close"
                    aria-controls="modale"
                    title="Fermer"
                    onClick={() => fermeModale()}
                  />
                }
                actions={elementModale.actions}
                surClickEnDehors={fermeModale}
              />,
            document.getElementById('modale') as Element,
          )
        : null}
    </ContexteModale.Provider>
  );
};
