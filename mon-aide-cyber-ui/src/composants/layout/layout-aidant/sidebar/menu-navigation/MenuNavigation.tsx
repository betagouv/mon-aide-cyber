import { MenuNavigationElement } from '../../MenuNavigationElement';
import { LienMenuNavigation } from './LienMenuNavigation';

type ProprietesMenuNavigation = {
  elements: MenuNavigationElement[];
};

export const MenuNavigation = ({ elements }: ProprietesMenuNavigation) => {
  return (
    <ul className="menu-lateral">
      {elements?.map((element) => (
        <LienMenuNavigation key={element.nom} element={element} />
      ))}
    </ul>
  );
};
