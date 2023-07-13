import { useCallback, useState } from "react";

export default function useFiles({ loader = () => {} }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFilesData, setSelectedFilesData] = useState({});

  const addSelectedFiles = useCallback(
    (newFiles) => {
      const acceptedFiles = newFiles.filter(
        (file) =>
          !selectedFiles.some(
            (alreadySelected) => alreadySelected.name === file.name
          )
      );

      setSelectedFiles((prev) => [...prev, ...acceptedFiles]);

      acceptedFiles.forEach((file) => {
        if (file.name in selectedFilesData) return;
        loader(file).then((fileData) =>
          setSelectedFilesData((prev) => ({ ...prev, [file.name]: fileData }))
        );
      });
    },
    [loader, selectedFiles, selectedFilesData]
  );

  const removeSelectedFile = useCallback((removedFile) => {
    setSelectedFiles((prev) =>
      prev.filter((prevFile) => prevFile.name !== removedFile.name)
    );
  }, []);

  return {
    selectedFiles,
    addSelectedFiles,
    selectedFilesData,
    removeSelectedFile,
  };
}
