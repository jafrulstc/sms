import { authBn } from "~/features/auth/translate/authBn";
import { navigationBn } from "../../../translate/navigation/navigationBn";
import { Translations } from "../types/translation";

export const bn:Translations = {
  auth: authBn,
  navigation: navigationBn
} satisfies Translations;