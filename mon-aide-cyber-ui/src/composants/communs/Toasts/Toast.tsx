import { HTMLAttributes } from 'react';

export type ProprietesToast = {
  message: string;
  type: 'SUCCES' | 'ERREUR' | 'ATTENTION' | 'INFO';
} & HTMLAttributes<HTMLDivElement>;

export const Toast = ({
  message,
  type,
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

  if (!type) return null;
  const toastAAfficher = toastParType[type];

  const classesAConcatener = [
    className ? `${className}` : null,
    'mac-callout',
    toastAAfficher.className,
  ];
  const classNameEntier = classesAConcatener.join(' ');

  return (
    <div {...proprietesRestantes} className={classNameEntier}>
      <div>
        <i className={toastAAfficher.icone} aria-hidden="true"></i>
      </div>
      <div>{message}</div>
    </div>
  );
};
