import { EdcClient, EdcClientContext } from "../src";

export async function waitForNegotiationState(
  client: EdcClient,
  context: EdcClientContext,
  negotiationId: string,
  targetState: string,
  interval = 500,
): Promise<void> {
  let waiting = true;

  while (waiting) {
    const { state } = await client.data.getNegotiationState(
      context,
      negotiationId,
    );

    waiting = state !== targetState;

    await new Promise((resolve) => setTimeout(resolve, interval));
  }
}
