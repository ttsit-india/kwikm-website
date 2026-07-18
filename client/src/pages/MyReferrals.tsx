import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Share2, Copy, Users, TrendingUp, Wallet, 
  CheckCircle, ExternalLink, Gift, Award,
  Phone, Calendar, IndianRupee
} from "lucide-react";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface ReferralData {
  referral_code: string;
  referral_link: string;
  user: {
    id: number;
    name: string;
    phone: string;
    role: string;
  };
}

interface ReferralStats {
  totalEarnings: number;
  totalReferrals: number;
  pendingEarnings: number;
}

interface Referral {
  id: number;
  name: string;
  phone: string;
  role: string;
  created_at: string;
}

export default function MyReferrals() {
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchReferralData();
    fetchStats();
    fetchReferrals();
  }, []);

  const fetchReferralData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await apiClient.get<{ data: ReferralData }>("/users/my-referral-link", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReferralData(response.data);
    } catch (error) {
      console.error("Error fetching referral data:", error);
      toast({
        title: "Error",
        description: "Failed to load referral link. Please login first.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await apiClient.get<{ data?: ReferralStats } | ReferralStats>("/referrals/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Handle both response formats: { data: {...} } or direct object
      const statsData: ReferralStats | null = 'data' in response && response.data ? response.data : (response as ReferralStats);
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchReferrals = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await apiClient.get<{ data?: Referral[] } | Referral[]>("/referrals/my-referrals", {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Handle both response formats: { data: [...] } or direct array
      const referralsData = Array.isArray(response) ? response : (response.data || []);
      setReferrals(referralsData);
    } catch (error) {
      console.error("Error fetching referrals:", error);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard"
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive"
      });
    }
  };

  const shareViaWhatsApp = () => {
    if (!referralData) return;
    const message = `🌞 Join KWIK M as Solar Mitra!\n\n✅ Govt. Certified\n✅ Zero Investment\n✅ Earn ₹50,000+/month\n\nRegister now: ${referralData.referral_link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!referralData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <Award className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login as Solar Mitra to access your referral dashboard</p>
          <p className="text-sm text-gray-500 mb-4">
            Don't have an account? Register as Solar Mitra first, then login to access your referral link.
          </p>
          <a href="/join" className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition">
            Go to Registration / Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-black text-gray-800 mb-2">
            My <span className="text-orange-500">Referral</span> Dashboard
          </h1>
          <p className="text-gray-600">Share your link and earn rewards!</p>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl"
            >
              <div className="flex items-center justify-between mb-2">
                <Wallet className="w-8 h-8" />
                <IndianRupee className="w-6 h-6 opacity-50" />
              </div>
              <p className="text-sm opacity-90 mb-1">Total Earnings</p>
              <p className="text-3xl font-black">₹{stats.totalEarnings.toLocaleString()}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl"
            >
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8" />
                <TrendingUp className="w-6 h-6 opacity-50" />
              </div>
              <p className="text-sm opacity-90 mb-1">Total Referrals</p>
              <p className="text-3xl font-black">{stats.totalReferrals}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-xl"
            >
              <div className="flex items-center justify-between mb-2">
                <Gift className="w-8 h-8" />
                <IndianRupee className="w-6 h-6 opacity-50" />
              </div>
              <p className="text-sm opacity-90 mb-1">Pending Earnings</p>
              <p className="text-3xl font-black">₹{stats.pendingEarnings.toLocaleString()}</p>
            </motion.div>
          </div>
        )}

        {/* Referral Link Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border-2 border-orange-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <Share2 className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Your Referral Link</h2>
              <p className="text-sm text-gray-600">Share this link to invite new Solar Mitras</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-xs text-gray-500 font-semibold">REFERRAL CODE</p>
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded font-bold">
                {referralData.referral_code}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={referralData.referral_link}
                readOnly
                className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 font-mono"
              />
              <button
                onClick={() => copyToClipboard(referralData.referral_link)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 transition font-semibold"
              >
                {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={shareViaWhatsApp}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Share on WhatsApp
            </button>
          </div>
        </motion.div>

        {/* My Referrals List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">My Referrals</h2>
              <p className="text-sm text-gray-600">People who joined through your link</p>
            </div>
          </div>

          {referrals.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-semibold mb-2">No referrals yet</p>
              <p className="text-gray-400 text-sm">Start sharing your link to see your referrals here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {referrals.map((referral, index) => (
                <motion.div
                  key={referral.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-orange-300 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
                      {referral.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{referral.name}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {referral.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(referral.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {referral.role}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
