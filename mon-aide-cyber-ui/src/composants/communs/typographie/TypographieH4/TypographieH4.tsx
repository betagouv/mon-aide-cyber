import { ProprietesTypographie } from '../ProprieteTypographie';

export const TypographieH4 = ({
  children,
  ...proprietesRestantes
}: ProprietesTypographie) => {
  const { className } = proprietesRestantes;

  const classesAConcatener = [className ? `${className}` : null, 'mac-h4'];

  const classNameEntier = classesAConcatener.join(' ');
  return (
    <h4 {...proprietesRestantes} className={classNameEntier}>
      {children}
    </h4>
  );
};
