declare let renderData: (err?: unknown, data?: unknown) => void;

declare let generateTargetUrl: () => Promise<string>;

declare let $db: {
  get: (key: string) => Promise<unknown>;
  set: (key: string, value: unknown) => Promise<unknown>;
};

