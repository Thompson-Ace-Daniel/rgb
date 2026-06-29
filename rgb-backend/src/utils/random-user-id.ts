import {
  uniqueNamesGenerator,
  adjectives,
  animals,
  NumberDictionary,
} from "unique-names-generator";

export const randomUserId = (): string => {
  const numberSuffix = NumberDictionary.generate({ min: 10, max: 99 });

  const generatedName = uniqueNamesGenerator({
    dictionaries: [adjectives, adjectives, animals, numberSuffix],
    style: "capital",
    separator: "",
  });

  return generatedName.charAt(0).toLowerCase() + generatedName.slice(1);
};
