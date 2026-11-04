import { backendServiceApi } from "@/shared/lib/api";
import type { ContactMessagePayload } from "@/entities/contact";

export async function submitContactMessage(payload: ContactMessagePayload): Promise<void> {
  await backendServiceApi.post("/contact", payload);
}
