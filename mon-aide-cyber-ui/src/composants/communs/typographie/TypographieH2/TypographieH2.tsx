import { ProprietesTypographie } from '../ProprieteTypographie';

export const TypographieH2 = ({
  children,
  ...proprietesRestantes
}: ProprietesTypographie) => {
  const { className } = proprietesRestantes;

  const classesAConcatener = [className ? `${className}` : null, 'mac-h2'];

  const classNameEntier = classesAConcatener.join(' ');
  return (
    <h2 {...proprietesRestantes} className={classNameEntier}>
      {children}
    </h2>
  );
};
