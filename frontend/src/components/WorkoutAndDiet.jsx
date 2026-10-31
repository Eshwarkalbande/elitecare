import React, { useState } from "react";
import { Dumbbell, Apple, Flame, Droplet, Plus, Check, Play, Footprints, Sparkles, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
export default function WorkoutAndDiet({ onAddXP, coins }) {
    const [selectedDiet, setSelectedDiet] = useState("balanced");
    const [waterCups, setWaterCups] = useState(4);
    const [activeCalorieGoal, setActiveCalorieGoal] = useState(2000);
    const [caloriesLogged, setCaloriesLogged] = useState(1420);
    const [loggedMeals, setLoggedMeals] = useState([
        { id: 1, type: "Breakfast", name: "Avocado Toast & Egg Whites", calories: 340, time: "08:15 AM" },
        { id: 2, type: "Lunch", name: "Seared Cod & Brown Quinoa", calories: 580, time: "01:30 PM" },
        { id: 3, type: "Snack", name: "Greek Yogurt & Chia Seeds", calories: 220, time: "04:45 PM" },
    ]);
    const [customMealName, setCustomMealName] = useState("");
    const [customMealCals, setCustomMealCals] = useState("");
    const [customMealType, setCustomMealType] = useState("Breakfast");
    // Workout simulator states
    const [activeWorkout, setActiveWorkout] = useState(null);
    const [workoutProgress, setWorkoutProgress] = useState(0);
    const [workoutTimerRunning, setWorkoutTimerRunning] = useState(false);
    const [workoutTimer, setWorkoutTimer] = useState(15); // 15s simulation
    const [showFinishSplash, setShowFinishSplash] = useState(false);
    // Hydration state booster
    const handleDrinkWater = () => {
        if (waterCups < 10) {
            const nextCups = waterCups + 1;
            setWaterCups(nextCups);
            onAddXP(15, 5); // Hydration rewards
            // Level threshold hint
            if (nextCups === 8) {
                onAddXP(40, 20); // Ultimate target bonus
            }
        }
    };
    const diets = [
        {
            id: "balanced",
            name: "Cardiac Safe & Balanced",
            description: "Low sodium, rich in omega-3 fatty acids, potassium, and active fiber. Ideal for maintaining healthy blood pressure.",
            benefits: ["Lowers BP", "Protects arterial paths", "Rich in fiber"],
            icon: <Apple className="text-emerald-500" size={20}/>,
            meals: [
                { name: "Steel-Cut Oats with Berries & Walnuts", calories: 290 },
                { name: "Atlantic Salmon with Steamed Asparagus", calories: 450 },
                { name: "Lentil Soup with Roasted Baby Carrots", calories: 320 }
            ]
        },
        {
            id: "keto",
            name: "High-Protein Keto Energy",
            description: "Ketogenic micro-balance. Fuels mental clarity, metabolic rates, and high stamina recovery periods.",
            benefits: ["High endurance", "Fat adaptation", "Steady glucose"],
            icon: <Flame className="text-pink-500" size={20}/>,
            meals: [
                { name: "Avocado, Bacon, and Organic Omelette", calories: 480 },
                { name: "Grilled Herb Butter Ribeye & Spinach", calories: 720 },
                { name: "Baked Lemon Salmon with Olive Mash", calories: 510 }
            ]
        },
        {
            id: "clean-vegan",
            name: "Plant-Powered Clean Eating",
            description: "Fully organic, plant-based nutrition designed for anti-inflammatory cell cleanups and cardiovascular elasticity.",
            benefits: ["Anti-inflammatory", "Assists blood flow", "Eco-friendly"],
            icon: <Sparkles className="text-amber-500" size={20}/>,
            meals: [
                { name: "Silken Tofu Green Smoothie Complex", calories: 260 },
                { name: "Roasted Chickpea & Lemon Tahini Kale Bowl", calories: 430 },
                { name: "Tempeh Stir-Fry with Broccolini & Rice", calories: 380 }
            ]
        }
    ];
    const workouts = [
        { id: "core", name: "Core Restoration & Cardio", duration: "10 mins", xp: 50, coins: 15, level: "Beginner", description: "Breathe-controlled core activation designed to trigger safe blood flow." },
        { id: "active-hiit", name: "Cardiac Stamina Booster", duration: "15 mins", xp: 80, coins: 25, level: "Moderate", description: "Safe interval spikes in target heart thresholds tailored for oxygenation." },
        { id: "strength", name: "High-Tension Calisthenics", duration: "25 mins", xp: 120, coins: 40, level: "Advanced", description: "Isometric bodyweight postures for muscular recovery & insulin sensitivity." }
    ];
    const handleAddMeal = (e) => {
        e.preventDefault();
        if (!customMealName.trim() || !customMealCals)
            return;
        const cals = parseInt(customMealCals, 10) || 0;
        const newMeal = {
            id: Date.now(),
            type: customMealType,
            name: customMealName.trim(),
            calories: cals,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setLoggedMeals([newMeal, ...loggedMeals]);
        setCaloriesLogged((prev) => prev + cals);
        onAddXP(20, 10); // Reward nutrition logging
        setCustomMealName("");
        setCustomMealCals("");
    };
    const selectDietVibe = (id) => {
        setSelectedDiet(id);
        onAddXP(10, 2); // 10 XP for changing diet preferences to stimulate engagement
    };
    // Run a real CSS timer simulation for workouts
    const startWorkoutSimulator = (w) => {
        setActiveWorkout(w.name);
        setWorkoutProgress(0);
        setWorkoutTimerRunning(true);
        setWorkoutTimer(15);
        setShowFinishSplash(false);
        const interval = setInterval(() => {
            setWorkoutTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setWorkoutProgress(100);
                    setWorkoutTimerRunning(false);
                    setShowFinishSplash(true);
                    onAddXP(w.xp, w.coins); // Award workout finish
                    return 0;
                }
                const nextTime = prev - 1;
                setWorkoutProgress(Math.round(((15 - nextTime) / 15) * 100));
                return nextTime;
            });
        }, 1000);
    };
    return (<div className="space-y-8 animate-fade-in w-full max-w-7xl mx-auto p-4" id="workout-diet-applet">
      
      {/* Top Banner with Sparkles & Live Points */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-700 rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Dumbbell size={150}/>
        </div>
        <div className="max-w-2xl space-y-3 z-10 relative">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 px-3 py-1 rounded-full uppercase tracking-wider font-extrabold flex items-center gap-1">
              <Zap size={11} className="fill-emerald-400 text-emerald-400"/> Track & Level Up
            </span>
            <span className="text-[10px] bg-amber-500/25 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full uppercase tracking-wider font-black flex items-center gap-1 animate-pulse">
              🔥 1.5x Multiplier Active
            </span>
          </div>
          <h2 className="text-xl md:text-3xl font-black tracking-tight leading-tight">
            Gamified Musculoskeletal & Nutritional Blueprint
          </h2>
          <p className="text-xs md:text-sm text-emerald-100 font-sans leading-relaxed">
            Every cup of water logged, calorie checked, and cardio segment finished triggers immediate Health XP progress towards unlocking clinic voucher awards!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Nutrition & Diets (Cols 7) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* DIET SELECTOR BOX */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <Apple className="text-green-600" size={18}/>
                  Clinician-Approved Diet Plans
                </h3>
                <p className="text-[10.5px] text-slate-400 font-sans">Toggle diet rules configured by clinical experts to see targets.</p>
              </div>
              <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded tracking-wide">
                +10 XP On Selection
              </span>
            </div>

            {/* Diet Grid selectors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              {diets.map((diet) => (<button key={diet.id} onClick={() => selectDietVibe(diet.id)} className={`p-3.5 rounded-xl border text-left flex flex-col justify-between h-36 transition-all duration-200 cursor-pointer ${selectedDiet === diet.id
                ? "bg-emerald-50/40 border-emerald-500 shadow-md ring-1 ring-emerald-500/10"
                : "bg-slate-50/50 border-slate-100 hover:bg-slate-50"}`}>
                  <div className="flex justify-between items-center w-full">
                    <span className="p-1.5 bg-white rounded-lg shadow-2xs border border-slate-100">
                      {diet.icon}
                    </span>
                    {selectedDiet === diet.id && (<span className="size-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px]">
                        <Check size={11} strokeWidth={3}/>
                      </span>)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-850 text-[11.5px] mt-2 tracking-tight">
                      {diet.name}
                    </h4>
                    <span className="text-[9px] text-[#16A34A] block font-medium mt-0.5">
                      ✓ {diet.benefits[0]}
                    </span>
                  </div>
                </button>))}
            </div>

            {/* Selected Diet Preview */}
            {(() => {
            const current = diets.find(d => d.id === selectedDiet) || diets[0];
            return (<div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Plan Description</h4>
                    <p className="text-[11px] text-slate-500 font-sans leading-relaxed">{current.description}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Benefits bullet points */}
                    <div className="space-y-2">
                      <h5 className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Key Targets</h5>
                      <ul className="space-y-1 text-[10.5px] text-slate-600 font-sans font-medium">
                        {current.benefits.map((b, i) => (<li key={i} className="flex items-center gap-1.5 text-emerald-700">
                            <span className="size-1.5 bg-emerald-500 rounded-full"></span>
                            <span>{b}</span>
                          </li>))}
                      </ul>
                    </div>

                    {/* Preconfigured Meal items */}
                    <div className="space-y-2">
                      <h5 className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Sample Day Layout</h5>
                      <div className="space-y-1.5">
                        {current.meals.map((meal, idx) => (<div key={idx} className="flex justify-between items-center text-[10.5px] bg-white border border-slate-100/70 p-1.5 px-2.5 rounded-lg">
                            <span className="font-medium text-slate-750 truncate text-[10px]">{meal.name}</span>
                            <span className="text-[10px] font-mono font-bold text-slate-500 shrink-0">{meal.calories} kcal</span>
                          </div>))}
                      </div>
                    </div>
                  </div>
                </div>);
        })()}
          </div>

          {/* MEAL LOGGER INPUT */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs text-left">
            <h3 className="font-extrabold text-slate-900 text-sm mb-4">Daily Calorie Intake Recorder</h3>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Form Input (Cols 5) */}
              <form onSubmit={handleAddMeal} className="space-y-3.5 md:col-span-5">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Meal Title</label>
                  <input type="text" required placeholder="e.g., Lean Salmon Bowl..." value={customMealName} onChange={(e) => setCustomMealName(e.target.value)} className="w-full bg-slate-50 border border-slate-150 rounded-xl py-2 px-3 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs text-slate-700 font-sans"/>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Energy (kcal)</label>
                    <input type="number" required placeholder="e.g., 450" value={customMealCals} onChange={(e) => setCustomMealCals(e.target.value)} className="w-full bg-slate-50 border border-slate-150 rounded-xl py-2 px-3 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs text-slate-700 font-mono font-bold"/>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Type</label>
                    <select value={customMealType} onChange={(e) => setCustomMealType(e.target.value)} className="w-full bg-slate-50 border border-slate-150 rounded-xl py-2 px-2.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs text-slate-700 font-medium">
                      <option>Breakfast</option>
                      <option>Lunch</option>
                      <option>Dinner</option>
                      <option>Snack</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="w-full bg-[#16A34A] hover:bg-[#15803d] text-white py-2.5 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-green-600/15">
                  <Plus size={14}/> Log Meal (+20 XP)
                </button>
              </form>

              {/* Progress & Logged List (Cols 7) */}
              <div className="md:col-span-7 space-y-4">
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block">Current Intake</span>
                    <div className="text-xl font-black text-slate-900 font-mono">
                      {caloriesLogged} / <span className="text-slate-400 text-xs font-normal">{activeCalorieGoal} kcal</span>
                    </div>
                  </div>
                  <div className="size-11 rounded-full border-3 border-emerald-500 border-t-slate-200 animate-spin-slow flex items-center justify-center text-[10px] font-bold text-emerald-600">
                    {Math.round((caloriesLogged / activeCalorieGoal) * 100)}%
                  </div>
                </div>

                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {loggedMeals.map((meal) => (<div key={meal.id} className="bg-white border border-slate-100 p-2.5 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex gap-2.5 items-center">
                        <span className="size-7 rounded bg-green-50 text-green-700 font-bold text-[9px] flex items-center justify-center shrink-0">
                          {meal.type[0]}
                        </span>
                        <div className="text-left">
                          <h4 className="font-extrabold text-slate-800 text-[11px] leading-snug">{meal.name}</h4>
                          <span className="text-[9.5px] text-slate-400 block">{meal.type} • {meal.time}</span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-slate-600 text-[11px] shrink-0 bg-slate-50 px-2.5 py-1 rounded-lg">
                        {meal.calories} kcal
                      </span>
                    </div>))}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Side: Hydration, Workouts simulator (Cols 5) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* HYDRATION BOOSTER COUNTER */}
          <div className="bg-gradient-to-br from-cyan-950 via-slate-900 to-slate-950 text-white p-6 rounded-2xl relative overflow-hidden text-left border border-cyan-950 shadow-md">
            <div className="absolute -top-12 -right-12 size-32 bg-cyan-500/10 rounded-full blur-2xl"></div>
            <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-cyan-500/25 text-cyan-400 rounded-lg">
                  <Droplet size={18}/>
                </span>
                <div>
                  <h3 className="font-bold text-sm">Vital Hydration Lock</h3>
                  <p className="text-[10px] text-zinc-400">Aim for 8-10 mugs daily</p>
                </div>
              </div>
              <span className="text-[10px] bg-cyan-400/20 text-cyan-300 font-bold border border-cyan-400/30 px-2 py-0.5 rounded uppercase">
                💧 +15 XP
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <div className="space-y-0.5">
                <div className="text-3xl font-black font-mono flex items-baseline gap-1">
                  {waterCups} <span className="text-zinc-400 text-xs font-normal">/ 8 Glasses</span>
                </div>
                <p className="text-[10px] text-zinc-400 font-sans">
                  {waterCups >= 8 ? "🎉 Daily optimal target achieved!" : `${8 - waterCups} more needed to reach full health bonus!`}
                </p>
              </div>

              <button onClick={handleDrinkWater} disabled={waterCups >= 10} className="bg-cyan-500 hover:bg-cyan-400 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1 transition cursor-pointer shadow-md shadow-cyan-600/30 disabled:opacity-50 disabled:cursor-not-allowed text-ellipsis font-mono">
                +1 Glass
              </button>
            </div>

            {/* Glasses Visual block container */}
            <div className="flex justify-between gap-1.5 mt-4">
              {Array.from({ length: 8 }).map((_, idx) => (<div key={idx} className={`h-4 flex-1 rounded-full border transition-all duration-300 ${idx < waterCups
                ? "bg-cyan-500 border-cyan-400 shadow-sm"
                : "bg-white/5 border-white/10"}`}/>))}
            </div>
          </div>

          {/* DYNAMIC WORKOUT SIMULATOR PORTAL */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs text-left space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <Dumbbell className="text-green-600" size={18}/>
                  Active Muscular Quests
                </h3>
                <p className="text-[10.5px] text-slate-400">Launch exercise simulators to redeem training XP.</p>
              </div>
              <span className="text-[10px] bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded font-mono">
                Level 3 Req
              </span>
            </div>

            {/* List of active Workouts */}
            <div className="space-y-3">
              {workouts.map((w) => (<div key={w.id} className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100/50 rounded-xl p-3 flex flex-col justify-between gap-3 text-left">
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5 max-w-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] bg-slate-200 text-slate-600 font-bold px-1.5 py-0.2 rounded uppercase">
                          {w.level}
                        </span>
                        <h4 className="font-extrabold text-slate-800 text-[11.5px] leading-snug">{w.name}</h4>
                      </div>
                      <p className="text-[10px] text-slate-400 font-sans leading-normal">{w.description}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-emerald-600 font-bold font-mono uppercase bg-emerald-50 px-2 py-0.5 rounded block">
                        +{w.xp} XP
                      </span>
                      <span className="text-[9.5px] text-amber-600 block mt-0.5 font-bold">
                        🪙 +{w.coins} Coins
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-100/30">
                    <span className="text-[10px] text-slate-400 font-medium font-sans">⏱ Duration: {w.duration}</span>
                    <button onClick={() => startWorkoutSimulator(w)} disabled={workoutTimerRunning} className="bg-slate-900 hover:bg-emerald-600 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer disabled:opacity-50">
                      <Play size={10} className="fill-white"/> Start Exercise
                    </button>
                  </div>
                </div>))}
            </div>

            {/* Simulated Countdown Banner */}
            <AnimatePresence>
              {activeWorkout && (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-[#0B2E1E] border border-emerald-800 text-white p-4 rounded-xl space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
                    <Footprints size={80}/>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-[#4ADE80] font-bold uppercase tracking-widest block">Active Session</span>
                      <h4 className="font-black text-xs text-white truncate max-w-[200px]">{activeWorkout}</h4>
                    </div>
                    {workoutTimerRunning ? (<span className="font-mono text-xs text-amber-400 font-extrabold animate-pulse">
                        ⏱ {workoutTimer}s remaining
                      </span>) : (<span className="text-xs text-emerald-400 font-extrabold">Complete!</span>)}
                  </div>

                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#4ADE80] h-full rounded-full transition-all duration-300" style={{ width: `${workoutProgress}%` }}/>
                  </div>

                  <p className="text-[9.5px] text-zinc-400 italic">
                    {workoutTimerRunning ? "💦 Simulating physical kinetic activity... keep posture aligned!" : "💪 Finished! Your workout telemetry was fully secure synced."}
                  </p>
                </motion.div>)}
            </AnimatePresence>

            {/* Congratulations splash modal popup simulation */}
            <AnimatePresence>
              {showFinishSplash && (<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-amber-50/90 border border-amber-200 p-4 rounded-xl text-center space-y-2 relative">
                  <span className="absolute top-2 right-2 cursor-pointer text-amber-500 hover:text-amber-700 text-xs font-bold" onClick={() => setShowFinishSplash(false)}>✕</span>
                  <div className="size-10 rounded-full bg-amber-500/25 mx-auto flex items-center justify-center text-amber-700 font-black">
                    🏆
                  </div>
                  <h4 className="font-black text-xs text-amber-900 uppercase">Training Completed !</h4>
                  <p className="text-[10.5px] text-amber-800 leading-normal font-sans">
                    Congratulations! Your heart kinetics logged successfully. Rewards have been synced to your Level Chest.
                  </p>
                </motion.div>)}
            </AnimatePresence>

          </div>

        </div>

      </div>

    </div>);
}
