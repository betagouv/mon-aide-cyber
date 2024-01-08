import { AdaptateurDeRestitution } from './AdaptateurDeRestitution';
import { RestitutionHTML } from './AdaptateurDeRestitutionHTML';

export type AdaptateursRestitution = {
  html: () => AdaptateurDeRestitution<RestitutionHTML>;
  pdf: () => AdaptateurDeRestitution<Buffer>;
};
