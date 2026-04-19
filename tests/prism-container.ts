import path from "path";
import { GenericContainer, StartedTestContainer, Wait } from "testcontainers";

const PRISM_IMAGE = "stoplight/prism:5.14.2";
const PRISM_PORT = 4010;
const PRISM_STARTUP_TIMEOUT_MS = 120000;

export async function startPrismContainer(
  specFilePath: string,
  containerSpecPath: string,
): Promise<StartedTestContainer> {
  return new GenericContainer(PRISM_IMAGE)
    .withBindMounts([
      {
        source: path.resolve(specFilePath),
        target: containerSpecPath,
        mode: "ro",
      },
    ])
    .withCommand(["mock", "-h", "0.0.0.0", containerSpecPath])
    .withExposedPorts(PRISM_PORT)
    .withStartupTimeout(PRISM_STARTUP_TIMEOUT_MS)
    .withWaitStrategy(
      Wait.forAll([
        Wait.forListeningPorts(),
        Wait.forLogMessage(/Prism is listening on/),
      ]),
    )
    .start();
}

export async function stopPrismContainer(
  startedContainer?: StartedTestContainer,
): Promise<void> {
  if (startedContainer) {
    await startedContainer.stop();
  }
}
