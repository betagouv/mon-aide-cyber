import { ProprietesTypographie } from '../ProprieteTypographie';

export const TypographieH5 = ({
  children,
  ...proprietesRestantes
}: ProprietesTypographie) => {
  const { className } = proprietesRestantes;

  const classesAConcatener = [className ? `${className}` : null, 'mac-h5'];

  const classNameEntier = classesAConcatener.join(' ');
  return (
    <h5 {...proprietesRestantes} className={classNameEntier}>
      {children}
    </h5>
  );
};
