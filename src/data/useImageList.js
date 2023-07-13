import { loadImage } from "../util/loaders";
import useFiles from "./useFiles";

export default function useImageList() {
  return useFiles({ loader: loadImage });
}
