/**
 * Structural-compatible stand-in for firebase/firestore `Timestamp`.
 * The schema library intentionally does NOT depend on the firebase package
 * so it can be imported from any environment (server, client, scripts, tests).
 *
 * At runtime, pass real `firebase/firestore` Timestamp objects — they satisfy
 * this interface because they expose the same `seconds`, `nanoseconds` and
 * `toDate()` shape.
 */
export interface Timestamp {
  readonly seconds: number;
  readonly nanoseconds: number;
  toDate(): Date;
  toMillis(): number;
  isEqual(other: Timestamp): boolean;
}
