import { Header } from '../Header.tsx';
import { Footer } from '../Footer.tsx';

export const ComposantAffichageErreur = ({
  error,
}: {
  error: { message: string };
}) => (
  <>
    <Header />
    <main role="main">
      <div role="alert">
        <h2>Une erreur est survenue :</h2>
        <p>{error.message}</p>
      </div>
    </main>
    <Footer />
  </>
);
