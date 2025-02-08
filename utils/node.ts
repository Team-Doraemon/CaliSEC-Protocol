import {
  getApplicationId,
  getJWTObject,
  getStorageAppEndpointKey,
  getStorageContextId,
  setStorageAppEndpointKey,
  setStorageApplicationId,
  setStorageContextId,
} from "./storage";

export function getNodeUrl(): string {
  const storageKey = getStorageAppEndpointKey();

  if (!storageKey) {
    const envKey: string = process.env.NEXT_PUBLIC_NODE_URL ?? ""; // ✅ Fixed
    setStorageAppEndpointKey(envKey);
    return envKey;
  }

  return storageKey ?? "";
}

export function getContextId(): string {
  const storageContextId = getStorageContextId();

  if (!storageContextId) {
    const jwtToken = getJWTObject();
    const envKey: string = jwtToken?.context_id ?? "";
    setStorageContextId(envKey);
    return envKey;
  }

  return storageContextId ?? "";
}

export function getNearEnvironment(): string {
  return process.env.NEXT_PUBLIC_NEAR_ENVIRONMENT ?? "testnet"; // ✅ Fixed
}

export function getStorageApplicationId(): string {
  const storageApplicationId = getApplicationId();

  if (!storageApplicationId) {
    const envKey: string = process.env.NEXT_PUBLIC_APPLICATION_ID ?? "";
    setStorageApplicationId(envKey);
    return envKey;
  }

  return storageApplicationId ?? "";
}
