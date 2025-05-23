import { TableDesMatieres } from './Crisp.types.ts';

export const MenuCrispDesktop = ({
  tableDesMatieres,
}: {
  tableDesMatieres: TableDesMatieres;
}) => {
  return (
    <div className="sommaire sommaire-deplie">
      <ul>
        {tableDesMatieres.map((entree) => (
          <li key={entree.id}>
            <a href={`#${entree.id}`}>{entree.texte}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};
