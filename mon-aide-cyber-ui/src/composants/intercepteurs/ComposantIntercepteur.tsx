import { useLocation, useParams } from 'react-router-dom';
import React from 'react';
import { UUID } from '../../types/Types.ts';

('use client');
type CommePropriete<C extends React.ElementType> = {
  composant?: C;
};

type ProprietesAOmettre<
  C extends React.ElementType,
  P,
> = keyof (CommePropriete<C> & P);

type ProprietesComposantIntercepteur<
  C extends React.ElementType,
  Proprietes = unknown,
> = React.PropsWithChildren<Proprietes & CommePropriete<C>> &
  Omit<React.ComponentPropsWithoutRef<C>, ProprietesAOmettre<C, Proprietes>>;

type ProprietesComposant = Record<string, unknown | string | UUID>;

export const ComposantIntercepteur = <C extends React.ElementType = 'div'>({
  composant,
}: ProprietesComposantIntercepteur<C, ProprietesComposant>) => {
  const Composant = composant || 'div';
  const params = useParams();
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const queryParams = Object.entries(
    Object.fromEntries(urlSearchParams.entries())
  ).reduce((prev, [clef, valeur]) => ({ ...prev, [clef]: valeur }), {});
  return <Composant {...{ ...params, ...queryParams }} />;
};
