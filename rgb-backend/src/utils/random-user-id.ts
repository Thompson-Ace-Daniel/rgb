import NameGenerator from "@atomiclotus/random-name-generator";

export const randomUserId = () => {
  const funnyUser = NameGenerator.get();
  return funnyUser;
}
