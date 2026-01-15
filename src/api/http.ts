import { hasMessage } from "../utils/typeGuards";

export type ApiError = {
  message: string;
  status: number;
};

async function safeReadJson(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function http(url: string, init?: RequestInit): Promise<unknown> {
  const res = await fetch(url, init);

  if (res.status === 204) return undefined;

  if (!res.ok) {
    const data = await safeReadJson(res);

    const message = hasMessage(data)
      ? data.message
      : "Ocorreu um erro ao processar sua solicitação.";

    throw { message, status: res.status } satisfies ApiError;
  }

  return safeReadJson(res);
}
