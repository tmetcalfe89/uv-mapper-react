import {
  Box,
  Button,
  Code,
  Container,
  FileInput,
  LoadingOverlay,
  MantineProvider,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import ImageList from "./component/ImageList";
import useUvMapper from "./data/useUvMapper";

export default function App() {
  const {
    inputs: { images, json },
    beginProcess,
    processing,
  } = useUvMapper();

  return (
    <MantineProvider
      theme={{ colorScheme: "dark" }}
      withGlobalStyles
      withNormalizeCSS
    >
      <Box pos="absolute" w="100vw" h="100vh">
        <LoadingOverlay visible={processing} />
      </Box>
      <Container py="xs">
        <Stack>
          <Title>Per-face to Box UV</Title>
          <Text italic>Fixes your face!</Text>
          <Text>
            This tool is dedicated to the memory of those of us who had to go
            through and redo an entire model by hand because we accidentally
            used per-face instead of box uv.
          </Text>
          <Text>
            Select your model&apos;s <Code>.geo.json</Code> file as well as its
            associated texture files. Hit the process button, and you&apos;ll
            get a <Code>.zip</Code> file with the fixed files.
          </Text>
          <Text>
            Note that it will NOT work with decimal sizes in the bones.
          </Text>
          <FileInput
            label="Model JSON"
            accept="application/json"
            value={json.selectedFile}
            onChange={json.setFile}
          />
          <ImageList {...images} />
          <Button
            disabled={!images.selectedFiles.length || !json.selectedFile}
            onClick={beginProcess}
          >
            Process
          </Button>
        </Stack>
      </Container>
    </MantineProvider>
  );
}
