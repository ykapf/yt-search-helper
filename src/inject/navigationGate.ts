const CACHE_KEY = "sfa_navigation_gate";

interface RedirectStamp {
  sourceHash: string;
  targetHash: string;
  timestamp: number;
}

type ReadStamp = () => RedirectStamp | null;
type WriteStamp = (value: RedirectStamp) => void;

interface GateOptions {
  now?: () => number;
  cooldownMs?: number;
  readStamp?: ReadStamp;
  writeStamp?: WriteStamp;
}

function hashFragment(input: string): string {
  let value = 0;
  for (let index = 0; index < input.length; index += 1) {
    value = (value * 31 + input.charCodeAt(index)) >>> 0;
  }
  return value.toString(16);
}

function createBrowserStore(): { readStamp: ReadStamp; writeStamp: WriteStamp } {
  return {
    readStamp: () => {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) {
        return null;
      }
      try {
        return JSON.parse(raw) as RedirectStamp;
      } catch {
        return null;
      }
    },
    writeStamp: (value) => {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(value));
    },
  };
}

export function createNavigationGate(options: GateOptions = {}) {
  const now = options.now ?? (() => Date.now());
  const cooldownMs = options.cooldownMs ?? 1500;
  const store = createBrowserStore();
  const readStamp = options.readStamp ?? store.readStamp;
  const writeStamp = options.writeStamp ?? store.writeStamp;

  return {
    canNavigate(sourceUrl: string, targetUrl: string): boolean {
      const sourceHash = hashFragment(sourceUrl);
      const targetHash = hashFragment(targetUrl);
      const current = readStamp();
      const timestamp = now();

      if (
        current &&
        current.sourceHash === sourceHash &&
        current.targetHash === targetHash &&
        timestamp - current.timestamp < cooldownMs
      ) {
        return false;
      }

      writeStamp({ sourceHash, targetHash, timestamp });
      return true;
    },
  };
}
