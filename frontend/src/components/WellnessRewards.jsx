import React, { useState, useEffect } from "react";
import { Trophy, Calendar, Sparkles, CheckCircle } from "lucide-react";
const REWARDS_STORE = [
    {
        id: "r-lab20",
        title: "20% Discount on Lab Tests",
        description: "Applicable on any diagnostic test, lipid profile, CBC, or blood screening at EliteCare partner clinics.",
        cost: 300,
        promoCode: "ELITELAB20",
        icon: "🔬",
        category: "lab",
    },
    {
        id: "r-med15",
        title: "15% Off Medicine Orders",
        description: "Get 15% discount on all prescription refills upload on the medicine scanner.",
        cost: 250,
        promoCode: "ELITEMED15",
        icon: "💊",
        category: "medicine",
    },
    {
        id: "r-consult-free",
        title: "Free Specialist Consultation",
        description: "Includes a 25-minute live HD Video Consultation with any Cardiologist, Neurologist, or Eye Specialist.",
        cost: 500,
        promoCode: "FREEEXPERT",
        icon: "👨‍⚕️",
        category: "consultation",
    },
    {
        id: "r-eye-free",
        title: "Free Eye Checkup Voucher",
        description: "Guarantees a comprehensive diagnostic refraction and pressure screening on your next Ophthalmic booking.",
        cost: 350,
        promoCode: "EYEVIEW100",
        icon: "👁️",
        category: "consultation",
    },
];
export default function WellnessRewards({ coins, streak, xp, level, onAddCoins, onDeductCoins, onAddXP, }) {
    const [redeemedCodes, setRedeemedCodes] = useState(() => {
        const saved = localStorage.getItem("elitecare_claimed_rewards");
        return saved ? JSON.parse(saved) : {};
    });
    const [lastCheckIn, setLastCheckIn] = useState(() => {
        return localStorage.getItem("elitecare_last_checkin") || "";
    });
    const [lastSpin, setLastSpin] = useState(() => {
        return localStorage.getItem("elitecare_last_spin") || "";
    });
    const [isSpinning, setIsSpinning] = useState(false);
    const [spinResult, setSpinResult] = useState(null);
    const [wheelState, setWheelState] = useState(0); // rotation angle
    const [showRedeemModal, setShowRedeemModal] = useState(null);
    const [errorText, setErrorText] = useState(null);
    // Active Daily Quests State
    const [checkedDaily, setCheckedDaily] = useState(() => {
        const today = new Date().toDateString();
        const saved = localStorage.getItem("elitecare_last_checkin") || "";
        return saved === today;
    });
    useEffect(() => {
        localStorage.setItem("elitecare_claimed_rewards", JSON.stringify(redeemedCodes));
    }, [redeemedCodes]);
    // Handle regular Daily Check-in claim
    const handleDailyCheckIn = () => {
        const today = new Date().toDateString();
        if (checkedDaily)
            return;
        onAddCoins(30);
        onAddXP(50);
        setLastCheckIn(today);
        localStorage.setItem("elitecare_last_checkin", today);
        setCheckedDaily(true);
        // Add toast or simulation alert
        alert("🎉 Daily Check-in Success! You earned 🪙 30 Wellness Coins and ⚡ 50 XP!");
    };
    // Redeem reward voucher
    const handleRedeemReward = (reward) => {
        if (redeemedCodes[reward.id]) {
            // Already redeemed
            setShowRedeemModal(reward);
            return;
        }
        const success = onDeductCoins(reward.cost);
        if (success) {
            const newCodes = { ...redeemedCodes, [reward.id]: reward.promoCode };
            setRedeemedCodes(newCodes);
            setShowRedeemModal(reward);
            setErrorText(null);
        }
        else {
            setErrorText(`Insufficient coins! You need ${reward.cost - coins} more Wellness Coins to unlock this prize.`);
            setTimeout(() => setErrorText(null), 4000);
        }
    };
    // Spin the Wellness Wheel Game!
    const handleSpinWheel = () => {
        if (isSpinning)
            return;
        const today = new Date().toDateString();
        if (lastSpin === today) {
            alert("⏱️ Wellness Wheel has already been spun today. Return tomorrow for another free prize!");
            return;
        }
        setIsSpinning(true);
        setSpinResult(null);
        // Prizes matching different sectors
        const prizes = [
            { text: "🪙 +15 Coins", value: 15, type: "coins" },
            { text: "🪙 +50 Coins", value: 50, type: "coins" },
            { text: "🔥 Double Streak Day!", value: 0, type: "streak" },
            { text: "⚡ +100 XP Bonus", value: 100, type: "xp" },
            { text: "🪙 +25 Coins", value: 25, type: "coins" },
            { text: "🩺 Free Consultation Voucher!", value: 0, type: "coupon" },
        ];
        // Pick a random sector (0 to 5)
        const randomSector = Math.floor(Math.random() * prizes.length);
        const sectorAngle = 360 / prizes.length;
        const spins = 5; // number of full spins
        const targetAngle = spins * 360 + (360 - (randomSector * sectorAngle + sectorAngle / 2));
        setWheelState(targetAngle);
        setTimeout(() => {
            setIsSpinning(false);
            setLastSpin(today);
            localStorage.setItem("elitecare_last_spin", today);
            const targetPrize = prizes[randomSector];
            setSpinResult(targetPrize.text);
            // Reward implementation
            if (targetPrize.type === "coins") {
                onAddCoins(targetPrize.value);
            }
            else if (targetPrize.type === "xp") {
                onAddXP(targetPrize.value);
            }
            else if (targetPrize.type === "coupon") {
                // Add custom voucher coupon directly to claims
                setRedeemedCodes((prev) => ({
                    ...prev,
                    "r-spin-coupon": "SPINWINNERFREE",
                }));
            }
        }, 3500); // match transitional timeout
    };
    return (<div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-300 text-left">
      
      {/* HEADER ROW */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-teal-800 to-emerald-700 p-8 rounded-3xl text-white shadow-md border border-emerald-600/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Trophy size={180}/>
        </div>
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-emerald-600 text-emerald-50 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border border-emerald-500/20">
            <Sparkles size={12}/>
            <span>Engage & Win Rewards</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">Wellness Rewards & Prizes Hub</h1>
          <p className="text-xs text-emerald-100 max-w-xl font-medium">
            Earn Wellness Coins by maintaining daily streaks, symptom trackers, and scheduling telemedicine trials. Redeem them instantly for exclusive therapeutic discounts!
          </p>
        </div>

        {/* STATS HUD BOARD */}
        <div className="flex gap-4 mt-6 md:mt-0 relative z-10 shrink-0">
          <div className="bg-white/10 backdrop-blur-md px-4 py-3.5 rounded-2xl border border-white/15 shadow-2xs text-center min-w-24">
            <span className="text-[9px] uppercase tracking-wider text-emerald-200 font-bold block">Wallet Balance</span>
            <div className="flex items-center justify-center gap-1 mt-1 font-black text-2xl text-amber-300">
              <span>🪙</span>
              <span className="font-mono">{coins}</span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-3.5 rounded-2xl border border-white/15 shadow-2xs text-center min-w-24">
            <span className="text-[9px] uppercase tracking-wider text-emerald-200 font-bold block">Health Streak</span>
            <div className="flex items-center justify-center gap-1 mt-1 font-black text-2xl text-orange-400">
              <span>🔥</span>
              <span className="font-mono">{streak}d</span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-3.5 rounded-2xl border border-white/15 shadow-2xs text-center min-w-24">
            <span className="text-[9px] uppercase tracking-wider text-emerald-200 font-bold block">Patient Level</span>
            <div className="flex flex-col items-center justify-center mt-1">
              <span className="font-black text-lg text-emerald-50 font-mono">Lvl {level}</span>
              <div className="w-16 bg-white/20 h-1 rounded-full mt-1 overflow-hidden">
                <div className="bg-amber-300 h-full" style={{ width: `${Math.round((xp / (level * 150)) * 100)}%` }}/>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ERROR / COIN WARNING ROW */}
      {errorText && (<div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-xs font-bold animate-in fade-in flex items-center justify-between shadow-2xs">
          <span>⚠️ {errorText}</span>
          <button onClick={() => setErrorText(null)} className="text-amber-500 font-black hover:text-amber-700">✕</button>
        </div>)}

      {/* TWO COLUMNS: QUESTS + SPIN THE WHEEL vs PRIZE STORE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN (QUESTS & INTERACTIVE WHEEL GAME) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* DAILY HEALTH QUESTS LIST */}
          <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Calendar size={16} className="text-emerald-600"/>
                <span>Daily Health Missions & Quests</span>
              </h3>
              <span className="text-[9px] bg-slate-50 text-slate-400 font-semibold px-2 py-0.5 rounded">Resets daily</span>
            </div>

            <div className="space-y-3">
              {/* Check-In Mission */}
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="space-y-0.5 text-left">
                  <span className="font-bold text-slate-800 text-xs block">Clinical Active Check-in</span>
                  <span className="text-[10px] text-gray-400 block">Claim daily copay check-in rewards</span>
                </div>
                <button onClick={handleDailyCheckIn} disabled={checkedDaily} className={`text-[10px] font-extrabold px-3.5 py-2 rounded-lg transition shrink-0 ${checkedDaily
            ? "bg-slate-100 text-slate-400 cursor-not-allowed flex items-center gap-1"
            : "bg-[#16A34A] hover:bg-[#15803d] text-white shadow-xs cursor-pointer"}`}>
                  {checkedDaily ? (<>
                      <CheckCircle size={11} className="text-green-600"/>
                      <span>Claimed</span>
                    </>) : ("Claim +30 🪙")}
                </button>
              </div>

              {/* Vital logging */}
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="space-y-0.5 text-left">
                  <span className="font-bold text-slate-800 text-xs block">Log symptoms or vitals</span>
                  <span className="text-[10px] text-gray-400 block">Enter current pain points in symptom page</span>
                </div>
                <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-lg shrink-0">
                  +20 Coins
                </span>
              </div>

              {/* Consultation Challenge */}
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="space-y-0.5 text-left">
                  <span className="font-bold text-slate-800 text-xs block">Elite Consult Challenge</span>
                  <span className="text-[10px] text-gray-400 block">Book or launch a consulting chat room</span>
                </div>
                <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-lg shrink-0">
                  +50 Coins
                </span>
              </div>
            </div>
          </div>

          {/* SPIN THE WELLNESS WHEEL GAME! */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 flex flex-col items-center space-y-6 relative overflow-hidden">
            <div className="absolute -top-12 -left-12 size-24 rounded-full bg-emerald-500/10 blur-xl"></div>
            <div className="absolute -bottom-12 -right-12 size-24 rounded-full bg-cyan-500/10 blur-xl"></div>

            <div className="text-center space-y-1">
              <h3 className="font-black text-base text-yellow-400 tracking-tight flex items-center justify-center gap-1.5">
                🎡 Spin the Wellness Wheel!
              </h3>
              <p className="text-[10px] text-slate-400 max-w-xs">
                Unlock bonus coins, multiplier health XP, or free doctor consultations once daily!
              </p>
            </div>

            {/* WHEEL DRAWING & NEEDLE */}
            <div className="relative size-56 flex items-center justify-center">
              {/* Red indicator needle pointer */}
              <div className="absolute -top-1 z-30 size-4 border-l-4 border-r-4 border-t-[12px] border-l-transparent border-r-transparent border-t-yellow-400 drop-shadow-md animate-pulse"></div>

              {/* Inner Circle Wheel */}
              <div className="w-full h-full rounded-full border-4 border-yellow-400 relative overflow-hidden transition-transform duration-3500 ease-out z-10" style={{
            transform: `rotate(${wheelState}deg)`,
            backgroundImage: "conic-gradient(#0E3A2F 0deg 60deg, #104C3E 60deg 120deg, #0E3A2F 120deg 180deg, #104C3E 180deg 240deg, #0E3A2F 240deg 300deg, #104C3E 300deg 360deg)",
        }}>
                {/* Visual partition segments */}
                <div className="absolute inset-0 flex items-center justify-center font-bold text-[9px] select-none text-emerald-50">
                  <div className="absolute font-black text-center" style={{ transform: "rotate(30deg) translateY(-68px)" }}>🪙 +15</div>
                  <div className="absolute font-black text-center" style={{ transform: "rotate(90deg) translateY(-68px)" }}>🪙 +50</div>
                  <div className="absolute font-black text-center" style={{ transform: "rotate(150deg) translateY(-68px)" }}>🔥 Multi</div>
                  <div className="absolute font-black text-center" style={{ transform: "rotate(210deg) translateY(-68px)" }}>⚡ +100XP</div>
                  <div className="absolute font-black text-center" style={{ transform: "rotate(270deg) translateY(-68px)" }}>🪙 +25</div>
                  <div className="absolute font-black text-center" style={{ transform: "rotate(330deg) translateY(-68px)" }}>🩺 Free</div>
                </div>
              </div>

              {/* Central Spin Button */}
              <button onClick={handleSpinWheel} disabled={isSpinning} className="absolute size-14 rounded-full bg-yellow-400 text-slate-900 border-4 border-slate-900 font-extrabold text-xs z-20 flex flex-col items-center justify-center shadow-lg hover:scale-105 active:scale-95 disabled:opacity-85 disabled:scale-100 transition cursor-pointer">
                <span className="text-[10px] leading-tight select-none">SPIN</span>
                <span className="text-[8px] opacity-75 leading-none font-black select-none">FREE</span>
              </button>
            </div>

            {/* RESULTS VIEW */}
            {spinResult ? (<div className="text-center font-bold text-xs bg-yellow-400/10 border border-yellow-400/20 text-yellow-300 py-2.5 px-6 rounded-full animate-bounce">
                🎉 Congratulations! You won: <strong className="text-yellow-400">{spinResult}</strong>
              </div>) : (<div className="text-[10px] text-slate-500">
                {lastSpin === new Date().toDateString() ? "🚫 Next spin unlock tomorrow" : "🎯 Spin is loaded. Click in the center!"}
              </div>)}
          </div>

        </div>

        {/* RIGHT COLUMN (REWARDS STORE DISCOUNTS LIST) */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="font-black text-lg text-slate-900 tracking-tight border-b border-slate-200 pb-2">
            🛍️ Redeem Medical Rewards & Coupons Store
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {REWARDS_STORE.map((p) => {
            const isClaimed = !!redeemedCodes[p.id];
            return (<div key={p.id} className={`bg-white border rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all text-left ${isClaimed
                    ? "border-emerald-300 bg-emerald-50/20 shadow-xs"
                    : "border-slate-150 hover:border-emerald-400 hover:shadow-md"}`}>
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="size-10 text-2xl bg-slate-50 flex items-center justify-center rounded-xl">
                        {p.icon}
                      </span>
                      {isClaimed ? (<span className="text-[8px] font-black text-emerald-800 bg-emerald-100 border border-emerald-250 px-2 py-0.5 rounded-full uppercase">
                          Claimed & Active
                        </span>) : (<span className="text-xs font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full flex items-center gap-0.5 border border-amber-200/50">
                          🪙 {p.cost}
                        </span>)}
                    </div>

                    <h4 className="font-extrabold text-slate-800 text-sm leading-snug">
                      {p.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    {isClaimed ? (<div className="w-full">
                        <span className="text-[9px] text-emerald-600 font-extrabold block">Your Coupon Code:</span>
                        <div className="flex justify-between items-center bg-white border border-dashed border-emerald-300 rounded px-2.5 py-1.5 mt-1">
                          <code className="text-xs font-mono font-black text-emerald-800">{p.promoCode}</code>
                          <button onClick={() => {
                        navigator.clipboard.writeText(p.promoCode);
                        alert("Voucher copied to clipboard!");
                    }} className="text-[9px] font-extrabold text-[#16A34A] underline hover:text-[#15803d]">
                            Copy Code
                          </button>
                        </div>
                      </div>) : (<button onClick={() => handleRedeemReward(p)} className={`w-full font-bold text-xs py-2 rounded-xl text-center cursor-pointer transition ${coins >= p.cost
                        ? "bg-slate-900 border border-slate-950 text-white hover:bg-slate-800"
                        : "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"}`}>
                        Claim for 🪙 {p.cost}
                      </button>)}
                  </div>
                </div>);
        })}
          </div>
        </div>

      </div>

      {/* DETAILED REWARD SHOW MODAL */}
      {showRedeemModal && (<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-slate-150 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="size-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto animate-bounce text-3xl">
              ✨
            </div>
            <div className="space-y-1.5">
              <h3 className="font-extrabold text-slate-850 text-base">Elite Reward Redeemed!</h3>
              <p className="text-xs text-gray-400">
                Your copay coins have been exchanged for an active promotion voucher code.
              </p>
            </div>
            
            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-dashed border-emerald-250">
              <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest block mb-1">
                Active Promo Code
              </span>
              <code className="text-xl font-mono font-black text-emerald-900 block tracking-wider">
                {showRedeemModal.promoCode}
              </code>
              <p className="text-[10px] text-slate-400 mt-2 font-medium">
                Copy and enter this coupon during clinical consultation schedule or checkout logs.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => {
                navigator.clipboard.writeText(showRedeemModal.promoCode);
                alert("Voucher copied to clipboard!");
            }} className="flex-1 bg-slate-950 text-white font-extrabold text-xs py-3 rounded-xl hover:bg-slate-850 transition cursor-pointer">
                📋 Copy Code
              </button>
              <button onClick={() => setShowRedeemModal(null)} className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-extrabold text-xs py-3 rounded-xl transition cursor-pointer">
                Close Window
              </button>
            </div>
          </div>
        </div>)}

    </div>);
}
