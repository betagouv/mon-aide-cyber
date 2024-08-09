import { PropsWithChildren } from 'react';

export type Theme = 'light' | 'dark';

type CadreProps = {
  theme?: Theme;
} & PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>;

function Cadre({ children, theme = 'light', ...restProps }: CadreProps) {
  const { className } = restProps;

  const themesClasses = {
    light: '',
    dark: 'mode-fonce',
  };
  const classesAConcatener = [
    className ? `${className}` : null,
    'cadre-petite-bordure',
    themesClasses[theme],
  ];

  const classNameEntier = classesAConcatener.join(' ');

  return (
    <div {...restProps} className={classNameEntier}>
      {children}
    </div>
  );
}

export default Cadre;
