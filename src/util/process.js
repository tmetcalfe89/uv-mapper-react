import { CubeManager, Grid } from "./uvGrid";
import JSZip from "jszip";
import downloadFile from "downloadfile-js";

function collectCubes(model) {
  const collectedCubes = [];
  for (let bone of model["minecraft:geometry"][0].bones) {
    if (!bone.cubes) continue;
    for (let cube of bone.cubes) {
      collectedCubes.push(new CubeManager(cube));
    }
  }
  return collectedCubes;
}

function layoutRectangles(cubes, grid = new Grid()) {
  if (!cubes.length) {
    return grid;
  }

  const cube = cubes.pop();
  let placed = false;
  for (let x = 0; x <= grid.size - cube.width && !placed; x++) {
    cube.x = x;
    for (let y = 0; y <= grid.size - cube.height && !placed; y++) {
      cube.y = y;
      if (grid.canPlace(cube)) {
        grid.addPiece(cube);
        placed = true;
      }
    }
  }

  if (!placed) {
    grid.upsize();
    cubes.push(cube);
  }

  return layoutRectangles(cubes, grid);
}

function loadImageEl(imageData) {
  return new Promise((res, rej) => {
    const image = document.createElement("img");

    image.onload = () => {
      res(image);
    };

    image.onerror = (e) => {
      rej(e);
    };

    image.src = imageData;
  });
}

export default async function process({ jsonName, jsonData }, images) {
  const clonedJson = JSON.parse(JSON.stringify(jsonData));
  const zip = new JSZip();

  const cubeSource = collectCubes(clonedJson);
  const initialCubes = cubeSource.map((cube) => new CubeManager(cube.clone()));
  const grid = layoutRectangles(cubeSource);
  const finalCubes = grid.pieces.reverse();

  await Promise.all(
    images.map(async ({ imageData, imageName }) => {
      const canvas = document.createElement("canvas");
      canvas.width = grid.size;
      canvas.height = grid.size;

      const imageEl = await loadImageEl(imageData);
      const context = canvas.getContext("2d");
      context.imageSmoothingEnabled = false;

      for (let i in initialCubes) {
        const initialCube = initialCubes[i].perFace;
        const finalCube = finalCubes[i].perFace;

        for (let side in initialCube) {
          const props = [
            ...initialCube[side].uv,
            ...initialCube[side].uv_size,
            ...finalCube[side].uv,
            ...finalCube[side].uv_size,
          ];
          context.drawImage(imageEl, ...props);
        }
      }

      return new Promise((res) => {
        canvas.toBlob((blob) => {
          zip.file(imageName, blob);
          res();
        });
      });
    })
  );

  const description = clonedJson["minecraft:geometry"][0].description;
  description.texture_width = description.texture_height = grid.size;

  zip.file(jsonName, JSON.stringify(clonedJson));

  downloadFile(await zip.generateAsync({ type: "blob" }), "download.zip");
}
