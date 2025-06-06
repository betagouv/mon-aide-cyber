import { PropsWithChildren } from 'react';

export type ProprietesChoix = PropsWithChildren<
  React.LabelHTMLAttributes<HTMLLabelElement>
> & {
  surSelection: () => void;
  name: string;
  actif?: boolean;
};

export const Choix = ({
  children,
  name,
  actif,
  ...proprietesRestantes
}: ProprietesChoix) => {
  return (
    <label
      className={`${proprietesRestantes.className} ${actif ? '' : 'inactif'}`}
    >
      <div>
        <input
          name={name}
          type="radio"
          disabled={!actif}
          onClick={() => {
            if (!actif) return;
            proprietesRestantes.surSelection();
          }}
        />
      </div>
      {children}
    </label>
  );
};
