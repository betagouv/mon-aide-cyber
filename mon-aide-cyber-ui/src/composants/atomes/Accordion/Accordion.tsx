import { PropsWithChildren } from 'react';
import './accordion.scss';

export const Accordion = ({
  title,
  id,
  ...proprietesRestantes
}: PropsWithChildren<{ title: string; id: string }>) => {
  return (
    <section className="fr-accordion">
      <h3 className="fr-accordion__title">
        <button
          className="fr-accordion__btn"
          aria-expanded="false"
          aria-controls={id}
        >
          {title}
        </button>
      </h3>
      <div className="fr-collapse" id={id}>
        {proprietesRestantes.children}
      </div>
    </section>
  );
};
