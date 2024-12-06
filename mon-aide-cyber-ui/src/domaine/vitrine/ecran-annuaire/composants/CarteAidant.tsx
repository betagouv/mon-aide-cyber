import { PropsWithChildren } from 'react';
import './carte-aidant.scss';

export const CarteAidant = ({ children }: PropsWithChildren) => {
  return <div className="carte-aidant">{children}</div>;
};
