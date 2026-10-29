import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Landmark, IndianRupee, Wrench, ArrowLeft, Calculator, Download, Loader2, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  buildProposalUrl,
  computeQuote,
  getHybridBatteryCatalog,
  listPublicBrands,
  type CatalogSnapshot,
  type PublicBrand,
  type PublicQuoteRequest,
  type PublicQuoteResponse,
} from "@/lib/solar-calculator.service";

// Central-list of Indian states — the backend's subsidy calculator resolves
// central + state subsidy by state name; this list matches what admin/mobile
// display so the customer sees the same options.
const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal",
];

type Category = "Residential" | "Commercial";
type InverterKind = "Ongrid" | "Hybrid";

export default function SubsidyCalculator() {
  const { toast } = useToast();

  // Form inputs
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [category, setCategory] = useState<Category>("Residential");
  const [inverterType, setInverterType] = useState<InverterKind>("Ongrid");
  const [brandId, setBrandId] = useState<string>("");
  const [plantSizeInput, setPlantSizeInput] = useState<string>("");
  // Apartment (Group Metering): a whole society on one meter. No state
  // scheme applies, and the system is far bigger than a single home's.
  const [groupMetering, setGroupMetering] = useState(false);
  const [loanType, setLoanType] = useState<"govt_loan" | "private_loan">("govt_loan");
  const [monthlyBill, setMonthlyBill] = useState<string>("");
  const [state, setState] = useState("");
  const [tenure, setTenure] = useState("60");

  // Hybrid-only. Brand → IP variant → specific model — all free-text now
  // because admin can add/rename them via Settings → Hybrid & Battery Pricing.
  const [hybridBrandId, setHybridBrandId] = useState<number | null>(null);
  const [hybridIpVariant, setHybridIpVariant] = useState<string>("");
  const [hybridModel, setHybridModel] = useState<string>("");

  // Battery config (used with Hybrid + Offgrid). Lead acid → qty × AH.
  // Lithium → model + pack qty. 'none' means no battery, cost stays zero.
  const [batteryType, setBatteryType] = useState<"none" | "leadAcid" | "lithium">("none");
  const [batteryQty, setBatteryQty] = useState<string>("");
  const [batteryAh, setBatteryAh] = useState<string>("150");
  const [lithiumModel, setLithiumModel] = useState<string>("");
  const [lithiumQty, setLithiumQty] = useState<string>("1");
  // Independent battery brand — defaults to Hybrid Brand but user can
  // switch to a different one (e.g. EastMan hybrid + Livguard battery).
  const [batteryBrandId, setBatteryBrandId] = useState<number | null>(null);
  const [batteryCatalog, setBatteryCatalog] = useState<CatalogSnapshot | null>(null);

  // Dynamic catalog. Two fetches: full snapshot lists brands; brand-scoped
  // snapshot lists variants + battery types for the currently-picked brand.
  const [allBrands, setAllBrands] = useState<CatalogSnapshot["brands"]>([]);
  const [catalog, setCatalog] = useState<CatalogSnapshot | null>(null);
  useEffect(() => {
    let cancelled = false;
    getHybridBatteryCatalog()
      .then((snap) => {
        if (cancelled) return;
        setAllBrands(snap.brands);
        if (snap.brands.length && hybridBrandId === null) {
          setHybridBrandId(snap.brands[0].id);
        }
      })
      .catch(() => { /* toast handled downstream */ });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!hybridBrandId) return;
    let cancelled = false;
    getHybridBatteryCatalog(hybridBrandId)
      .then((snap) => {
        if (cancelled) return;
        setCatalog(snap);
        if (snap.variants.length && !snap.variants.find((v) => v.name === hybridIpVariant)) {
          setHybridIpVariant(snap.variants[0].name);
        }
      })
      .catch(() => { /* silent */ });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hybridBrandId]);

  // Battery brand defaults to Hybrid Brand — stays in sync until the user
  // explicitly picks a different one.
  useEffect(() => {
    if (hybridBrandId && batteryBrandId === null) setBatteryBrandId(hybridBrandId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hybridBrandId]);

  // Fetch the battery-scoped catalog when the picked battery brand changes.
  useEffect(() => {
    if (!batteryBrandId) return;
    let cancelled = false;
    getHybridBatteryCatalog(batteryBrandId)
      .then((snap) => {
        if (!cancelled) setBatteryCatalog(snap);
      })
      .catch(() => { /* silent */ });
    return () => { cancelled = true; };
  }, [batteryBrandId]);

  const currentVariantModels = useMemo(
    () => catalog?.variants.find((v) => v.name === hybridIpVariant)?.models ?? [],
    [catalog, hybridIpVariant],
  );
  const leadAcidModels = useMemo(
    () => batteryCatalog?.battery_types.find((t) => t.kind === "leadAcid")?.models ?? [],
    [catalog],
  );
  const lithiumModelList = useMemo(
    () => batteryCatalog?.battery_types.find((t) => t.kind === "lithium")?.models ?? [],
    [batteryCatalog],
  );

  // Server data + result
  const [brands, setBrands] = useState<PublicBrand[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [result, setResult] = useState<PublicQuoteResponse | null>(null);
  const [calculating, setCalculating] = useState(false);

  // Fetch brands whenever category/inverter changes — a brand is scoped to
  // both (Residential/Commercial) and (Ongrid/Hybrid) on the backend.
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setBrandsLoading(true);
      try {
        const rows = await listPublicBrands({
          category,
          inverter_type: inverterType,
        });
        if (!cancelled) {
          setBrands(rows);
          // Clear brand selection if the previously chosen one no longer matches.
          if (brandId && !rows.find((r) => String(r.id) === brandId)) setBrandId("");
        }
      } catch (e: any) {
        if (!cancelled) {
          setBrands([]);
          toast({
            title: "Couldn't load brands",
            description: e?.message || "Try again in a moment.",
            variant: "destructive",
          });
        }
      } finally {
        if (!cancelled) setBrandsLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, inverterType]);

  const plantSize = plantSizeInput ? parseFloat(plantSizeInput) : 0;

  const validate = (): boolean => {
    if (!customerName.trim()) {
      toast({ title: "Name required", description: "Please enter the customer name.", variant: "destructive" });
      return false;
    }
    if (!customerMobile || customerMobile.length < 10) {
      toast({ title: "Mobile required", description: "Enter a valid 10-digit mobile number.", variant: "destructive" });
      return false;
    }
    if (!plantSize || plantSize <= 0) {
      toast({ title: "Plant size required", description: "Please enter plant size in kW.", variant: "destructive" });
      return false;
    }
    if (category === "Residential" && groupMetering && (plantSize < 1 || plantSize > 500)) {
      toast({ title: "Invalid size", description: "Group metering plant size should be 1-500 kW.", variant: "destructive" });
      return false;
    }
    if (category === "Residential" && !groupMetering && (plantSize < 1 || plantSize > 10)) {
      toast({ title: "Invalid size", description: "Residential plant size should be 1-10 kW.", variant: "destructive" });
      return false;
    }
    if (category === "Commercial" && (plantSize < 5 || plantSize > 500)) {
      toast({ title: "Invalid size", description: "Commercial plant size should be 5-500 kW.", variant: "destructive" });
      return false;
    }
    if (category === "Residential" && !groupMetering && !state) {
      toast({ title: "State required", description: "Please select a state for subsidy calculation.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleCalculate = async () => {
    if (!validate()) return;
    // Hybrid inverter needs a specific model selected — the backend rejects
    // "Hybrid" with no model. Catch it here so the user sees the field they
    // missed rather than a generic API error toast.
    if (inverterType === "Hybrid" && !hybridModel) {
      toast({
        title: "Hybrid model required",
        description: "Please choose a hybrid inverter model.",
        variant: "destructive",
      });
      return;
    }
    if (inverterType === "Hybrid" && batteryType === "leadAcid") {
      if (!batteryQty || Number(batteryQty) <= 0) {
        toast({ title: "Battery qty required", description: "Enter the number of lead-acid batteries.", variant: "destructive" });
        return;
      }
    }
    if (inverterType === "Hybrid" && batteryType === "lithium" && !lithiumModel) {
      toast({ title: "Lithium model required", description: "Please choose a lithium battery model.", variant: "destructive" });
      return;
    }

    setCalculating(true);
    setResult(null);
    try {
      const payload: PublicQuoteRequest = {
        customer_name: customerName.trim(),
        mobile_number: customerMobile,
        system_capacity: plantSize,
        brand_id: brandId ? Number(brandId) : undefined,
        category,
        inverter_type: inverterType,
        state: groupMetering ? "" : state || "India",
        group_metering: groupMetering,
        address: customerAddress || undefined,
        monthly_bill: monthlyBill ? Number(monthlyBill) : undefined,
        loan_type: loanType,
        emi_tenure_months: Number(tenure),
      };
      if (inverterType === "Hybrid") {
        payload.hybrid_ip_variant = hybridIpVariant;
        if (hybridModel) payload.hybrid_model = hybridModel;
        if (hybridBrandId) payload.hybrid_brand_id = hybridBrandId;
        if (batteryBrandId) payload.battery_brand_id = batteryBrandId;
        if (batteryType !== "none") {
          payload.battery_type = batteryType;
          if (batteryType === "leadAcid") {
            payload.battery_qty = Number(batteryQty) || 0;
            payload.battery_ah = (Number(batteryAh) || 150) as PublicQuoteRequest["battery_ah"];
          } else if (batteryType === "lithium" && lithiumModel) {
            payload.lithium_model = lithiumModel;
            payload.lithium_qty = Math.max(1, Number(lithiumQty) || 1);
          }
        }
      }
      const quote = await computeQuote(payload);
      setResult(quote);
      // Scroll into view on mobile so the result panel is visible after
      // computation (desktop shows both columns side-by-side).
      setTimeout(() => {
        document
          .getElementById("solar-result")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (e: any) {
      toast({
        title: "Calculation failed",
        description: e?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setCalculating(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!result) return;
    const url = buildProposalUrl(result.proposal_url);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleWhatsAppShare = () => {
    if (!result || !customerMobile) return;
    const r = result.result;
    const msg = [
      `Hi ${customerName || "there"},`,
      ``,
      `Your solar quote from KwikM:`,
      `• System: ${r.system_capacity} kW ${r.inverter_type} (${r.brand_name})`,
      `• Total cost: ₹${r.total_system_cost.toLocaleString("en-IN")}`,
      `• Subsidy: ₹${r.subsidy_amount.toLocaleString("en-IN")}`,
      `• Net investment: ₹${r.net_cost.toLocaleString("en-IN")}`,
      `• Monthly savings: ₹${r.monthly_savings.toLocaleString("en-IN")}`,
      `• Payback: ${r.payback_period_years} years`,
      ``,
      `Download the full proposal:`,
      buildProposalUrl(result.proposal_url),
    ].join("\n");
    const url = `https://wa.me/91${customerMobile}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const r = result?.result;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="pt-24 pb-24 container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" className="gap-2 text-slate-600 hover:text-slate-900 -ml-2" data-testid="button-back-home">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2" data-testid="text-calculator-title">
              Solar Calculator
            </h1>
            <p className="text-slate-500 text-base">
              Live quote from the KwikM engine — the same numbers our field team uses.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* ─── Form ────────────────────────────────────────────── */}
            <div className="space-y-6">
              <Card className="border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500" />
                <CardContent className="p-6 md:p-8 space-y-6">
                  <Tabs value={category} onValueChange={(v) => { setCategory(v as Category); setResult(null); }} className="w-full">
                    <TabsList className="grid grid-cols-2 w-full p-1 bg-slate-100 rounded-xl h-12">
                      <TabsTrigger value="Residential" className="rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white font-bold text-sm" data-testid="tab-residential">
                        Residential
                      </TabsTrigger>
                      <TabsTrigger value="Commercial" className="rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white font-bold text-sm" data-testid="tab-commercial">
                        Commercial
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  {category === "Residential" && (
                    <div className="text-center py-2 px-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl">
                      <p className="text-white text-sm font-semibold">
                        PM Surya Ghar Muft Bijli Yojana — up to ₹78,000 central subsidy
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <span className="text-green-500">●</span> Customer Name
                      </Label>
                      <Input
                        placeholder="Enter name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="h-12 rounded-xl border-slate-200"
                        data-testid="input-customer-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mobile No.</Label>
                      <Input
                        placeholder="10-digit number"
                        value={customerMobile}
                        onChange={(e) => setCustomerMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="h-12 rounded-xl border-slate-200"
                        maxLength={10}
                        data-testid="input-customer-mobile"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <span className="text-green-500">●</span> Solar Brand
                    </Label>
                    <Select value={brandId} onValueChange={setBrandId} disabled={brandsLoading || brands.length === 0}>
                      <SelectTrigger className="h-12 rounded-xl border-slate-200" data-testid="select-brand">
                        <SelectValue placeholder={
                          brandsLoading
                            ? "Loading brands…"
                            : brands.length === 0
                              ? "No brands available"
                              : "Auto-pick cheapest (or choose)"
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((b) => (
                          <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-[11px] text-slate-400">
                      Leave blank and we'll auto-pick the cheapest matching brand.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <span className="text-green-500">●</span> Plant Size (kW)
                    </Label>
                    <Input
                      type="number"
                      placeholder="e.g. 3"
                      value={plantSizeInput}
                      onChange={(e) => setPlantSizeInput(e.target.value)}
                      className="h-12 rounded-xl border-slate-200"
                      min={category === "Residential" ? 1 : 5}
                      max={category === "Residential" ? 10 : 500}
                      step="0.5"
                      data-testid="input-plant-size"
                    />
                    <p className="text-[11px] text-slate-400">
                      {category === "Residential"
                        ? groupMetering
                          ? "1-500 kW for group metering"
                          : "1-10 kW for residential"
                        : "5-500 kW for commercial"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <span className="text-green-500">●</span> Inverter Type
                      </Label>
                      <Select value={inverterType} onValueChange={(v) => setInverterType(v as InverterKind)}>
                        <SelectTrigger className="h-12 rounded-xl border-slate-200" data-testid="select-inverter-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ongrid">Ongrid</SelectItem>
                          <SelectItem value="Hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loan Type</Label>
                      <Select value={loanType} onValueChange={(v) => setLoanType(v as any)}>
                        <SelectTrigger className="h-12 rounded-xl border-slate-200" data-testid="select-loan-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="govt_loan">Govt. loan (8%)</SelectItem>
                          <SelectItem value="private_loan">NBFC loan (16%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* ── Hybrid inverter block ────────────────────────── */}
                  {inverterType === "Hybrid" && (
                    <div className="p-4 rounded-xl border border-purple-100 bg-purple-50/60 space-y-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-purple-600 uppercase tracking-wider">Hybrid Brand</Label>
                        <Select
                          value={hybridBrandId ? String(hybridBrandId) : ""}
                          onValueChange={(v) => setHybridBrandId(v ? Number(v) : null)}
                        >
                          <SelectTrigger className="h-11 rounded-lg border-purple-200 bg-white" data-testid="select-hybrid-brand">
                            <SelectValue placeholder={allBrands.length ? "Pick brand" : "No hybrid brands configured"} />
                          </SelectTrigger>
                          <SelectContent>
                            {allBrands.map((b) => (
                              <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-purple-600 uppercase tracking-wider">Hybrid IP Variant</Label>
                        {catalog?.variants.length ? (
                          <div className="grid grid-cols-2 gap-2">
                            {catalog.variants.map((v) => (
                              <button
                                key={v.id}
                                type="button"
                                onClick={() => {
                                  setHybridIpVariant(v.name);
                                  // Clear model when switching variant since the model list may differ.
                                  if (hybridModel && !v.models.find((m) => m.name === hybridModel)) {
                                    setHybridModel("");
                                  }
                                }}
                                className={`h-11 rounded-lg text-sm font-semibold transition-all ${
                                  hybridIpVariant === v.name
                                    ? "bg-purple-600 text-white shadow"
                                    : "bg-white border border-purple-200 text-slate-700 hover:border-purple-400"
                                }`}
                                data-testid={`btn-ip-${v.name}`}
                              >
                                Hybrid {v.name}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 italic">No Hybrid variants configured yet.</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-purple-600 uppercase tracking-wider">Hybrid Inverter Model</Label>
                        <Select value={hybridModel} onValueChange={(v) => setHybridModel(v)}>
                          <SelectTrigger className="h-11 rounded-lg border-purple-200 bg-white" data-testid="select-hybrid-model">
                            <SelectValue placeholder={currentVariantModels.length ? "Choose model" : "No models available"} />
                          </SelectTrigger>
                          <SelectContent>
                            {currentVariantModels.map((m) => (
                              <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* ── Battery block (Hybrid only) ──────────────────── */}
                  {inverterType === "Hybrid" && (
                    <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/60 space-y-4">
                      <Label className="text-xs font-bold text-amber-700 uppercase tracking-wider block">Battery (for Hybrid)</Label>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-amber-600 uppercase tracking-wider">Battery Brand</Label>
                        <Select
                          value={batteryBrandId ? String(batteryBrandId) : ""}
                          onValueChange={(v) => setBatteryBrandId(v ? Number(v) : null)}
                        >
                          <SelectTrigger className="h-11 rounded-lg border-amber-200 bg-white" data-testid="select-battery-brand">
                            <SelectValue placeholder={allBrands.length ? "Pick battery brand" : "No hybrid brands configured"} />
                          </SelectTrigger>
                          <SelectContent>
                            {allBrands.map((b) => (
                              <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {(["none", "leadAcid", "lithium"] as const).map((bt) => (
                          <button
                            key={bt}
                            type="button"
                            onClick={() => setBatteryType(bt)}
                            className={`h-11 rounded-lg text-sm font-semibold transition-all ${
                              batteryType === bt
                                ? "bg-amber-500 text-white shadow"
                                : "bg-white border border-amber-200 text-slate-700 hover:border-amber-400"
                            }`}
                            data-testid={`btn-battery-${bt}`}
                          >
                            {bt === "none" ? "None" : bt === "leadAcid" ? "Lead Acid" : "Lithium"}
                          </button>
                        ))}
                      </div>

                      {batteryType === "leadAcid" && (
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="space-y-2">
                            <Label className="text-[11px] font-bold text-slate-500 uppercase">Quantity</Label>
                            <Input
                              type="number"
                              min={1}
                              placeholder="e.g. 4"
                              value={batteryQty}
                              onChange={(e) => setBatteryQty(e.target.value)}
                              className="h-11 rounded-lg border-slate-200 bg-white"
                              data-testid="input-battery-qty"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[11px] font-bold text-slate-500 uppercase">AH Rating</Label>
                            <Select value={batteryAh} onValueChange={setBatteryAh}>
                              <SelectTrigger className="h-11 rounded-lg border-slate-200 bg-white" data-testid="select-battery-ah">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {leadAcidModels.map((m) => {
                                  const numeric = parseInt(m.name);
                                  const val = Number.isFinite(numeric) ? String(numeric) : m.name;
                                  return <SelectItem key={m.id} value={val}>{m.name}</SelectItem>;
                                })}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}

                      {batteryType === "lithium" && (
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="space-y-2">
                            <Label className="text-[11px] font-bold text-slate-500 uppercase">Model</Label>
                            <Select value={lithiumModel} onValueChange={(v) => setLithiumModel(v)}>
                              <SelectTrigger className="h-11 rounded-lg border-slate-200 bg-white" data-testid="select-lithium-model">
                                <SelectValue placeholder={lithiumModelList.length ? "Pick model" : "No packs available"} />
                              </SelectTrigger>
                              <SelectContent>
                                {lithiumModelList.map((m) => (
                                  <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[11px] font-bold text-slate-500 uppercase">Packs</Label>
                            <Input
                              type="number"
                              min={1}
                              value={lithiumQty}
                              onChange={(e) => setLithiumQty(e.target.value)}
                              className="h-11 rounded-lg border-slate-200 bg-white"
                              data-testid="input-lithium-qty"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <span className="text-green-500">●</span> Monthly Electricity Bill (₹)
                    </Label>
                    <Input
                      type="number"
                      placeholder="Avg. monthly bill"
                      value={monthlyBill}
                      onChange={(e) => setMonthlyBill(e.target.value)}
                      className="h-12 rounded-xl border-slate-200"
                      min={0}
                      data-testid="input-monthly-bill"
                    />
                  </div>

                  {category === "Residential" && (
                    <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={groupMetering}
                        onChange={(e) => setGroupMetering(e.target.checked)}
                        className="mt-1 h-4 w-4 accent-green-500"
                        data-testid="checkbox-group-metering"
                      />
                      <span className="text-sm text-slate-700">
                        <span className="font-bold">Apartment (Group Metering)</span>
                        <span className="block text-xs text-slate-500 mt-0.5">
                          ₹18,000 per kW on the first 500 kW. Central and state subsidies do not apply.
                        </span>
                      </span>
                    </label>
                  )}

                  {category === "Residential" && (
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <span className="text-green-500">●</span> State
                      </Label>
                      <Select value={state} onValueChange={setState} disabled={groupMetering}>
                        <SelectTrigger className="h-12 rounded-xl border-slate-200 disabled:opacity-60 disabled:cursor-not-allowed" data-testid="select-state">
                          <SelectValue placeholder={groupMetering ? "Not applicable for group metering" : "Select your state"} />
                        </SelectTrigger>
                        <SelectContent>
                          {STATES.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Address (Optional)</Label>
                    <Input
                      placeholder="Full address"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="h-12 rounded-xl border-slate-200"
                      data-testid="input-customer-address"
                    />
                  </div>

                  <Button
                    onClick={handleCalculate}
                    disabled={calculating}
                    className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base shadow-lg disabled:opacity-60"
                    data-testid="button-calculate-subsidy"
                  >
                    {calculating ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Calculating…</>
                    ) : (
                      <><Calculator className="mr-2 h-5 w-5" /> Calculate</>
                    )}
                  </Button>

                  <Link href="/customized-calculator">
                    <Button variant="outline" className="w-full mt-2 h-10 rounded-xl border-secondary text-secondary hover:bg-secondary/10 font-bold text-xs gap-2" data-testid="link-customized-calculator">
                      <Wrench className="h-4 w-4" />
                      Advanced Customized Calculator
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* ─── Result ──────────────────────────────────────────── */}
            <div id="solar-result" className="space-y-6">
              {r ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Hero — customer strip + net cost */}
                  <Card className="border-none shadow-2xl bg-white rounded-3xl overflow-hidden" data-testid="card-result">
                    <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500" />
                    <CardContent className="p-6 md:p-8 space-y-5">
                      <div className="text-center pb-4 border-b border-slate-100">
                        <h3 className="text-xl font-black text-slate-800">
                          Solar Estimate for {customerName}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          {r.system_capacity} kW {r.inverter_type} · {r.brand_name}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 bg-slate-50 rounded-xl text-center">
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">System Cost</p>
                          <p className="text-lg font-black text-slate-900" data-testid="text-system-cost">
                            ₹{r.total_system_cost.toLocaleString("en-IN")}
                          </p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-xl text-center">
                          <p className="text-[10px] font-bold text-green-600/70 uppercase mb-1">Total Subsidy</p>
                          <p className="text-lg font-black text-green-600" data-testid="text-total-subsidy">
                            - ₹{r.subsidy_amount.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl text-center">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Net Investment</p>
                        <p className="text-3xl font-black text-white flex items-center justify-center gap-1" data-testid="text-net-cost">
                          <IndianRupee className="h-7 w-7" />
                          {r.net_cost.toLocaleString("en-IN")}
                        </p>
                      </div>

                      {r.category === "Residential" && (r as any).group_metering && (
                        <div className="p-3 bg-green-50 rounded-xl text-center">
                          <p className="text-[10px] font-bold text-green-600 uppercase mb-1">
                            Apartment subsidy (Group Metering)
                          </p>
                          <p className="text-base font-black text-slate-900">
                            ₹{r.subsidy_amount.toLocaleString("en-IN")}
                          </p>
                        </div>
                      )}

                      {r.category === "Residential" && !(r as any).group_metering && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-blue-50 rounded-xl text-center">
                            <p className="text-[10px] font-bold text-blue-500 uppercase mb-1">Central</p>
                            <p className="text-base font-black text-slate-900">
                              ₹{r.central_subsidy.toLocaleString("en-IN")}
                            </p>
                          </div>
                          <div className="p-3 bg-orange-50 rounded-xl text-center">
                            <p className="text-[10px] font-bold text-orange-500 uppercase mb-1">State</p>
                            <p className="text-base font-black text-slate-900">
                              ₹{r.state_subsidy.toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-slate-50 rounded-xl text-center">
                          <p className="text-3xl font-black text-primary">{r.payback_period_years}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Yrs payback</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl text-center">
                          <p className="text-3xl font-black text-primary">{r.units_per_month.toLocaleString("en-IN")}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Units/mo</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl text-center">
                          <p className="text-3xl font-black text-primary">25+</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Yrs life</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Annual savings */}
                  <Card className="border-none shadow-xl bg-slate-900 text-white rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2.5 rounded-xl bg-white/10">
                        <IndianRupee className="h-5 w-5 text-green-400" />
                      </div>
                      <h3 className="text-lg font-bold">Annual Savings</h3>
                    </div>
                    <p className="text-4xl font-black text-green-400 mb-1" data-testid="text-annual-savings">
                      ₹{r.annual_savings.toLocaleString("en-IN")}
                    </p>
                    <p className="text-white/50 text-xs">
                      Monthly: ₹{r.monthly_savings.toLocaleString("en-IN")}
                    </p>
                  </Card>

                  {/* EMI options — pulled from server so all four tenures shown */}
                  <Card className="border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
                    <CardHeader className="p-6 pb-0">
                      <div className="flex items-center gap-3">
                        <Landmark className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg font-black">Finance Options (EMI)</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-3">
                      {r.emi_options.map((opt) => (
                        <div
                          key={opt.tenure_months}
                          className={`flex justify-between items-center p-3 rounded-xl border transition-all ${
                            opt.tenure_months === Number(tenure)
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-slate-100"
                          }`}
                          onClick={() => setTenure(String(opt.tenure_months))}
                          role="button"
                        >
                          <span className="text-sm font-bold">{opt.tenure_months} months</span>
                          <div className="text-right">
                            <div className={`font-black ${opt.tenure_months === Number(tenure) ? "text-primary" : "text-slate-700"}`}>
                              ₹{opt.monthly_emi.toLocaleString("en-IN")}/mo
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Effective ₹{Math.max(0, opt.effective_emi).toLocaleString("en-IN")}/mo after savings
                            </div>
                          </div>
                        </div>
                      ))}
                      <p className="text-[10px] text-slate-400 pt-1">
                        Rate: {loanType === "govt_loan" ? "8%" : "16%"} p.a.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Environmental impact + actions */}
                  <Card className="border-none shadow-2xl rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #e8f5e9 0%, #e0f7fa 50%, #f0fdf4 100%)' }}>
                    <CardHeader className="p-6 pb-3">
                      <CardTitle className="text-xl font-black text-center text-slate-800">Environmental Impact</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="text-center p-4 bg-blue-50 rounded-2xl border border-blue-100">
                          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">CO2 Cut</p>
                          <p className="text-xl md:text-2xl font-black text-slate-900">{r.co2_mitigated_kg_per_year.toLocaleString("en-IN")}</p>
                          <p className="text-[10px] text-slate-500">Kg/year</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-2xl border border-green-100">
                          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Trees</p>
                          <p className="text-xl md:text-2xl font-black text-slate-900">{r.trees_planted_equivalent.toLocaleString("en-IN")}</p>
                          <p className="text-[10px] text-slate-500">Equivalent</p>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-2xl border border-orange-100">
                          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Distance</p>
                          <p className="text-xl md:text-2xl font-black text-slate-900">{r.distance_km_equivalent.toLocaleString("en-IN")}</p>
                          <p className="text-[10px] text-slate-500">Km</p>
                        </div>
                      </div>

                      <div className="p-5 bg-slate-900 rounded-2xl text-white mb-4">
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                          <div className="text-center sm:text-left">
                            <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mb-1">Lifetime Savings (25 yrs)</p>
                            <p className="text-2xl font-black text-green-400">₹{r.lifetime_savings_25_years.toLocaleString("en-IN")}</p>
                          </div>
                          <div className="w-px h-10 bg-white/20 hidden sm:block" />
                          <div className="text-center sm:text-right">
                            <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mb-1">ROI</p>
                            <p className="text-2xl font-black text-primary">{r.roi_percentage}% <span className="text-sm">p.a.</span></p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Button
                          onClick={handleDownloadPdf}
                          className="w-full h-12 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 text-white font-bold text-base shadow-lg"
                          data-testid="button-download-proposal"
                        >
                          <Download className="mr-2 h-5 w-5" />
                          Download Proposal
                        </Button>
                        <Button
                          onClick={handleWhatsAppShare}
                          disabled={!customerMobile}
                          className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg disabled:opacity-60"
                          data-testid="button-whatsapp-share"
                        >
                          <MessageCircle className="mr-2 h-5 w-5" />
                          Send on WhatsApp
                        </Button>
                      </div>

                      <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="text-[10px] font-bold text-slate-600 mb-1">Disclaimer:</p>
                        <ol className="text-[10px] text-slate-400 space-y-1 list-decimal list-inside">
                          <li>Numbers assume 1% annual panel degradation and 3% electricity-tariff inflation over 25 years.</li>
                          <li>Actual price/EMI may vary with location, panel type, inverter type, and after-sales support.</li>
                        </ol>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <Card className="border-none shadow-lg bg-white rounded-3xl overflow-hidden">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="w-20 h-20 mx-auto bg-slate-100 rounded-full flex items-center justify-center">
                      <Calculator className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-400">Enter details & calculate</h3>
                    <p className="text-sm text-slate-400">
                      Fill in the form and click "Calculate" to see your live solar quote.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
