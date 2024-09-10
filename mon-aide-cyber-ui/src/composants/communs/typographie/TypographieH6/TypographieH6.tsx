import { ProprietesTypographie } from '../ProprieteTypographie';

export const TypographieH6 = ({
  children,
  ...proprietesRestantes
}: ProprietesTypographie) => {
  const { className } = proprietesRestantes;

  const classesAConcatener = [className ? `${className}` : null, 'mac-h6'];

  const classNameEntier = classesAConcatener.join(' ');
  return (
    <h6 {...proprietesRestantes} className={classNameEntier}>
      {children}
    </h6>
  );
};
