import { ProprietesTypographie } from '../ProprieteTypographie';

export const TypographieH3 = ({
  children,
  ...proprietesRestantes
}: ProprietesTypographie) => {
  const { className } = proprietesRestantes;

  const classesAConcatener = [className ? `${className}` : null, 'mac-h3'];

  const classNameEntier = classesAConcatener.join(' ');
  return (
    <h3 {...proprietesRestantes} className={classNameEntier}>
      {children}
    </h3>
  );
};
