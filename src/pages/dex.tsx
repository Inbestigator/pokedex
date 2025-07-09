import { ActionRow, Button, Container, Separator } from "@dressed/react";
import React from "react";
import { Fragment, type ReactNode } from "react";

export default function DexPage({
  children,
  inputs = [],
  hideSearchButton,
  isLoading,
}: {
  children: ReactNode;
  inputs?: React.JSX.Element[][];
  hideSearchButton?: boolean;
  isLoading?: boolean;
}) {
  if (!hideSearchButton) {
    inputs[0] = (inputs[0] ?? []).concat(
      <Button custom_id="search" emoji={{ name: "🔍" }} style="Secondary" />
    );
  }

  return (
    <Container>
      {children}
      {inputs.length > 0 && <Separator />}
      {inputs.map((i, idx) => (
        <ActionRow key={idx}>
          {(Array.isArray(i) ? i : [i]).map((c, i) => (
            <Fragment key={i}>
              {isLoading ? { ...c, props: { ...c.props, disabled: true } } : c}
            </Fragment>
          ))}
        </ActionRow>
      ))}
    </Container>
  );
}
