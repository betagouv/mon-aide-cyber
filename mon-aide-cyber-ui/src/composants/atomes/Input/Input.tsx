import { InputHTMLAttributes } from 'react';

export type ProprietesInput = InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ ...proprietesRestantes }: ProprietesInput) => {
  const { className } = proprietesRestantes;

  const nomsDeClasseEntier = [
    className ? `${className}` : null,
    'fr-input',
  ].join(' ');

  return <input {...proprietesRestantes} className={nomsDeClasseEntier} />;
};
