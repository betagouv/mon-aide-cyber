import { useRef } from 'react';
import { TableDesMatieres } from './Crisp.types.ts';
import './synchro-menu-mobile.js';

export const MenuCrispMobile = ({
  tableDesMatieres,
}: {
  tableDesMatieres: TableDesMatieres;
}) => {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  return (
    <div className="sommaire sommaire-replie">
      <details ref={detailsRef}>
        <summary>
          <div className="entete-filtres">
            <img
              className="menu"
              src="/images/icones/icone-menu-lateral.svg"
              alt=""
            />
            <span id="section-active" className="titre-menu">
              {tableDesMatieres[0]?.texte}
            </span>
            <img
              className="chevron"
              src="/images/icones/fleche-bas.svg"
              alt=""
            />
          </div>
        </summary>

        <ul>
          {tableDesMatieres.map((entree) => (
            <li key={entree.id}>
              <a
                href={`#${entree.id}`}
                onClick={() => detailsRef.current!.removeAttribute('open')}
              >
                {entree.texte}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
};
