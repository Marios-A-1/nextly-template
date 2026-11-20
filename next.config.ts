import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  outputFileTracingIncludes: { "/api/results-images": ["./public/img/results/**/*"] },
};

export default withNextIntl(nextConfig);
