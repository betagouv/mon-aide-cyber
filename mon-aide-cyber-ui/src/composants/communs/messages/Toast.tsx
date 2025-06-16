import { HTMLAttributes, useEffect, useState } from 'react';
import './toast.scss';

export type ProprietesToast = {
  message: string;
  type: 'SUCCES' | 'ERREUR' | 'ATTENTION' | 'INFO';
  affiche: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const Toast = ({
  message,
  type,
  affiche,
  ...proprietesRestantes
}: ProprietesToast) => {
  const { className } = proprietesRestantes;

  const toastParType = {
    SUCCES: {
      className: 'succes',
      icone: 'fr-icon-success-fill',
    },
    ERREUR: {
      className: 'erreur',
      icone: 'fr-icon-close-circle-fill',
    },
    ATTENTION: {
      className: 'attention',
      icone: 'fr-icon-error-warning-fill',
    },
    INFO: {
      className: 'information',
      icone: 'fr-icon-information-fill',
    },
  };

  const [doitAfficher, setDoitAfficher] = useState(affiche);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (affiche) {
      setDoitAfficher(true);
      requestAnimationFrame(() => {
        setAnimationClass('apparait');
      });
    } else {
      setAnimationClass('disparait');
      const timeout = setTimeout(() => setDoitAfficher(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [affiche]);

  if (!doitAfficher) return null;

  if (!type) return null;
  const toastAAfficher = toastParType[type];

  return (
    <div
      {...proprietesRestantes}
      className={`mac-callout toast ${toastAAfficher.className} ${className ? className : ''} ${animationClass}`}
    >
      <i className={toastAAfficher.icone} aria-hidden="true"></i>
      <div>{message}</div>
    </div>
  );
};
