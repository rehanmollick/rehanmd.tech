// /admin/about — KV-backed config form for the bulletin modal.
// Server component fetches the current config, hands it to the client form.

import { getAboutConfig } from "@/lib/about";
import AboutConfigForm from "@/components/admin/AboutConfigForm";

export default async function AdminAboutPage() {
  const config = await getAboutConfig();
  return <AboutConfigForm initial={config} />;
}
