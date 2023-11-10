export interface Transcripteur<E, S> {
  transcris(entite: E): S;
}
