import { InputHTMLAttributes, useState } from 'react';
import { Input } from './Input.tsx';

export type ProprietesPasswordInput = InputHTMLAttributes<HTMLInputElement>;

export const PasswordInput = ({
  ...proprietesRestantes
}: ProprietesPasswordInput) => {
  const [estAffiche, setEstAffiche] = useState(false);

  return (
    <>
      <Input type={estAffiche ? 'text' : 'password'} {...proprietesRestantes} />
      <span
        onClick={() => setEstAffiche((prev) => !prev)}
        style={{
          cursor: 'pointer',
          position: 'absolute',
          bottom: '0.5rem',
          right: '0',
          paddingRight: '1rem',
        }}
      >
        <i
          className={
            estAffiche
              ? 'mac-icone fr-icon-eye-off-fill'
              : 'mac-icone fr-icon-eye-fill'
          }
        />
      </span>
    </>
  );
};
