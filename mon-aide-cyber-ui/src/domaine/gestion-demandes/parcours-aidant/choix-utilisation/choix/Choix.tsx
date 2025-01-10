import { PropsWithChildren } from 'react';

export type ProprietesChoix = PropsWithChildren<
  React.LabelHTMLAttributes<HTMLLabelElement>
> & {
  surSelection: () => void;
  name: string;
};

export const Choix = ({
  children,
  name,
  ...proprietesRestantes
}: ProprietesChoix) => {
  return (
    <label className={proprietesRestantes.className}>
      <div>
        <input
          name={name}
          type="radio"
          onChange={() => proprietesRestantes.surSelection()}
        />
      </div>
      {children}
    </label>
  );
};
