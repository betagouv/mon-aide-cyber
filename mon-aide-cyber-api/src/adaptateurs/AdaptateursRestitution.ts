import { AdaptateurDeRestitution } from './AdaptateurDeRestitution';
import { RestitutionHTML } from '../infrastructure/adaptateurs/AdaptateurDeRestitutionHTML';

export type AdaptateursRestitution = {
  html: () => AdaptateurDeRestitution<RestitutionHTML>;
  pdf: () => AdaptateurDeRestitution<Buffer>;
};
