import { useCallback, useState } from "react";
import useImageList from "./useImageList";
import useJsonFile from "./useJsonFile";
import process from "../util/process";

export default function useUvMapper() {
  const images = useImageList();
  const json = useJsonFile();

  const [processing, setProcessing] = useState(false);
  const [outputs, setOutputs] = useState(null);

  const beginProcess = useCallback(async () => {
    setProcessing(true);
    setOutputs(
      await process(
        {
          jsonName: json.selectedFile.name,
          jsonData: json.selectedFileData,
        },
        images.selectedFiles.map((image) => ({
          imageData: images.selectedFilesData[image.name],
          imageName: image.name,
        }))
      )
    );
    setProcessing(false);
  }, [images, json]);

  return {
    inputs: {
      images,
      json,
    },
    outputs,
    beginProcess,
    processing,
  };
}
