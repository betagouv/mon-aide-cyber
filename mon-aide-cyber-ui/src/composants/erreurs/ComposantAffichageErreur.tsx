export const ComposantAffichageErreur = ({
  error,
}: {
  error: { message: string };
}) => (
  <div role="alert">
    <h2>Une erreur est survenue :</h2>
    <p>{error.message}</p>
  </div>
);
