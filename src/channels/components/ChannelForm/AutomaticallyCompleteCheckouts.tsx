import PreviewPill from "@dashboard/components/PreviewPill";
import { FormChange } from "@dashboard/hooks/useForm";
import { Box, Checkbox, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "./messages";

interface AutomaticallyCompleteCheckoutsProps {
  onChange: FormChange;
  isChecked: boolean;
  hasError: boolean;
  disabled?: boolean;
}

export const AutomaticallyCompleteCheckouts = ({
  onChange,
  isChecked,
  hasError,
  disabled,
}: AutomaticallyCompleteCheckoutsProps) => (
  <Box paddingX={6}>
    <Checkbox
      name="automaticallyCompleteCheckouts"
      data-test-id="automatically-complete-checkouts-checkbox"
      checked={isChecked}
      error={hasError}
      onCheckedChange={value =>
        onChange({ target: { name: "automaticallyCompleteCheckouts", value } })
      }
      disabled={disabled}
    >
      <Text>
        <FormattedMessage {...messages.automaticallyCompleteCheckoutsLabel} />
      </Text>{" "}
      <PreviewPill />
    </Checkbox>
    <Box paddingLeft={4}>
      {" "}
      <Text size={3} color="default2" paddingLeft={0.5}>
        <FormattedMessage
          {...messages.automaticallyCompleteCheckoutsDescription}
          values={{ link: "TODO" }}
        />
      </Text>
    </Box>
  </Box>
);
