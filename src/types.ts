export type fetchedData = {
  count:   number;
  title:   string;
  start:   string;
  stop:    string;
  results: any[];
  resume:  Resume;
  result:  Result[];
}

export type Result = {
  sum:  number | null;
  date: string;
}

export type Resume = {
  sum: number;
}