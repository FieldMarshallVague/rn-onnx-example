import { useEffect, useState } from "react";
import { Alert } from "react-native";

export function useBackendApi<T>(
  fn: () => Promise<T>,
  deps?: React.DependencyList
) {
  const [result, setResult] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);

  async function execute() {
    setLoading(true);
    try {
      const res = await fn();
      setResult(res);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        const err = error as any;
        if ("message" in err) {
          Alert.alert("Error", err.message);
        } else {
          Alert.alert("Error", "Unknown error");
        }
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    execute();
  }, deps);

  return { result, loading, reload: execute };
}
