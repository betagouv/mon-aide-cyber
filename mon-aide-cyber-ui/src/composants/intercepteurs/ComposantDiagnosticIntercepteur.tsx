import { useParams } from "react-router-dom";
import { UUID } from "../../types/Types.ts";
import { ComposantDiagnostic } from "../ComposantDiagnostic.tsx";

export const ComposantDiagnosticIntercepteur = () => {
  const { idDiagnostic } = useParams();

  return <ComposantDiagnostic idDiagnostic={idDiagnostic! as UUID} />;
};
