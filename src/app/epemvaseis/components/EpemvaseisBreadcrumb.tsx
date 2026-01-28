"use client";

import Link from "next/link";
import { Breadcrumb } from "antd";

type EpemvaseisBreadcrumbProps = {
  categoryLabel?: string | null;
  categoryHref?: string;
  subcategoryLabel?: string | null;
  subcategoryHref?: string;
  highlightLabel?: string | null;
};

const linkClass = "text-xs font-bold tracking-wide transition";
const mutedClass = "text-muted";
const hoverClass = "hover:text-text";
const highlightedClass = "text-primary";

const renderLink = (label: string, href: string, isActive: boolean) => (
  <Link
    href={href}
    className={`${linkClass} ${isActive ? highlightedClass : mutedClass} ${hoverClass}`}
  >
    {label}
  </Link>
);

const renderText = (label: string, isActive: boolean) => (
  <span className={`${linkClass} ${isActive ? highlightedClass : mutedClass}`}>
    {label}
  </span>
);

const renderCrumb = (label: string, href: string, isActive: boolean) =>
  renderLink(label, href, isActive);

export default function EpemvaseisBreadcrumb({
  categoryLabel,
  categoryHref,
  subcategoryLabel,
  subcategoryHref,
  highlightLabel
}: EpemvaseisBreadcrumbProps) {
  const breadcrumbItems = [
    {
      title: renderCrumb(
        "Επεμβάσεις",
        "/epemvaseis",
        highlightLabel === "Επεμβάσεις"
      )
    },
    ...(categoryLabel && categoryHref
      ? [
          {
            title: renderCrumb(
              categoryLabel,
              categoryHref,
              highlightLabel === categoryLabel
            )
          }
        ]
      : []),
    ...(subcategoryLabel
      ? [
          {
            title: subcategoryHref
              ? renderCrumb(
                  subcategoryLabel,
                  subcategoryHref,
                  highlightLabel === subcategoryLabel
                )
              : renderText(subcategoryLabel, highlightLabel === subcategoryLabel)
          }
        ]
      : [])
  ];

  return (
    <Breadcrumb
      separator="/"
      className="text-xs tracking-wide text-muted"
      items={breadcrumbItems}
    />
  );
}
