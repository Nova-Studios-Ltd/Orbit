function useClassNames(staticClassNames: string, optionalClassNames?: string) {
  let classNames = staticClassNames;

  if (optionalClassNames && optionalClassNames.length > 0) {
    classNames = classNames.concat(" ", optionalClassNames);
  }

  return classNames.trim();
}

export default useClassNames;
