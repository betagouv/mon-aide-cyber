export type Departement = { nom: string; code: string };
export const estDepartement = (
  departement: string | Departement
): departement is Departement => {
  return (
    typeof departement !== 'string' && !!departement.code && !!departement.nom
  );
};
