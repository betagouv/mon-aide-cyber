import { ReponseHATEOAS } from './hateoas';

export interface ConstructeurHATEOAS<T extends ReponseHATEOAS> {
  construis(): T;
}
