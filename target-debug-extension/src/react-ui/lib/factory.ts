import AtJs, { getAndApplyOffers as getAndApplyOffersAT, generateToken as generateTokenAT, getNewCookiePCValue as getNewCookiePCValueAT, updateQueryParams as updateQueryParamsAT,
getQueryParameter as getQueryParameterAT} from './atJs';
import AlloyJs, {
  getAndApplyOffers as getAndApplyOffersAlloy,
  generateToken as generateTokenAlloy,
  getNewCookiePCValue as getNewCookiePCValueAlloy,
  updateQueryParams as updateQueryParamsAlloy,
  getQueryParameter as getQueryParameterAlloy
} from './alloyJs';
let sdkValue: string;
export default function Sdk(sdk: string = "atjs"): any {
  if(sdk === "atjs") {
    sdkValue = "atjs";
    return AtJs;
  } else if(sdk === "websdk") {
    sdkValue = "websdk";
    return AlloyJs;
  }
}

export function getQueryParameter(param: string): string | null {
  if (sdkValue === "atjs") {
    return getQueryParameterAT(param);
  }
  else {
    return getQueryParameterAlloy(param);
  }
}

export async function getAndApplyOffers(deliveryRequest: any, mcIdToUse: string, addCampaignId: (id: string) => void) {

  if (sdkValue === "atjs") {
    return getAndApplyOffersAT(deliveryRequest, mcIdToUse, addCampaignId);
  } else {
    return getAndApplyOffersAlloy(deliveryRequest, mcIdToUse, addCampaignId);
  }
}

export function generateToken(size?: number) {
  if (sdkValue === "atjs") {
    return generateTokenAT(size);
  }
  else {
    return generateTokenAlloy(size);
  }
}

export function getNewCookiePCValue(newPCValue: string): string | undefined {
  if (sdkValue === "atjs") {
    return getNewCookiePCValueAT(newPCValue);
  } else {
    return getNewCookiePCValueAlloy(newPCValue);
  }
}

export function updateQueryParams(key: string, value?: string) {
  if (sdkValue === "atjs") {
    return updateQueryParamsAT(key, value);
  } else {
    return updateQueryParamsAlloy(key, value);
  }
}