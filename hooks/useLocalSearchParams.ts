import { useLocalSearchParams } from "expo-router";

export function useLocalSearchParamSingle(key: string): string {
  const params = useLocalSearchParams();

  var param = params[key];

  if (!param) return "";

  if (Array.isArray(param)) {
    return param.length == 0 ? "" : param[0];
  }

  return param;
}
