import { useCallback, useState } from "react";

export default function useFile({ loader = () => {} }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileData, setSelectedFileData] = useState(null);

  const setFile = useCallback(
    (newFile) => {
      setSelectedFile(newFile);
      loader(newFile).then(setSelectedFileData);
    },
    [loader]
  );

  const clearFile = useCallback(() => {
    setSelectedFile(null);
    setSelectedFileData(null);
  }, []);

  return {
    selectedFile,
    setFile,
    selectedFileData,
    clearFile,
  };
}
