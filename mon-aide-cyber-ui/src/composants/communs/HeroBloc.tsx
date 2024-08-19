import { PropsWithChildren } from 'react';

type HeroBlocProprietes = PropsWithChildren<
  React.HTMLAttributes<HTMLDivElement>
>;

function HeroBloc({ children, ...proprietes }: HeroBlocProprietes) {
  const { className } = proprietes;

  const classesAConcatener = [className ? `${className}` : null, 'mode-fonce'];
  const classNameEntier = classesAConcatener.join(' ');

  return (
    <div className={classNameEntier}>
      <div className="fr-container">{children}</div>
    </div>
  );
}

export default HeroBloc;
