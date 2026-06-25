declare module "@atomiclotus/random-name-generator" {
  const NameGenerator: {
    get(count?: number): string | string[];
    getColor(): string;
    getAdjective(): string;
    getDescriptor(): string;
    getAnimal(): string;
  };
  export default NameGenerator;
}
