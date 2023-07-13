import { loadJson } from "../util/loaders";
import useFile from "./useFile";

export default function useJsonFile() {
  return useFile({ loader: loadJson });
}
