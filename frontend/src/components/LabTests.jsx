import React, { useState, useEffect } from "react";
import { FlaskConical, Search, Clock, Sparkles, Activity, CheckCircle, Plus, ArrowRight, ShieldCheck, AlertCircle, BookOpen, FileSpreadsheet, Timer, Users, List, Grid3X3 } from "lucide-react";
const RUNNING_LAB_TESTS = [
    {
        id: "cbc",
        name: "Complete Blood Count (CBC)",
        code: "L-CBC-01",
        category: "Blood",
        price: 35,
        duration: "12 Hours",
        fasting: false,
        preparation: "No special preparation required. Hydration recommended.",
        popular: true,
        parameters: ["Hemoglobin", "WBC Count", "RBC Count", "Platelet Count", "Hematocrit", "MCV", "MCH"],
        description: "Evaluates overall cellular health and detects a comprehensive range of issues, such as anemia, active infection, and leukemia."
    },
    {
        id: "hba1c",
        name: "HbA1c (Glycated Haemoglobin)",
        code: "L-HBA-02",
        category: "Diabetes",
        price: 49,
        duration: "12 Hours",
        fasting: false,
        preparation: "Can be done at any time of day, fasting is not required.",
        popular: true,
        parameters: ["HbA1c Percentage", "Estimated Average Glucose (eAG)"],
        description: "Measures average glycemic control over the past 2-3 months. Paramount for diagnosing and monitoring diabetes."
    },
    {
        id: "lipid",
        name: "Complete Lipid Profile",
        code: "L-LPD-03",
        category: "Lipid",
        price: 55,
        duration: "24 Hours",
        fasting: true,
        preparation: "Requires 10-12 hours of strict fasting. Water is permitted.",
        popular: true,
        parameters: ["Total Cholesterol", "HDL Cholesterol", "LDL Cholesterol", "Triglycerides", "VLDL Cholesterol", "CHOL/HDL Ratio"],
        description: "Assesses cardiovascular blockages risks by measuring various essential fats and lipid substances in your circulating system."
    },
    {
        id: "thyroid",
        name: "Thyroid Profile (T3, T4, TSH)",
        code: "L-THY-04",
        category: "Thyroid",
        price: 65,
        duration: "24 Hours",
        fasting: false,
        preparation: "Fasting not required. Inform the laboratory if you take thyroid medicine.",
        popular: false,
        parameters: ["Total Triiodothyronine (T3)", "Total Thyroxine (T4)", "Thyroid Stimulating Hormone (TSH)"],
        description: "Evaluates standard thyroid gland function. Aids in diagnosing hyperthyroidism and sluggish cellular metabolisms."
    },
    {
        id: "kidney",
        name: "Kidney Function Test (KFT)",
        code: "L-KFT-05",
        category: "Organ",
        price: 70,
        duration: "24 Hours",
        fasting: true,
        preparation: "Fasting of 8-10 hours is advised for accurate electrolyte and mineral readings.",
        popular: false,
        parameters: ["Urea", "Creatinine", "BUN", "Uric Acid", "Sodium", "Potassium", "Chloride"],
        description: "Examines blood filtration biomarkers to determine how efficiently your kidneys are screening waste arrays."
    },
    {
        id: "liver",
        name: "Liver Function Test (LFT)",
        code: "L-LFT-06",
        category: "Organ",
        price: 75,
        duration: "24 Hours",
        fasting: true,
        preparation: "Requires overnight fasting of 10 hours. Avoid alcohol for 48 hours prior.",
        popular: false,
        parameters: ["SGOT / AST", "SGPT / ALT", "Alkaline Phosphatase", "Bilirubin Total", "Bilirubin Direct", "Albumin", "Total Protein"],
        description: "Helps screen for liver damage, inflammation, or biliary blockages by monitoring enzyme enzymes."
    },
    {
        id: "full-body",
        name: "Executive Wellness Full-Body Package",
        code: "L-FWP-07",
        category: "Complete",
        price: 180,
        duration: "36 Hours",
        fasting: true,
        preparation: "Overnight fasting of 10-12 hours is mandatory. Includes urine analysis alongside full body chemistry.",
        popular: true,
        parameters: ["CBC Checked (7)", "KFT Minerals (7)", "LFT Enzymes (7)", "Lipid Fats (6)", "TSH Thyroid", "HbA1c Sugar", "Vitamin D3", "Vitamin B12", "Urine Routine Screening"],
        description: "An absolute screening layout evaluating vital organ filters, general glycemic stores, and essential metabolic vitamins."
    }
];
const PHLEBOTOMIST_CREW = [
    {
        name: "Nurse Sarah Parker, RN",
        rating: 4.9,
        experience: "7 Years Exp",
        status: "On Duty",
        safetyLevel: "Vaccinated & Insured",
        avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150"
    },
    {
        name: "David Chen, CPT",
        rating: 4.8,
        experience: "5 Years Exp",
        status: "In Transit",
        safetyLevel: "Vaccinated & Certified",
        avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150"
    },
    {
        name: "Elena Rostova, LPN",
        rating: 4.95,
        experience: "9 Years Exp",
        status: "On Duty",
        safetyLevel: "Vaccinated & Certified",
        avatar: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=150"
    }
];
const SYMPTOM_CONGRESS = [
    {
        label: "Always Fatigue / Exhausted",
        symptoms: "Extreme tiredness, brain fog, cold fingers",
        recommendedTestIds: ["cbc", "thyroid", "full-body"]
    },
    {
        label: "Glycemic / Weight Fluctuations",
        symptoms: "Unusual thirst, frequent urination, weight losses",
        recommendedTestIds: ["hba1c", "full-body"]
    },
    {
        label: "Cardio Health / Cholesterol Sync",
        symptoms: "Chest heaviness, family history of pressure problems",
        recommendedTestIds: ["lipid", "kidney"]
    },
    {
        label: "Routine Screening & Vital Assessment",
        symptoms: "Regular annual physical, basic preventive maintenance",
        recommendedTestIds: ["cbc", "full-body"]
    }
];
export default function LabTests({ patientName = "John Doe" }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedTest, setSelectedTest] = useState(null);
    const [selectedSymptomPreset, setSelectedSymptomPreset] = useState(null);
    // Custom display toggle: "grid" | "list"
    const [viewMode, setViewMode] = useState("grid");
    // Cart booking states
    const [cart, setCart] = useState([]);
    const [bookingDate, setBookingDate] = useState("2026-06-16");
    const [bookingSlot, setBookingSlot] = useState("08:00 AM - 10:00 AM");
    const [collectionAddress, setCollectionAddress] = useState("128 Blue Spruce Drive, Seattle WA");
    const [contactPhone, setContactPhone] = useState("+1 (555) 019-2834");
    const [isSuccessfullyBooked, setIsSuccessfullyBooked] = useState(false);
    const [bookingResponseCode, setBookingResponseCode] = useState("");
    // Fasting Prep States
    const [lastMealHour, setLastMealHour] = useState("20:00"); // 8:00 PM
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [calculatedFastingHours, setCalculatedFastingHours] = useState(10);
    // History tracking
    const [pastBookings, setPastBookings] = useState([
        {
            id: "b-01",
            bookingCode: "EL-82405-TX",
            testName: "HbA1c (Glycated Haemoglobin)",
            patientName: "John Doe",
            date: "2026-06-10",
            slot: "07:30 AM - 09:30 AM",
            address: "128 Blue Spruce Drive, Seattle WA",
            phone: "+1 (555) 019-2834",
            status: "Report Released",
            reportUrl: true
        },
        {
            id: "b-02",
            bookingCode: "EL-90184-TX",
            testName: "Complete Lipid Profile",
            patientName: "John Doe",
            date: "2026-06-12",
            slot: "08:00 AM - 10:00 AM",
            address: "128 Blue Spruce Drive, Seattle WA",
            phone: "+1 (555) 019-2834",
            status: "Processing in Lab",
            reportUrl: false
        }
    ]);
    const categories = ["All", "Blood", "Thyroid", "Diabetes", "Lipid", "Complete", "Organ"];
    // Filter & match calculation logic
    const filteredTests = RUNNING_LAB_TESTS.filter(test => {
        // If a symptom preset is selected, filter primarily to those recommended test IDs
        if (selectedSymptomPreset && !selectedSymptomPreset.recommendedTestIds.includes(test.id)) {
            return false;
        }
        const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            test.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            test.parameters.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === "All" || test.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });
    const addToCart = (test) => {
        if (!cart.some(item => item.id === test.id)) {
            setCart([...cart, test]);
        }
    };
    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };
    const handleCheckout = (e) => {
        e.preventDefault();
        if (cart.length === 0)
            return;
        const codeSuffix = Math.floor(10000 + Math.random() * 90000);
        const newBookingCode = `EL-${codeSuffix}-TX`;
        const newBookedObjects = cart.map((test, index) => ({
            id: `b-new-${index}-${codeSuffix}`,
            bookingCode: newBookingCode,
            testName: test.name,
            patientName: patientName,
            date: bookingDate,
            slot: bookingSlot,
            address: collectionAddress,
            phone: contactPhone,
            status: "Confirmed"
        }));
        setPastBookings([...newBookedObjects, ...pastBookings]);
        setBookingResponseCode(newBookingCode);
        setIsSuccessfullyBooked(true);
        setCart([]);
    };
    // Helper function to dynamically check if any item selected requires fasting
    const anyRequiresFasting = cart.some(test => test.fasting) || (selectedTest?.fasting);
    // Fasting hour logic calculations
    useEffect(() => {
        if (lastMealHour) {
            const [hours, minutes] = lastMealHour.split(":").map(Number);
            // Fasting calculation simulation assuming target pickup is around 8:00 AM next morning
            const mealMoment = hours + (minutes / 60);
            const collectionMoment = 32; // Assuming 8:00 AM next day (24 + 8)
            const diff = collectionMoment - mealMoment;
            setCalculatedFastingHours(Math.max(4, Math.min(20, Math.round(diff * 10) / 10)));
        }
    }, [lastMealHour]);
    const subtotal = cart.reduce((acc, curr) => acc + curr.price, 0);
    const homeCharges = subtotal > 99 ? 0 : 15;
    const grandTotal = subtotal + homeCharges;
    return (<div className="w-full max-w-7xl mx-auto space-y-8 pb-16 text-left" id="lab-tests-directory-container">
      
      {/* PROFESSIONAL STYLISH HERO PANEL */}
      <div className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/40 to-blue-900/25 opacity-40 pointer-events-none"></div>
        <div className="absolute -top-12 -right-12 size-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 z-10 relative">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
              <FlaskConical size={12} className="animate-pulse"/>
              <span>NABL Accredited Partner Laboratory Network</span>
            </div>
            <h1 className="text-2xl md:text-3.5xl font-black tracking-tight leading-tight">
              Clinical Quality Diagnostics & Home Pickups
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed font-sans">
              Order professional home sample collection with certified nursing professionals. State of the art automated analyzers yield precision results reviewed by expert clinical pathheads.
            </p>
          </div>
          
          <div className="flex flex-row gap-4 py-2 font-mono text-left bg-slate-950/70 p-4 border border-slate-800 rounded-2xl shrink-0 text-xs">
            <div className="text-center px-3 border-r border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Home Nurse Pick</span>
              <strong className="text-emerald-400 text-sm font-extrabold flex items-center justify-center gap-1 mt-0.5">
                <span className="size-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Active</span>
              </strong>
            </div>
            <div className="text-center px-3">
              <span className="text-[10px] text-slate-400 block uppercase">Report PDF Turnaround</span>
              <strong className="text-white text-sm font-extrabold block mt-0.5">&lt; 12 - 24 Hrs</strong>
            </div>
          </div>
        </div>
      </div>

      {/* HEALTH SYMPTOM CONTEXT RECOMMANDER HUD */}
      <div className="bg-gradient-to-tr from-slate-50 to-emerald-50/50 border border-emerald-150 p-5 rounded-3xl text-left space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-emerald-600"/>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Smart Symptom-To-Diagnostic Classifier
            </h3>
          </div>
          {selectedSymptomPreset && (<button onClick={() => setSelectedSymptomPreset(null)} className="text-[10px] text-red-600 hover:underline font-bold cursor-pointer">
              Clear Symptom Selector ×
            </button>)}
        </div>
        <p className="text-xs text-gray-400 leading-tight">
          Select an active health complaint indicators to instantly pinpoint recommended panels matching clinical diagnosis protocols:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SYMPTOM_CONGRESS.map((sc, idx) => {
            const isSelected = selectedSymptomPreset?.label === sc.label;
            return (<div key={idx} onClick={() => {
                    setSelectedSymptomPreset(isSelected ? null : sc);
                    // Turn off category filter to let symptom focus on target matches
                    setSelectedCategory("All");
                }} className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 select-none flex flex-col justify-between ${isSelected
                    ? "bg-emerald-600 border-emerald-700 text-white shadow-sm scale-[1.02]"
                    : "bg-white border-slate-150 hover:border-emerald-250 hover:bg-slate-50 text-slate-800"}`}>
                <div>
                  <h4 className={`text-[11.5px] font-extrabold leading-snug ${isSelected ? "text-white" : "text-slate-900"}`}>
                    {sc.label}
                  </h4>
                  <p className={`text-[10px] mt-1 italic leading-snug ${isSelected ? "text-emerald-150" : "text-gray-400"}`}>
                    "{sc.symptoms}"
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className={`text-[9px] font-bold uppercase ${isSelected ? "text-white" : "text-emerald-700"}`}>
                    {sc.recommendedTestIds.length} Recommended Panels
                  </span>
                  <ArrowRight size={12} className={isSelected ? "text-white" : "text-slate-300"}/>
                </div>
              </div>);
        })}
        </div>
      </div>

      {/* SEARCH, CATEGORIES, & VIEW TOGGLES CONTROLLER */}
      <div className="bg-white border border-slate-150 p-5 rounded-3xl col-span-12 shadow-xs space-y-4 text-left">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
            <input id="lab-test-search" name="searchTerm" type="text" aria-label="Search standard tests and biomarkers" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full text-xs pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans" placeholder="Search standard tests, specific biomarkers (e.g. Hemoglobin, Insulin, TSH, AST, Cholesterol)..."/>
            {searchTerm && (<button onClick={() => setSearchTerm("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-405 hover:text-slate-700 font-bold">
                Clear
              </button>)}
          </div>

          {/* VIEW MODE TOGGLE & COUNT */}
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-between md:justify-end">
            <span className="text-[11px] text-gray-400 font-mono">
              Showing <strong className="text-slate-900 font-bold">{filteredTests.length}</strong> available assays
            </span>

            <div className="flex border border-slate-150 rounded-xl overflow-hidden bg-slate-50 p-0.5">
              <button type="button" onClick={() => setViewMode("grid")} className={`p-2 rounded-lg cursor-pointer transition ${viewMode === "grid" ? "bg-white text-emerald-800 shadow-xs" : "text-slate-400 hover:text-slate-600"}`} title="Grid View">
                <Grid3X3 size={15}/>
              </button>

              <button type="button" onClick={() => setViewMode("list")} className={`p-2 rounded-lg cursor-pointer transition ${viewMode === "list" ? "bg-white text-emerald-800 shadow-xs" : "text-slate-400 hover:text-slate-600"}`} title="Aligned List View">
                <List size={15}/>
              </button>
            </div>
          </div>
        </div>

        {/* Category Quick Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-slate-50">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mr-2">
            Categories:
          </span>
          {categories.map((cat) => (<button key={cat} onClick={() => {
                setSelectedCategory(cat);
                setSelectedSymptomPreset(null); // Clear symptom preset when choosing manual category
            }} className={`text-[11px] font-bold px-3 py-1.5 rounded-full border transition cursor-pointer select-none ${selectedCategory === cat && !selectedSymptomPreset
                ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
              {cat}
            </button>))}
        </div>
      </div>

      {/* MAIN CONTENT DIVISION ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COMPONENT: AVAILABLE PANELS / ASSAYS (GRID / ALIGNED LIST VIEW) */}
        <div className="lg:col-span-8 space-y-6">
          
          {selectedSymptomPreset && (<div className="p-3 bg-emerald-50 border border-emerald-150 text-emerald-800 text-[11px] rounded-xl flex items-center justify-between px-4">
              <span className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-emerald-700"/>
                <span>Diagnostics filtered dynamically for: <strong>{selectedSymptomPreset.label}</strong></span>
              </span>
              <button onClick={() => setSelectedSymptomPreset(null)} className="font-bold underline text-[10px] hover:text-emerald-950">
                Show All Assays
              </button>
            </div>)}

          {/* GRID VIEW MODE */}
          {viewMode === "grid" ? (<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredTests.map((test) => {
                const inCart = cart.some(item => item.id === test.id);
                const recommendationMatch = selectedSymptomPreset?.recommendedTestIds.includes(test.id);
                return (<div key={test.id} onClick={() => setSelectedTest(test)} className={`bg-white border rounded-2xl p-5 shadow-xs transition duration-200 flex flex-col justify-between text-left relative group hover:shadow-lg cursor-pointer ${recommendationMatch
                        ? "border-emerald-500 ring-1 ring-emerald-500/25 bg-emerald-50/10"
                        : "border-slate-150 hover:border-emerald-350"}`}>
                    
                    {/* Badge container - absolute to stay neatly aligned */}
                    <div className="absolute top-3.5 right-3.5 flex flex-col items-end gap-1 z-10">
                      {test.popular && (<span className="bg-amber-100 text-amber-800 text-[8.5px] font-black tracking-wider uppercase px-2 py-0.5 rounded">
                          Highly Popular
                        </span>)}
                      {recommendationMatch && (<span className="bg-emerald-600 text-white text-[8.5px] font-black tracking-wider uppercase px-2 py-0.5 rounded flex items-center gap-0.5 shadow-xs">
                          <Sparkles size={8}/>
                          <span>Clinician Pick</span>
                        </span>)}
                    </div>

                    <div className="space-y-3.5">
                      <div className="flex items-center gap-3">
                        <span className="size-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                          <FlaskConical size={18}/>
                        </span>
                        <div className="min-w-0 pr-16 md:pr-24">
                          <span className="text-[10px] font-bold text-slate-405 uppercase font-mono block">
                            {test.code} • {test.category}
                          </span>
                          <h3 className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                            {test.name}
                          </h3>
                        </div>
                      </div>

                      <p className="text-[11px] text-gray-405 leading-relaxed font-sans line-clamp-2 h-9">
                        {test.description}
                      </p>

                      {/* Meta parameters count list summary */}
                      <div className="text-[10px] bg-slate-50 p-2 rounded-xl text-slate-500 flex items-center gap-2">
                        <Activity size={10} className="text-[#16A34A] shrink-0"/>
                        <span className="truncate font-sans">
                          Includes: <strong className="text-slate-850 font-semibold">{test.parameters.slice(0, 3).join(", ")}{test.parameters.length > 3 ? "..." : ""} ({test.parameters.length} test markers)</strong>
                        </span>
                      </div>

                      {/* Meta stats row */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[9.5px] font-medium text-slate-500 pt-2 border-t border-slate-100 font-sans">
                        <span className="flex items-center gap-1">
                          <Clock size={11} className="text-slate-400"/>
                          <span>{test.duration} delivery</span>
                        </span>
                        <span className="size-1 rounded-full bg-slate-200"></span>
                        <span className={test.fasting ? "text-amber-600 font-bold flex items-center gap-1" : "text-emerald-600 font-bold flex items-center gap-1"}>
                          <Timer size={10}/>
                          <span>{test.fasting ? "Fasting (12h)" : "No Fasting Info"}</span>
                        </span>
                      </div>
                    </div>

                    {/* Bottom row actions aligned perfectly */}
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-50">
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-[11px] text-gray-400 font-bold">$</span>
                        <span className="text-lg font-black text-slate-900">{test.price}</span>
                      </div>

                      <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button type="button" onClick={() => setSelectedTest(test)} className="px-2.5 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-lg text-[10px] transition cursor-pointer">
                          Details
                        </button>

                        <button type="button" onClick={() => {
                        if (inCart) {
                            removeFromCart(test.id);
                        }
                        else {
                            addToCart(test);
                        }
                    }} className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1 text-[10px] font-black transition cursor-pointer ${inCart
                        ? "bg-slate-900 text-white hover:bg-slate-800"
                        : "bg-[#16A34A] text-white hover:bg-emerald-700"}`}>
                          {inCart ? (<span>Selected ✓</span>) : (<>
                              <Plus size={12}/>
                              <span>Add Test</span>
                            </>)}
                        </button>
                      </div>
                    </div>

                  </div>);
            })}
            </div>) : (
        /* ALIGNED LIST VIEW MODE (GUARANTEES HIGHLY ALIGNED ROW INTERFACES) */
        <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-sm text-left">
              {filteredTests.map((test) => {
                const inCart = cart.some(item => item.id === test.id);
                const recommendationMatch = selectedSymptomPreset?.recommendedTestIds.includes(test.id);
                return (<div key={test.id} onClick={() => setSelectedTest(test)} className={`p-4 hover:bg-slate-50/60 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer relative ${recommendationMatch ? "bg-emerald-50/15" : ""}`}>
                    {/* Left details */}
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      <span className="size-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
                        <FlaskConical size={18}/>
                      </span>
                      <div className="min-w-0 text-left space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold text-gray-400 uppercase font-mono bg-slate-100 px-1.5 py-0.2 rounded">
                            {test.code}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500">
                            {test.category}
                          </span>
                          {test.popular && (<span className="bg-amber-100 text-amber-800 text-[8px] font-black tracking-wider uppercase px-1.5 rounded">
                              Popular
                            </span>)}
                          {recommendationMatch && (<span className="bg-emerald-600 text-white text-[8px] font-black tracking-widest uppercase px-1.5 rounded">
                              Clinician Match
                            </span>)}
                        </div>

                        <h3 className="font-extrabold text-xs text-slate-900 truncate">
                          {test.name}
                        </h3>
                        <p className="text-[10.5px] text-gray-400 line-clamp-1">
                          {test.description}
                        </p>
                      </div>
                    </div>

                    {/* Middle stats */}
                    <div className="flex items-center gap-5 shrink-0 pt-2 md:pt-0 pb-1 md:pb-0 text-[10px] text-slate-550 border-t border-slate-50 md:border-t-0 w-full md:w-auto">
                      <div className="text-left">
                        <span className="text-gray-400 text-[9px] block uppercase leading-tight">TAT Report</span>
                        <strong className="font-extrabold text-slate-800">{test.duration}</strong>
                      </div>
                      <div className="text-left border-l border-slate-150 pl-3">
                        <span className="text-gray-400 text-[9px] block uppercase leading-tight">Fasting</span>
                        <strong className={test.fasting ? "text-amber-600 font-extrabold" : "text-emerald-600 font-extrabold"}>
                          {test.fasting ? "Yes (12h)" : "No Prep"}
                        </strong>
                      </div>
                      <div className="text-left border-l border-slate-150 pl-3">
                        <span className="text-gray-400 text-[9px] block uppercase leading-tight">Biomarkers</span>
                        <span className="font-semibold text-slate-700">{test.parameters.length} markers</span>
                      </div>
                    </div>

                    {/* Right actions */}
                    <div className="flex items-center gap-3 shrink-0 justify-between md:justify-end w-full md:w-auto pt-2 md:pt-0" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-[10px] text-slate-400">$</span>
                        <span className="text-base font-black text-slate-900">{test.price}</span>
                      </div>

                      <div className="flex gap-1.5">
                        <button type="button" onClick={() => setSelectedTest(test)} className="px-2.5 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-lg text-[9.5px] transition cursor-pointer">
                          Info
                        </button>

                        <button type="button" onClick={() => {
                        if (inCart) {
                            removeFromCart(test.id);
                        }
                        else {
                            addToCart(test);
                        }
                    }} className={`px-3 py-1.5 rounded-lg text-[9.5px] font-black transition cursor-pointer ${inCart
                        ? "bg-slate-950 text-white"
                        : "bg-[#16A34A] text-white hover:bg-emerald-700"}`}>
                          {inCart ? "Remove" : "Add Assays"}
                        </button>
                      </div>
                    </div>

                  </div>);
            })}
            </div>)}

          {filteredTests.length === 0 && (<div className="py-20 bg-white border border-slate-150 rounded-2xl text-center space-y-3">
              <AlertCircle className="size-10 text-slate-305 mx-auto animate-bounce"/>
              <h4 className="text-sm font-bold text-slate-900">No Matched Diagnostic Tests Found</h4>
              <p className="text-xs text-slate-400">Try checking a different category or clearing active filters.</p>
              <button onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setSelectedSymptomPreset(null);
            }} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition cursor-pointer">
                Reset Search Filters
              </button>
            </div>)}

        </div>

        {/* RIGHT COMPONENT: CART CHECKOUT & DETAILED WORKUP INFOGRAPHIC (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">

          {/* DYNAMIC CART CHECKOUT PANEL */}
          <div className="bg-white border-2 border-slate-200 p-6 rounded-3xl shadow-md space-y-6 text-left">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <span className="p-1 px-2.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-black">
                {cart.length}
              </span>
              <span>Home Diagnostic Cart</span>
            </h3>

            {isSuccessfullyBooked ? (<div className="py-8 text-center space-y-4 animate-in fade-in duration-300 text-left">
                <div className="size-12 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto">
                  <CheckCircle size={24}/>
                </div>
                <div className="space-y-1.5 text-center">
                  <h4 className="text-xs font-black text-slate-900">Lab Test Successfully Booked!</h4>
                  <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans">
                    Your collection code is <strong className="text-slate-800 font-mono bg-slate-100 px-1.5 py-0.5 rounded">{bookingResponseCode}</strong>.
                  </p>
                  <p className="text-[10.5px] text-slate-500 font-sans">
                    A dispatched nurse will confirm details prior to arriving on <strong className="text-slate-700">{bookingDate}</strong> during hour <strong className="text-slate-700">{bookingSlot}</strong>.
                  </p>
                </div>

                <button type="button" onClick={() => setIsSuccessfullyBooked(false)} className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold rounded-xl py-2.5 text-xs transition cursor-pointer">
                  Book New Lab Panels
                </button>
              </div>) : (<form onSubmit={handleCheckout} className="space-y-6">
                
                {/* List items inside cart */}
                <div className="space-y-3">
                  {cart.map((item) => (<div key={item.id} className="flex justify-between items-center gap-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-extrabold text-[11px] text-slate-900 truncate">{item.name}</h4>
                        <span className="text-[9px] text-slate-400 font-mono tracking-wider">{item.code} • {item.duration}</span>
                      </div>
                      <div className="flex items-center gap-2.5 shrink-0">
                        <strong className="text-xs text-slate-900">${item.price}</strong>
                        <button type="button" onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 font-bold text-sm cursor-pointer px-1 py-0.5 bg-slate-200/40 rounded hover:bg-red-50" title="Remove test">
                          ×
                        </button>
                      </div>
                    </div>))}

                  {cart.length === 0 && (<div className="p-8 text-center text-xs text-gray-405 italic border-2 border-dashed border-slate-100 rounded-xl space-y-2.5">
                      <FlaskConical size={22} className="text-slate-300 mx-auto"/>
                      <p className="font-semibold text-slate-500">Your diagnostic cart is empty.</p>
                      <p className="text-[10px] text-slate-400 font-sans font-normal">Select specific diagnostic panels from the inventory to schedule home nursing samples picking.</p>
                    </div>)}
                </div>

                {/* Sub-inputs if cart is not empty */}
                {cart.length > 0 && (<div className="space-y-4 pt-3 border-t border-slate-100">
                    
                    <div className="bg-emerald-50/40 p-3 rounded-xl border border-emerald-100 flex items-start gap-2 text-[10.5px] text-slate-705">
                      <ShieldCheck size={14} className="text-emerald-700 shrink-0 mt-0.5"/>
                      <p className="font-sans">
                        Fasting requirements are automatically checked. Be sure to note preparation warnings before scheduling your last meal.
                      </p>
                    </div>

                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#16A34A] block">
                      Physical Sample Packing Logistics
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 block">Scheduled Date</label>
                        <input type="date" required value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"/>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 block">Time Window</label>
                        <select value={bookingSlot} onChange={(e) => setBookingSlot(e.target.value)} className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500">
                          <option value="07:00 AM - 09:00 AM">07:00 AM - 09:00 AM</option>
                          <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                          <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                          <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 block">Home Collection Physical Address</label>
                      <input type="text" required value={collectionAddress} onChange={(e) => setCollectionAddress(e.target.value)} className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="House / Flat No., landmark, street area..."/>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 block">Contact Phone Number</label>
                      <input type="text" required value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"/>
                    </div>

                    {/* Total cost details */}
                    <div className="space-y-2 pt-3 border-t border-slate-150 font-sans text-xs">
                      <div className="flex justify-between text-slate-500">
                        <span>Tests Subtotal:</span>
                        <strong className="text-slate-800">${subtotal}</strong>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Vaccinated Nurse Visiting Fee:</span>
                        <strong className="text-slate-800">
                          {homeCharges === 0 ? (<span className="text-[#16A34A] font-extrabold uppercase text-[10px] bg-green-50 px-1.5 py-0.5 rounded">
                              Free Promotion
                            </span>) : (`$${homeCharges}`)}
                        </strong>
                      </div>
                      <div className="flex justify-between pt-2.5 border-t border-slate-100 font-bold text-sm">
                        <span>Grand Total:</span>
                        <strong className="text-emerald-700 font-black text-base">${grandTotal}</strong>
                      </div>
                    </div>

                    <button type="submit" className="w-full bg-[#16A34A] hover:bg-[#15803d] text-white font-extrabold rounded-xl py-3.5 text-xs transition cursor-pointer shadow-md shadow-green-600/10 flex items-center justify-center gap-1.5">
                      <ShieldCheck size={14}/>
                      <span>Nurse Dispatch & Schedule sample</span>
                    </button>

                  </div>)}
              </form>)}
          </div>

          {/* DYNAMIC FASTLESS CALCULATOR PREPARATION HUD */}
          {anyRequiresFasting && (<div className="bg-gradient-to-tr from-amber-50 to-amber-100/30 border border-amber-200 p-5 rounded-3xl text-left space-y-3 shadow-xs">
              <div className="flex items-center gap-2">
                <Timer size={16} className="text-amber-700 animate-pulse"/>
                <h3 className="text-xs font-black uppercase tracking-wider text-amber-800">
                  Fasting Hours Eligibility Check
                </h3>
              </div>
              <p className="text-[11px] text-amber-900 leading-normal font-sans">
                You have added clinical assays that require strict overnight fasting. Set your expected last dinner time to calculate collection safety metrics:
              </p>

              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center bg-white p-2 border border-amber-200/60 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-650">Last dinner time:</span>
                  <input type="time" value={lastMealHour} onChange={(e) => setLastMealHour(e.target.value)} className="text-xs p-1 bg-slate-50 border border-slate-200 rounded focus:outline-none"/>
                </div>

                <div className="bg-white/80 p-3 rounded-xl space-y-1.5 text-xs font-sans text-left border border-amber-200/50">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Predicted fasting hours:</span>
                    <strong className="text-amber-800 font-mono font-bold">{calculatedFastingHours} Hours</strong>
                  </div>

                  <div className="flex items-center gap-x-1.5 mt-2">
                    {calculatedFastingHours >= 10 ? (<span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold uppercase flex items-center gap-1">
                        <CheckCircle size={10}/>
                        <span>Fasting Target Safe</span>
                      </span>) : (<span className="text-[9px] bg-amber-500 text-white px-1.5 py-0.5 rounded font-bold uppercase flex items-center gap-1">
                        <AlertCircle size={10}/>
                        <span>Ideally &gt; 10 hours advised</span>
                      </span>)}
                  </div>
                </div>
              </div>
            </div>)}

          {/* DYNAMIC LAB TEST DETAIL DRAWER / MODAL */}
          {selectedTest ? (<div className="bg-slate-900 text-white p-6 rounded-3xl space-y-5 shadow-xl text-left border border-slate-800 animate-in slide-in-from-bottom-3 duration-250">
              <div className="flex justify-between items-start gap-3">
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/25 py-0.5 px-2.5 rounded font-mono">
                  {selectedTest.code} • {selectedTest.category}
                </span>
                <button type="button" onClick={() => setSelectedTest(null)} className="text-slate-400 hover:text-white font-black text-xs cursor-pointer p-0.5">
                  ✕
                </button>
              </div>

              <div className="space-y-1">
                <h3 className="font-black text-sm text-white flex items-center gap-1.5">
                  <BookOpen size={14} className="text-emerald-400"/>
                  <span>{selectedTest.name}</span>
                </h3>
                <p className="text-[11px] text-zinc-300 leading-relaxed font-sans font-normal">
                  {selectedTest.description}
                </p>
              </div>

              {/* Lab preparations checks */}
              <div className="p-3 bg-slate-950/70 rounded-xl space-y-1 text-[10.5px]">
                <strong className="text-amber-400 uppercase tracking-widest text-[9px] block">Instructions & Warnings:</strong>
                <p className="font-sans text-slate-300 leading-normal">{selectedTest.preparation}</p>
              </div>

              {/* Parameters mapped list */}
              <div className="space-y-2">
                <span className="text-[9.5px] text-zinc-400 uppercase tracking-widest block font-extrabold">
                  Covered Blood Markers ({selectedTest.parameters.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedTest.parameters.map((param, idx) => (<span key={idx} className="bg-slate-800 border border-slate-700 text-zinc-200 text-[9px] px-2 py-0.5 rounded leading-tight">
                      {param}
                    </span>))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-800">
                <div className="flex items-baseline gap-0.5">
                  <span className="text-[10px] text-slate-550">$</span>
                  <span className="text-zinc-100 text-base font-black">{selectedTest.price}</span>
                </div>

                <div className="flex gap-2">
                  <button type="button" onClick={() => {
                addToCart(selectedTest);
                setSelectedTest(null);
            }} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-4 rounded-xl text-[10.5px] transition cursor-pointer">
                    Add directly
                  </button>
                </div>
              </div>

            </div>) : (<div className="bg-white border border-slate-150 p-5 rounded-3xl text-slate-400 text-xs shadow-inner space-y-2 text-center py-8">
              <FlaskConical size={20} className="text-slate-300 mx-auto"/>
              <p className="font-semibold text-slate-600">No Item Selected</p>
              <p className="text-[10px] leading-tight font-sans">
                Click "Details" or "Info" on any lab diagnostic panel to preview critical biomarker configurations, required fasting preparation hours, and clinical targets.
              </p>
            </div>)}

          {/* HISTORIC LAB LOG REVEAL */}
          <div className="bg-white border border-slate-150 p-5 rounded-3xl shadow-sm text-left space-y-3.5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="text-[11.5px] font-black text-slate-900 uppercase">
                Active Diagnostics History
              </h3>
              <FileSpreadsheet size={15} className="text-slate-400"/>
            </div>

            <div className="space-y-3">
              {pastBookings.slice(0, 2).map((pb) => (<div key={pb.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 text-xs text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-[9.5px] font-mono text-slate-400 font-bold uppercase">{pb.bookingCode}</span>
                    <span className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-bold ${pb.status === "Report Released" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                      {pb.status}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-[11px] text-slate-900 truncate leading-tight">{pb.testName}</h4>
                  <p className="text-[10px] text-gray-400">Scheduled: {pb.date}</p>
                </div>))}
            </div>
          </div>

        </div>

      </div>

      {/* FULL-WIDTH PARTNERSHIP & NURSING STATIONS HUD */}
      <div className="space-y-8 w-full mt-12" id="full-width-ancillary-hud-consoles">
        
        {/* CARD 1: HOME COLLECTION NURSING DISPATCH (FULL WIDTH) */}
        <div className="bg-white border border-slate-150 p-6 md:p-8 rounded-3xl shadow-xs space-y-6 text-left flex flex-col justify-between min-h-[220px]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl">
                <Users size={20}/>
              </span>
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                  Home Collection Nursing Dispatch
                </h3>
                <p className="text-[11.5px] text-slate-400 font-sans">
                  Local phlebotomy crew certified in clinical sanitation guidelines on standby for your physical neighborhood.
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 font-mono text-[10.5px] text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 shrink-0">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>3 Dispatched Today</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PHLEBOTOMIST_CREW.map((st, idx) => (<div key={idx} className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl flex gap-3.5 items-center h-24 md:h-28 w-full transition-all duration-200 hover:border-emerald-300 hover:shadow-xs">
                <img src={st.avatar} alt={st.name} className="size-12 rounded-full object-cover border border-emerald-150 shrink-0"/>
                <div className="min-w-0 flex-1 text-left">
                  <h4 className="font-extrabold text-[12.5px] md:text-[13.5px] text-slate-900 truncate leading-tight">
                    {st.name}
                  </h4>
                  <p className="text-[10.5px] text-[#16A34A] font-medium block mt-0.5 whitespace-nowrap">
                    ★ {st.rating} • {st.experience}
                  </p>
                  <div className="flex items-center gap-1 mt-1 min-w-0">
                    <span className={`size-1.5 rounded-full shrink-0 ${st.status === "On Duty" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`}/>
                    <span className="text-[9.5px] text-slate-455 font-mono font-bold uppercase truncate">
                      {st.status} • {st.safetyLevel.split(" & ")[0]}
                    </span>
                  </div>
                </div>
              </div>))}
          </div>
        </div>

      </div>

    </div>);
}
