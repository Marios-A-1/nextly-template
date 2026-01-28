export type EpemvaseisBreadcrumbParams = {
  category?: string | null;
  subcategory?: string | null;
  step?: number | null;
};

export const buildEpemvaseisQuery = ({
  category,
  subcategory,
  step
}: EpemvaseisBreadcrumbParams) => {
  const params = new URLSearchParams();
  if (category) params.set("cat", category);
  if (subcategory) params.set("sub", subcategory);
  if (step) params.set("step", String(step));
  return params.toString();
};

export const buildEpemvaseisHref = (values: EpemvaseisBreadcrumbParams) => {
  const query = buildEpemvaseisQuery(values);
  return query ? `/epemvaseis?${query}` : "/epemvaseis";
};
