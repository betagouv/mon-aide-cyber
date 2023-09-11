export interface Adaptateur<T> {
  lis(): Promise<T>;
}
