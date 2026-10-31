import React, { useState } from "react";
import { Navigation, Phone, MapPin, Info, Clock } from "lucide-react";
import { HOSPITALS } from "../mockData";
export default function NearbyHospitals() {
    const [radialDistance, setRadialDistance] = useState(10);
    const [filterEmergency, setFilterEmergency] = useState(false);
    const [selectedHospital, setSelectedHospital] = useState(HOSPITALS[0]);
    const [routingLog, setRoutingLog] = useState(null);
    // Filter listed hospitals
    const filteredHospitals = HOSPITALS.filter((h) => {
        // Distance filter
        const distNum = parseFloat(h.distance);
        const matchesDistance = distNum <= radialDistance;
        const matchesEmergency = !filterEmergency || h.isEmergency;
        return matchesDistance && matchesEmergency;
    });
    const triggerGetDirections = (h) => {
        setSelectedHospital(h);
        // Simulate real-time GPS routing log
        setRoutingLog([
            `Initializing telemetry routing to ${h.name}...`,
            `Head northwest on current medical corridor toward exit. (0.3 km)`,
            `Merge onto Expressway Route 5 Northbound via ramp. (1.5 km)`,
            `Take exit 12 for Medical Center Parkway. (0.8 km)`,
            `Arrive at main diagnostic parking deck. Your destination ${h.name} is on the right.`
        ]);
    };
    return (<div className="w-full max-w-7xl mx-auto space-y-6 p-3" id="nearby-hospitals-ui">
      
      {/* Controls panel */}
      <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1">
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <Navigation className="text-green-600" size={18}/>
            <span>Simulated GPS Location Hub</span>
          </h3>
          <p className="text-xs text-gray-400">Current Base: Midtown Hub · 40.7128° N, 74.0060° W (New York Core)</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
          {/* Slider distance */}
          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
            <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">Radius Range:</span>
            <input id="hospital-radius" name="radialDistance" type="range" min="2" max="15" step="1" aria-label="Search radius in kilometres" value={radialDistance} onChange={(e) => {
            setRadialDistance(parseInt(e.target.value));
            setRoutingLog(null);
        }} className="w-32 accent-green-600"/>
            <span className="text-xs font-bold text-green-600">{radialDistance} km</span>
          </div>

          {/* Checkbox Emergency */}
          <button onClick={() => {
            setFilterEmergency(!filterEmergency);
            setRoutingLog(null);
        }} className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer border ${filterEmergency
            ? "bg-red-50 text-red-700 border-red-200"
            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`}>
            <span className={`size-2 rounded-full ${filterEmergency ? "bg-red-600 animate-ping" : "bg-gray-400"}`}></span>
            <span>Emergency Emergency ER Only</span>
          </button>
        </div>
      </div>

      {/* Main split dashboard view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Hospital List */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-1 mb-2 flex justify-between">
            <span>Discovered Centers ({filteredHospitals.length})</span>
            <span className="text-xs font-semibold text-green-600 lowercase bg-green-50 px-2 py-0.5 rounded-md">Live GPS Sync</span>
          </h3>

          {filteredHospitals.length === 0 ? (<div className="text-center py-16 bg-white border border-gray-100 rounded-2xl">
              <MapPin className="mx-auto text-gray-300 mb-2" size={36}/>
              <h4 className="font-bold text-gray-750 text-sm">No Centers Found</h4>
              <p className="text-xs text-gray-400 mt-1">Try expanding the radius slider controls above.</p>
            </div>) : (<div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
              {filteredHospitals.map((h) => (<div key={h.id} onClick={() => {
                    setSelectedHospital(h);
                    setRoutingLog(null);
                }} className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${selectedHospital?.id === h.id
                    ? "bg-white border-green-500 shadow-md ring-1 ring-green-500/10"
                    : "bg-white border-gray-100 hover:border-gray-300"}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded font-bold uppercase">
                          {h.type}
                        </span>
                        {h.isEmergency && (<span className="text-[10px] text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded font-extrabold animate-pulse">
                            ER Ready
                          </span>)}
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm mt-2">{h.name}</h4>
                      <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                        <MapPin size={12}/>
                        <span>{h.address}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-extrabold text-slate-800">{h.distance}</span>
                      <p className="text-[10px] text-gray-400">from Midtown</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-600">
                    <div className="flex gap-4">
                      <span>Beds: <strong className="font-bold text-slate-800">{h.bedsAvailable}</strong></span>
                      <span>Rating: <strong className="font-bold text-slate-900">{h.rating} ★</strong></span>
                    </div>

                    <div className="flex gap-2">
                      <a href={`tel:${h.phone}`} onClick={(e) => e.stopPropagation()} className="p-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-gray-500 transition cursor-pointer" title="Call triage desk">
                        <Phone size={13}/>
                      </a>
                      <button onClick={(e) => {
                    e.stopPropagation();
                    triggerGetDirections(h);
                }} className="py-1.5 px-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm shadow-green-600/10">
                        <Navigation size={12}/>
                        <span>Directions</span>
                      </button>
                    </div>
                  </div>
                </div>))}
            </div>)}
        </div>

        {/* Right Side: Interactive Maps panel / Route planner */}
        <div className="lg:col-span-5 bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-slate-900 border-b border-gray-50 pb-2">
            EliteCare GPS Terminal
          </h3>

          {selectedHospital ? (<div className="space-y-6">
              {/* Fake aesthetic SVG map graphic */}
              <div className="relative h-64 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full text-gray-200" xmlns="http://www.w3.org/2000/svg">
                  {/* Grid Lines */}
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)"/>
                  {/* Fake street diagonals */}
                  <path d="M-50,150 L400,-50 M0,200 L400,0 M200,300 L50,0" stroke="#f1f5f9" strokeWidth="6"/>
                  <path d="M50,250 L350,-50 M100,300 L450,-50" stroke="#e2e8f0" strokeWidth="4"/>
                  <path d="M0,80 L400,120" stroke="#cbd5e1" strokeWidth="6"/>
                  {/* Transit line tracker link */}
                  {routingLog && (<path d="M120,120 Q160,80 200,105 T240,160" stroke="#16a34a" strokeWidth="4" strokeDasharray="6,4" fill="none"/>)}
                </svg>

                {/* Simulated center pin */}
                <div className="absolute top-[120px] left-[120px] -translate-x-1/2 -render-y-1/2 flex flex-col items-center">
                  <span className="size-4 rounded-full bg-blue-600/20 flex items-center justify-center">
                    <span className="size-2 rounded-full bg-blue-600 animate-ping"></span>
                  </span>
                  <span className="text-[10px] bg-blue-900 text-white font-bold px-1.5 py-0.5 rounded shadow mt-1">My Location</span>
                </div>

                {/* Simulated Hospital Pin */}
                <div className="absolute top-[160px] left-[240px] -translate-x-1/2 -render-y-1/2 flex flex-col items-center">
                  <span className="size-5 rounded-full bg-green-600/30 flex items-center justify-center">
                    <MapPin className="text-green-600" size={14}/>
                  </span>
                  <span className="text-[10px] bg-slate-900 text-white font-extrabold px-1.5 py-0.5 rounded shadow mt-1 whitespace-nowrap">
                    {selectedHospital.name.replace("EliteCare ", "")}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-md border border-gray-200 text-[10px] font-bold text-gray-500">
                  WGS 64 Projection
                </div>
              </div>

              {/* Hospital Summary */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Currently Inspected</h4>
                <div className="p-4 bg-gray-50 border border-gray-150 rounded-xl space-y-2">
                  <div className="flex justify-between items-start">
                    <h5 className="font-extrabold text-xs text-slate-800">{selectedHospital.name}</h5>
                    <span className="text-[10px] text-green-700 bg-green-50 font-bold px-2 py-0.5 rounded">
                      {selectedHospital.distance}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">{selectedHospital.address}</p>
                  <p className="text-[11px] font-medium text-slate-700">Triage Line: {selectedHospital.phone}</p>
                </div>
              </div>

              {/* Transit Routing Logs */}
              {routingLog && (<div className="p-4 bg-emerald-50/20 border border-emerald-100 rounded-xl space-y-2 max-h-48 overflow-y-auto">
                  <div className="flex items-center gap-1.5 border-b border-emerald-100/60 pb-1.5 mb-1.5 text-emerald-800">
                    <Clock size={12}/>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Dynamic GPS Directions log</span>
                  </div>
                  <div className="space-y-1.5">
                    {routingLog.map((step, idx) => (<div key={idx} className="flex gap-2 text-[10px] leading-relaxed text-gray-650">
                        <span className="font-bold text-emerald-600 shrink-0">#{idx + 1}</span>
                        <p>{step}</p>
                      </div>))}
                  </div>
                </div>)}

              {!routingLog && (<button onClick={() => triggerGetDirections(selectedHospital)} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow">
                  <Navigation size={13}/>
                  <span>Map Telemetry Directions Log</span>
                </button>)}
            </div>) : (<div className="text-center py-24 text-gray-400">
              <Info className="mx-auto text-gray-300 mb-2" size={32}/>
              <p className="text-xs">Choose any health center on the left to review transit telemetry details.</p>
            </div>)}
        </div>

      </div>
    </div>);
}
