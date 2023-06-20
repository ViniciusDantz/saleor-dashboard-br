import { InitialStateResponse } from "../../API/InitialStateResponse";
import { UrlToken } from "../UrlToken";
import { FetchingParams, emptyFetchingParams, toFetchingParams } from "./fetchingParams";
import { FilterElement } from "../../FilterElement";
import { ParsedQs, parse } from "qs";
import { useRef } from "react";
import { FilterContainer } from "../../useFilterContainer";

const toFlatUrlTokens = (p: UrlToken[], c: TokenArray[number]) => {
  if (typeof c == "string") return p

  if (Array.isArray(c)) {
    return p.concat(flatenate(c))
  }

  return p.concat(c)
}

const flatenate = (tokens: TokenArray): UrlToken[] => {
  return tokens.reduce<UrlToken[]>(toFlatUrlTokens, [])
}

const mapToTokens = (urlEntries: (ParsedQs | string)[]): TokenArray =>
  urlEntries.map(entry => {
    if (typeof entry === "string") return entry

    if (Array.isArray(entry)) return mapToTokens(entry)

    return UrlToken.fromUrlEntry(entry)
  }) as TokenArray


const tokenizeUrl = (urlParams: string) => {
  const parsedUrl = Object.values(parse(urlParams)) as (ParsedQs | string)[]

  return mapToTokens(parsedUrl)
}

const mapUrlTokensToFilterValues = (urlTokens: TokenArray, response: InitialStateResponse) => {
  return urlTokens.map(el => {
    if (typeof el === "string") {
      return el;
    }

    if (Array.isArray(el)) {
      return mapUrlTokensToFilterValues(el, response);
    }

    return FilterElement.fromUrlToken(el, response);
  });
}


export class TokenArray extends Array<string | UrlToken | TokenArray> {
  constructor(url: string) {
    super(...tokenizeUrl(url))
  }

  public getFetchingParams() {
    return this.asFlatArray()
      .filter(token => token.isLoadable())
      .reduce<FetchingParams>(toFetchingParams, emptyFetchingParams)
  }

  public asFlatArray() {
    return flatenate(this)
  }

  public asFilterValuesFromResponse(response: InitialStateResponse): FilterContainer {
    return this.map(el => {
      if (typeof el === "string") {
        return el;
      }

      if (Array.isArray(el)) {
        return mapUrlTokensToFilterValues(el, response);
      }

      return FilterElement.fromUrlToken(el, response);
    });
  }
}

export const useTokenArray = (url: string) => {
  const instance = useRef<TokenArray>(null)

  if (!instance.current) {
    instance.current = new TokenArray(url)
  }

  return instance.current
}