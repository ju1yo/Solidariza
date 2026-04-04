import toast from "react-hot-toast";
import { ApiResponse } from "@/core/dtos/api-response.dto";

interface FetchOptions extends RequestInit {
  showToast?: boolean;
}

export async function apiFetch<T>(
  url: string,
  options: FetchOptions = { showToast: true }
): Promise<T | null> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data: ApiResponse<T> = await response.json();

    if (!response.ok || !data.success) {
      const errorMsg = data.error?.message || "Ocorreu um erro inesperado";
      
      if (options.showToast) {
        toast.error(errorMsg);
      }
      
      return null;
    }

    return data.data ?? null;
  } catch (error) {
    if (options.showToast) {
      toast.error("Erro de conexão com o servidor");
    }
    console.error("API Fetch Error:", error);
    return null;
  }
}
