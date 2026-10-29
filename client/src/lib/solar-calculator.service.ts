import { apiClient } from "./api";

// Response shapes mirror the backend's public solar-calculator controller.
// Kept loose (`any`-ish) since the calculator surface is wide and the UI
// mostly formats fields for display, not typed logic.

export type PublicBrand = {
  id: number;
  name: string;
  category: string;
  inverter_type: string;
};

export type PublicQuoteRequest = {
  /** Apartment (Group Metering): flat per-kW subsidy, state ignored. */
  group_metering?: boolean;
  customer_name: string;
  mobile_number: string;
  system_capacity: number;
  inverter_size?: number;
  structure_kw?: number;
  brand_id?: number;
  category: "Residential" | "Commercial" | "Customized";
  inverter_type: "Ongrid" | "Hybrid" | "Offgrid";
  structure_type?: "elevated" | "flat_roof" | "ground_mount";
  state: string;
  district?: string;
  pincode?: string;
  address?: string;
  monthly_bill?: number;
  loan_type?: "no_loan" | "govt_loan" | "private_loan";
  emi_tenure_months?: number;
  // Hybrid inverter (only when inverter_type='Hybrid'). Free-text because
  // admin can add/rename variants + models via the catalog page.
  hybrid_ip_variant?: string;
  hybrid_model?: string;
  // Scopes hybrid inverter lookup. Backend falls back to Default when omitted.
  hybrid_brand_id?: number;
  // Independent battery brand — backend falls back to hybrid_brand_id then Default.
  battery_brand_id?: number;
  // Battery (Hybrid/Offgrid)
  battery_type?: "none" | "leadAcid" | "lithium";
  battery_qty?: number;
  battery_ah?: number;
  lithium_model?: string;
  lithium_qty?: number;
  lithium_kw?: number;
};

// Dynamic catalog fetched from the admin-editable pricing page. Every
// row is scoped to a hybrid brand. The old hardcoded lists are gone —
// admin adds / renames / removes brands, variants, models freely.
export interface PublicHybridBrand {
  id: number;
  name: string;
  sort_order: number;
}

export interface PublicHybridModel {
  id: number;
  name: string;
  price: number;
  sort_order: number;
}

export interface PublicHybridVariant {
  id: number;
  brand_id: number;
  name: string;
  sort_order: number;
  models: PublicHybridModel[];
}

export interface PublicBatteryModel {
  id: number;
  name: string;
  price: number;
  sort_order: number;
}

export interface PublicBatteryType {
  id: number;
  brand_id: number;
  name: string;
  kind: string;
  unit_label: string;
  sort_order: number;
  models: PublicBatteryModel[];
}

export interface CatalogSnapshot {
  brands: PublicHybridBrand[];
  variants: PublicHybridVariant[];
  battery_types: PublicBatteryType[];
}

// Without brandId: returns every brand's rows (drives the brand picker).
// With brandId: variants + battery_types scoped to that brand (drives
// variant + model + battery dropdowns).
export async function getHybridBatteryCatalog(brandId?: number): Promise<CatalogSnapshot> {
  const qs = brandId ? `?brand_id=${brandId}` : "";
  const res = await apiClient.get<{ status: string; data: CatalogSnapshot }>(
    `/hybrid-battery/catalog/snapshot${qs}`,
  );
  return res.data;
}

export type PublicQuoteResponse = {
  id: number;
  token: string;
  proposal_url: string;
  result: {
    system_capacity: number;
    brand_name: string;
    category: string;
    inverter_type: string;
    panel_cost: number;
    inverter_cost: number;
    installation_cost: number;
    battery_cost: number;
    total_system_cost: number;
    central_subsidy: number;
    state_subsidy: number;
    subsidy_amount: number;
    net_cost: number;
    units_per_day: number;
    units_per_month: number;
    annual_generation: number;
    monthly_savings: number;
    annual_savings: number;
    lifetime_savings_25_years: number;
    payback_period_years: number;
    roi_percentage: number;
    emi_options: Array<{
      tenure_months: number;
      monthly_emi: number;
      effective_emi: number;
    }>;
    selected_emi?: {
      tenure_months: number;
      monthly_emi: number;
      effective_emi: number;
      interest_rate: number;
      loan_type: string;
    };
    co2_mitigated_kg_per_year: number;
    trees_planted_equivalent: number;
    distance_km_equivalent: number;
    growth_plan: Array<{
      year: number;
      monthly_invest: number;
      total_invested: number;
      interest_earned: number;
      future_value: number;
    }>;
  };
};

export async function listPublicBrands(params?: {
  category?: string;
  inverter_type?: string;
}): Promise<PublicBrand[]> {
  const qs = new URLSearchParams();
  if (params?.category) qs.set("category", params.category);
  if (params?.inverter_type) qs.set("inverter_type", params.inverter_type);
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  const res = await apiClient.get<{ status: string; data: PublicBrand[] }>(
    `/solar-calculator/public/brands${suffix}`,
  );
  return res.data;
}

export async function computeQuote(
  body: PublicQuoteRequest,
): Promise<PublicQuoteResponse> {
  const res = await apiClient.post<{ status: string; data: PublicQuoteResponse }>(
    `/solar-calculator/public/quote`,
    body,
  );
  return res.data;
}

// Build the full URL to the proposal PDF endpoint. The path returned by the
// server is relative to /api — when VITE_API_URL points at a same-origin
// prefix ("/api", the default for local dev via the Vite proxy) we return
// the path as-is so the browser resolves it against the current origin.
// When VITE_API_URL points at an absolute origin (prod), we prepend it.
export function buildProposalUrl(pathOrRelative: string): string {
  const base = (import.meta.env.VITE_API_URL as string) || "/api";
  if (/^https?:\/\//i.test(base)) {
    // Strip trailing "/api" from an absolute base since the returned path
    // already starts with "/api/...".
    const origin = base.replace(/\/api\/?$/, "");
    return `${origin}${pathOrRelative}`;
  }
  // Same-origin base ("/api" or "") — return the path as-is.
  return pathOrRelative;
}
