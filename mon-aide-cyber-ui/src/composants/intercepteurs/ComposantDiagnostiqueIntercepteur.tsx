import { useParams } from "react-router-dom";
import { ComposantDiagnostique } from "../ComposantDiagnostique.tsx";
import { UUID } from "../../types/Types.ts";

export const ComposantDiagnostiqueIntercepteur = () => {
  const { idDiagnostique } = useParams();

  return <ComposantDiagnostique identifiant={idDiagnostique! as UUID} />;
};
