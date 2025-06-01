import type {
  APIComponentInContainer,
  APIComponentInMessageActionRow,
} from "discord-api-types/v10";
import { ActionRow, Button, Container, Separator } from "dressed";
import { ps, type History } from "../state";

export default function DexPage({
  children,
  inputs = [],
  hideSearchButton,
  history,
}: {
  children: APIComponentInContainer[];
  inputs?: (APIComponentInMessageActionRow | APIComponentInMessageActionRow[])[];
  hideSearchButton?: boolean;
  history: History;
}) {
  if (!hideSearchButton) {
    inputs[0] = [inputs[0] ?? []].flat().concat(
      Button({
        custom_id: ps`search-${history}`,
        emoji: { name: "🔍" },
        style: "Secondary",
      })
    );
  }

  return Container(
    ...children,
    ...(inputs.length > 0 ? [Separator()] : []),
    ...inputs.map((i) => ActionRow(...[i].flat()))
  );
}
