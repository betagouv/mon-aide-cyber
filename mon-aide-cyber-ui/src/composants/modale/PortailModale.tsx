import {
  ContexteModale,
  ElementModale,
} from '../../fournisseurs/ContexteModale.ts';
import { createPortal } from 'react-dom';
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Modale } from './Modale.tsx';

export const PortailModale = ({ children }: PropsWithChildren) => {
  const [elementModale, setElementModale] = useState<null | ElementModale>(
    null
  );
  const [classeModale, setClasseModale] = useState<string | undefined>(
    undefined
  );
  const [ariaModale, setAriaModale] = useState<boolean>(false);
  const [modaleOuverte, setModaleOuverte] = useState<boolean>(false);
  const ref = useRef<HTMLDialogElement | null>(null);

  const fermeModale = useCallback(() => {
    setClasseModale('');
    setAriaModale(false);
    setModaleOuverte(false);
    setElementModale(null);
  }, []);

  useEffect(() => {
    const modaleCourante = ref.current;
    if (modaleOuverte && modaleCourante) {
      const focusable: NodeListOf<HTMLElement> | undefined =
        modaleCourante.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

      const premierElement = focusable?.[0];
      const premierElementInput =
        Array.from(focusable.values()).find(
          (element) => element instanceof HTMLInputElement
        ) || focusable?.[0];
      const dernierElement = focusable?.[focusable.length - 1];
      const timeoutSurPremierChamps = setTimeout(
        () => premierElementInput?.focus(),
        10
      );

      const surTabulation = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === premierElementInput) {
            e.preventDefault();
            dernierElement.focus();
          } else if (!e.shiftKey && document.activeElement === dernierElement) {
            e.preventDefault();
            premierElement.focus();
          }
        }
      };

      const surEchappe = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          fermeModale();
        }
      };

      modaleCourante.addEventListener('keydown', surTabulation);
      modaleCourante.addEventListener('keydown', surEchappe);

      return () => {
        clearTimeout(timeoutSurPremierChamps);
        modaleCourante.removeEventListener('keydown', surTabulation);
        modaleCourante.removeEventListener('keydown', surEchappe);
      };
    }
  }, [fermeModale, modaleOuverte]);

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
        aria-labelledby="titre-modale"
        id="modale"
        className={`fr-modal ${classeModale}`}
        aria-modal={ariaModale}
        open={modaleOuverte}
      />
      {elementModale
        ? createPortal(
            <Modale
              ref={ref}
              titre={elementModale.titre}
              corps={elementModale.corps}
              taille={elementModale.taille}
              boutonFermer={
                <button
                  className="fr-btn fr-btn--close"
                  type="button"
                  aria-controls="modale"
                  title="Fermer"
                  onClick={() => fermeModale()}
                />
              }
              surClickEnDehors={fermeModale}
            />,
            document.getElementById('modale') as Element
          )
        : null}
    </ContexteModale.Provider>
  );
};
