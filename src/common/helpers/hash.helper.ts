import { createId } from "@paralleldrive/cuid2";

export class HashHelper {
  static getCuid2(): string {
    return createId();
  }
}