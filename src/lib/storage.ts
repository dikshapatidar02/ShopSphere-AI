class MemoryStorage {
  private store = new Map<string, string>();

  public getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  public setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  public removeItem(key: string): void {
    this.store.delete(key);
  }

  public clear(): void {
    this.store.clear();
  }
}

const memoryStorage = new MemoryStorage();

export function getSafeStorage(): Storage | MemoryStorage {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      // Test if localStorage is functional
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return window.localStorage;
    } catch {
      return memoryStorage;
    }
  }
  return memoryStorage;
}
