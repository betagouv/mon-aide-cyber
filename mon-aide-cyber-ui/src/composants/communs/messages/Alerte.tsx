import { HTMLAttributes } from 'react';

export type ProprietesAlerte = {
  message: string;
  type: 'SUCCES' | 'ERREUR' | 'ATTENTION' | 'INFO';
} & HTMLAttributes<HTMLDivElement>;

export const Alerte = ({
  message,
  type,
  ...proprietesRestantes
}: ProprietesAlerte) => {
  const { className } = proprietesRestantes;

  const alerteParType = {
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
  const alerteAAfficher = alerteParType[type];

  const classesAConcatener = [
    className ? `${className}` : null,
    'mac-callout',
    alerteAAfficher.className,
  ];
  const classNameEntier = classesAConcatener.join(' ');

  return (
    <div {...proprietesRestantes} className={classNameEntier}>
      <div>
        <i className={alerteAAfficher.icone} aria-hidden="true"></i>
      </div>
      <div>{message}</div>
    </div>
  );
};
