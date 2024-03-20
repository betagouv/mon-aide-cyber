import { useParams } from 'react-router-dom';
import React from 'react';
import { UUID } from '../../types/Types.ts';
import { ErrorBoundary } from 'react-error-boundary';
import { ComposantAffichageErreur } from '../erreurs/ComposantAffichageErreur.tsx';

('use client');
type CommePropriete<C extends React.ElementType> = {
  composant?: C;
};

type ProprietesAOmettre<C extends React.ElementType, P> = keyof (CommePropriete<C> & P);

type ProprietesComposantIntercepteur<C extends React.ElementType, Proprietes = unknown> = React.PropsWithChildren<
  Proprietes & CommePropriete<C>
> &
  Omit<React.ComponentPropsWithoutRef<C>, ProprietesAOmettre<C, Proprietes>>;

type ProprietesComposant = {
  idDiagnostic?: UUID;
};

export const ComposantIntercepteur = <C extends React.ElementType = 'div'>({
  composant,
}: ProprietesComposantIntercepteur<C, ProprietesComposant>) => {
  const Composant = composant || 'div';
  const params = useParams();

  return (
    <ErrorBoundary FallbackComponent={ComposantAffichageErreur}>
      <Composant {...params} />
    </ErrorBoundary>
  );
};
