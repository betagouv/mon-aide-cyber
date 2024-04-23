export const ComposantIdentifiantDiagnostic = ({
  identifiant,
}: {
  identifiant: string;
}) => {
  const valeur = `${identifiant.substring(0, 3)} ${identifiant.substring(
    3,
    6,
  )} ${identifiant.substring(6, 8)}`;
  return <>{valeur.toUpperCase()}</>;
};
