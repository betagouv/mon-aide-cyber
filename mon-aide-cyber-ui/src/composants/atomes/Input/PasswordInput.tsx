import { InputHTMLAttributes, useState } from 'react';
import { Input } from './Input.tsx';

export type ProprietesPasswordInput = InputHTMLAttributes<HTMLInputElement>;

export const PasswordInput = ({
  ...proprietesRestantes
}: ProprietesPasswordInput) => {
  const [estAffiche, setEstAffiche] = useState(false);

  return (
    <div className="input-password-layout">
      <Input type={estAffiche ? 'text' : 'password'} {...proprietesRestantes} />
      <span
        className="input-password-icon"
        onClick={() => setEstAffiche((prev) => !prev)}
      >
        <i
          className={
            estAffiche
              ? 'mac-icone fr-icon-eye-off-fill'
              : 'mac-icone fr-icon-eye-fill'
          }
        />
      </span>
    </div>
  );
};
