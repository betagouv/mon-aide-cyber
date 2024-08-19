import { PropsWithChildren } from 'react';
import { Link as RouterLink, To } from 'react-router-dom';
type SideMenuProps = { sticky: boolean } & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
>;
function Sidemenu({
  children,
  sticky,
  ...proprietes
}: PropsWithChildren<SideMenuProps>) {
  const { className } = proprietes;

  const classesAConcatener = [
    className ? `${className}` : null,
    'mac-sidemenu',
    sticky ? 'mac-sticky' : null,
  ];

  const classNameEntier = classesAConcatener.join(' ');

  return (
    <nav {...proprietes} className={classNameEntier}>
      <ul className="">{children}</ul>
    </nav>
  );
}

function Link({
  children,
  to,
  anchorId,
}: PropsWithChildren<{ to: To; anchorId: string }>) {
  return (
    <li className={``}>
      <RouterLink to={to} className={`${anchorId}`}>
        {children}
      </RouterLink>
    </li>
  );
}

Sidemenu.Link = Link;

export default Sidemenu;
