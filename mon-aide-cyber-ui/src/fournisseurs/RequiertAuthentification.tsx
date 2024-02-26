import { useAuthentification } from './hooks.ts';
export const RequiertAuthentification = () => {
  const macapi = useAuthentification();

  return macapi.element;
};
