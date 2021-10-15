export class EmptyCollectionError extends Error {
  constructor() {
    super('The collection is empty.');
  }
}
