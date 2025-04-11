export class ErreurEnvoiEmail extends Error {
  constructor(message: string, cause: { cause: Error }) {
    super(message, cause);
  }
}
