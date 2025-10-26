import { ActionRow, Button, Container, Separator } from "@dressed/react";
import React, { Fragment, type ReactNode } from "react";

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
    inputs[0] = (inputs[0] ?? []).concat(<Button custom_id="search" emoji={{ name: "🔍" }} style="Secondary" />);
  }

  return (
    <Container>
      {children}
      {inputs.length > 0 && <Separator />}
      {inputs.map((input, i) => (
        <ActionRow key={i.toString()}>
          {(Array.isArray(input) ? input : [input]).map((c, j) => (
            <Fragment key={j.toString()}>{isLoading ? { ...c, props: { ...c.props, disabled: true } } : c}</Fragment>
          ))}
        </ActionRow>
      ))}
    </Container>
  );
}
