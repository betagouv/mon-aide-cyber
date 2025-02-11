import { PropsWithChildren } from 'react';

export type ButtonVariants =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'link'
  | 'text';
export type Theme = 'dark' | 'light';

export type ButtonProps = PropsWithChildren<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> & {
  variant?: ButtonVariants;
  theme?: Theme;
  icon?: string;
  iconPos?: 'left' | 'right';
};

function Button({
  children,
  variant = 'default',
  theme = 'light',
  icon,
  iconPos,
  ...restProps
}: ButtonProps) {
  const { className, title } = restProps;
  const buttonVariants: Map<ButtonVariants, string> = new Map([
    ['default', 'bouton-mac-primaire'],
    ['primary', 'bouton-mac-primaire'],
    ['secondary', 'bouton-mac-secondaire'],
    ['link', 'bouton-mac-lien'],
    ['text', 'bouton-mac-texte'],
  ]);

  const classNames = [
    'bouton-mac',
    'bouton-mac-icone-conteneur',
    buttonVariants.get(variant),
    className,
    theme,
  ].join(' ');

  return (
    <button {...restProps} className={classNames}>
      {icon && iconPos === 'left' ? <i className={`fr-icon ${icon}`} /> : null}
      {children ? children : title}
      {icon && iconPos !== 'left' ? <i className={`fr-icon ${icon}`} /> : null}
    </button>
  );
}

export default Button;
