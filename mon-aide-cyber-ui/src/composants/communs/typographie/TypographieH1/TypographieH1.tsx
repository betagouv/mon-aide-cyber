import { ProprietesTypographie } from '../ProprieteTypographie';

export const TypographieH1 = ({
  children,
  ...proprietesRestantes
}: ProprietesTypographie) => {
  const { className } = proprietesRestantes;

  const classesAConcatener = [className ? `${className}` : null, 'mac-h1'];

  const classNameEntier = classesAConcatener.join(' ');
  return (
    <h1 {...proprietesRestantes} className={classNameEntier}>
      {children}
    </h1>
  );
};
