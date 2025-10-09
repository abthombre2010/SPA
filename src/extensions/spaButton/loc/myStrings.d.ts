declare interface ISpaButtonCommandSetStrings {
  Command1: string;
  Command2: string;
}

declare module 'SpaButtonCommandSetStrings' {
  const strings: ISpaButtonCommandSetStrings;
  export = strings;
}
