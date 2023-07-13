import PropTypes from "prop-types";
import {
  Card,
  CloseButton,
  FileInput,
  Group,
  Image,
  Stack,
  Text,
} from "@mantine/core";
import { IconPhotoPlus } from "@tabler/icons-react";

export default function ImageList({
  selectedFiles,
  addSelectedFiles,
  selectedFilesData,
  removeSelectedFile,
}) {
  return (
    <Stack>
      <FileInput
        label="Model Texture(s)"
        accept="image/png"
        multiple
        onChange={addSelectedFiles}
        value={selectedFiles}
        icon={<IconPhotoPlus />}
      />
      <Group>
        {selectedFiles.map((file) => (
          <Card key={file.name} w={256} shadow="sm" withBorder padding="xs">
            <Card.Section>
              <Image
                src={selectedFilesData[file.name]}
                sx={{ imageRendering: "pixelated" }}
              />
            </Card.Section>
            <Group position="apart">
              <Text weight="bold">{file.name}</Text>
              <CloseButton onClick={() => removeSelectedFile(file)} />
            </Group>
          </Card>
        ))}
      </Group>
    </Stack>
  );
}

ImageList.propTypes = {
  selectedFiles: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  addSelectedFiles: PropTypes.func.isRequired,
  selectedFilesData: PropTypes.shape(),
  removeSelectedFile: PropTypes.func.isRequired,
};
