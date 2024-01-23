import {
  hueToPillColorDark,
  hueToPillColorLight,
  stringToHue,
} from "@dashboard/components/Datagrid/customCells/PillCell";
import { Locale } from "@dashboard/components/Locale";
import { formatMoney, formatMoneyRange } from "@dashboard/components/Money";
import { Condition, Rule } from "@dashboard/discounts/models";
import { CatalogConditions, OrderConditions } from "@dashboard/discounts/types";
import { DefaultTheme, Option } from "@saleor/macaw-ui-next";

const MAX_ITEMS_TO_SHOW = 3;

export type OptionWithConditionType = Option & {
  type: CatalogConditions | OrderConditions;
};

export const splitConditions = (
  conditions: OptionWithConditionType[],
): {
  conditionsInSummary: OptionWithConditionType[];
  conditionsInTooltip: OptionWithConditionType[];
} => {
  const conditionsInSummary = conditions.slice(0, MAX_ITEMS_TO_SHOW);
  const conditionsInTooltip = conditions.slice(MAX_ITEMS_TO_SHOW);

  return {
    conditionsInSummary,
    conditionsInTooltip,
  };
};

export const mapConditionToOption = (
  conditions: Array<Condition & { inputType: string | null }>,
  currencySymbol: string,
  locale: Locale,
): OptionWithConditionType[] => {
  return conditions.reduce<OptionWithConditionType[]>((acc, condition) => {
    if (Array.isArray(condition.values) && condition.type !== "between") {
      acc.push(
        ...condition.values.map<OptionWithConditionType>(value => ({
          ...value,
          type: condition.name as CatalogConditions | OrderConditions,
        })),
      );
    } else {
      acc.push({
        label: getConditionLabel(condition, currencySymbol, locale),
        value: condition.values.toString(),
        type: condition.name as CatalogConditions | OrderConditions,
      });
    }

    return acc;
  }, []);
};

function getConditionLabel(
  condition: Condition & { inputType: string | null },
  currencySymbol: string,
  locale: Locale,
): string {
  if (condition.inputType === "price") {
    if (condition.type === "between") {
      return `${formatMoneyRange(
        {
          amount: Number(condition.values[0]),
          currency: currencySymbol,
        },
        {
          amount: Number(condition.values[1]),
          currency: currencySymbol,
        },
        locale,
      )}`;
    }

    if (condition.type === "greater") {
      return `greater than ${formatMoney(
        {
          amount: Number(condition.values),
          currency: currencySymbol,
        },
        locale,
      )}`;
    }

    if (condition.type === "lower") {
      return `lower than ${formatMoney(
        {
          amount: Number(condition.values),
          currency: currencySymbol,
        },
        locale,
      )}`;
    }

    return formatMoney(
      {
        amount: Number(condition.values),
        currency: currencySymbol,
      },
      locale,
    );
  }

  return condition.values.toString();
}

export const conditionTypeToHue = (
  type: OrderConditions | CatalogConditions,
  theme: DefaultTheme,
) => {
  const hue = stringToHue(type);
  return theme === "defaultDark"
    ? hueToPillColorDark(hue)
    : hueToPillColorLight(hue);
};

export const hasNoRuleConditions = (rule: Rule) => {
  return (
    !rule.conditions.length ||
    rule.conditions.every(condition => !condition.values.length)
  );
};
