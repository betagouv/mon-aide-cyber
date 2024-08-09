import { PropsWithChildren } from 'react';
import { Link as RouterLink, To } from 'react-router-dom';
type SideMenuProps = { sticky: boolean } & PropsWithChildren<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
>;
function Sidemenu({ children, sticky, ...proprietes }: SideMenuProps) {
  return (
    <nav
      {...proprietes}
      className={`fr-sidemenu ${sticky ? 'fr-sidemenu--sticky' : null}`}
    >
      <div className="fr-sidemenu__inner">
        <ul className="fr-sidemenu__list">{children}</ul>
      </div>
    </nav>
  );
}

function Link({
  children,
  to,
  anchorId,
}: PropsWithChildren<{ to: To; anchorId: string }>) {
  return (
    <li className={`fr-sidemenu__item fr-sidemenu__item--active`}>
      <RouterLink to={to} className={`fr-sidemenu__link ${anchorId}`}>
        {children}
      </RouterLink>
    </li>
  );
}

Sidemenu.Link = Link;

export default Sidemenu;
