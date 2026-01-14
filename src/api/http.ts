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

export async function http<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);

  if (res.status === 204) {
    return undefined as T;
  }

  if (!res.ok) {
    const data = await safeReadJson(res);

    const message = hasMessage(data)
      ? data.message
      : "Ocorreu um erro ao processar sua solicitação.";

    const err: ApiError = {
      message,
      status: res.status,
    };

    throw err;
  }

  const data = await safeReadJson(res);
  return data as T;
}
