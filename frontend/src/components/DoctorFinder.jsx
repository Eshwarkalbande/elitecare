import React, { useState, useEffect } from "react";
import { Search, Star, Calendar, CheckCircle, UserSquare2, DollarSign, ChevronLeft, ChevronRight, X, Award } from "lucide-react";
import { DOCTORS } from "../mockData";
const CAROUSEL_SLIDES = [
    {
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200",
        title: "EliteCare Specialist Networks",
        tagline: "Unparalleled access to double-boarded clinical experts across multiple advanced care streams.",
    },
    {
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200",
        title: "Compassionate Collaborative Care",
        tagline: "Bridging the gap between active inpatient clinical units and digital health locker networks.",
    },
    {
        image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=1200",
        title: "AI-Powered Real-Time Diagnosis",
        tagline: "Get automated health mapping and matching with relevant doctors using our premium Symptom scan.",
    },
    {
        image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200",
        title: "State-of-the-Art Consultation Room",
        tagline: "Experience highly secured consultations in premium high-definition telemedicine suites.",
    }
];
export default function DoctorFinder({ onBookAppointment, preSelectedDoctor, clearPreSelectedDoctor, onNavigateToDashboard, doctors, }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSpecialty, setSelectedSpecialty] = useState("All");
    const [bookingDoctor, setBookingDoctor] = useState(preSelectedDoctor || null);
    // Carousel Slide State
    const [currentSlide, setCurrentSlide] = useState(0);
    // Auto rotate the slides every 5.5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
        }, 5500);
        return () => clearInterval(timer);
    }, []);
    // Booking Form States
    const [bookingDate, setBookingDate] = useState("2026-06-18");
    const [bookingTime, setBookingTime] = useState("10:00 AM");
    const [patientName, setPatientName] = useState("John Doe");
    const [isSuccess, setIsSuccess] = useState(false);
    // Detailed Modal States
    const [selectedDetailDoctor, setSelectedDetailDoctor] = useState(null);
    const [calendarSelectedDate, setCalendarSelectedDate] = useState("");
    const [calendarSelectedTime, setCalendarSelectedTime] = useState("");
    const handleViewDetails = (doc) => {
        setSelectedDetailDoctor(doc);
        if (doc.calendarSlots && doc.calendarSlots.length > 0) {
            setCalendarSelectedDate(doc.calendarSlots[0].date);
            setCalendarSelectedTime(doc.calendarSlots[0].times[0] || "10:00 AM");
        }
        else {
            setCalendarSelectedDate("2026-06-18");
            setCalendarSelectedTime("10:00 AM");
        }
    };
    const specialties = ["All", "Cardiologist", "Neurologist", "Dermatologist", "Pediatrician", "Orthopedic", "Gynecologist", "Eye Specialist", "Gastroenterologist", "Oncologist", "Pulmonologist"];
    // Filter doctors based on inputs
    const doctorsListToFilter = doctors || DOCTORS;
    const filteredDoctors = doctorsListToFilter.filter((doc) => {
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.specialization.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSpecialty = selectedSpecialty === "All" || doc.specialization === selectedSpecialty;
        return matchesSearch && matchesSpecialty;
    });
    const timeSlots = ["09:00 AM", "10:00 AM", "10:30 AM", "11:30 AM", "01:00 PM", "02:15 PM", "03:30 PM", "04:00 PM"];
    const handleBookingSubmit = (e) => {
        e.preventDefault();
        if (!bookingDoctor)
            return;
        const fee = bookingDoctor.specialization === "Cardiologist" ? "$120" :
            bookingDoctor.specialization === "Neurologist" ? "$115" :
                bookingDoctor.specialization === "Pediatrician" ? "$85" :
                    bookingDoctor.specialization === "Dermatologist" ? "$95" : "$90";
        const newApt = {
            id: "apt-" + Date.now(),
            doctorName: bookingDoctor.name,
            specialization: bookingDoctor.specialization,
            date: bookingDate,
            time: bookingTime,
            patientName: patientName.trim() || "John Doe",
            status: "Scheduled",
            fee,
        };
        onBookAppointment(newApt);
        setIsSuccess(true);
        setTimeout(() => {
            setIsSuccess(false);
            setBookingDoctor(null);
            clearPreSelectedDoctor();
            onNavigateToDashboard(); // Immediately show it in the SaaS Dashboard! Excellent flow.
        }, 2200);
    };
    const selectDoctorForBooking = (doc) => {
        setBookingDoctor(doc);
        setIsSuccess(false);
    };
    return (<div className="w-full max-w-7xl mx-auto p-3" id="doctor-finder-ui">
      
      {/* If detailed modal is open */}
      {selectedDetailDoctor && (<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-155 flex flex-col max-h-[90vh] my-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-emerald-800 to-green-700 p-6 text-white relative flex justify-between items-center shrink-0">
              <div className="space-y-1">
                <span className="text-[9px] bg-emerald-600/40 text-emerald-100 font-extrabold tracking-widest uppercase px-2.5 py-0.5 rounded border border-emerald-500/20">
                  Detailed Medical Portfolio
                </span>
                <h3 className="text-xl font-extrabold tracking-tight">Doctor Profile & Schedule</h3>
              </div>
              <button type="button" onClick={() => setSelectedDetailDoctor(null)} className="size-9 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition cursor-pointer border border-white/10" title="Close Profile">
                <X size={16}/>
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              
              {/* Profile Card Intro Grid */}
              <div className="flex flex-col sm:flex-row gap-5 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <img src={selectedDetailDoctor.image} alt={selectedDetailDoctor.name} className="size-24 sm:size-28 rounded-2xl object-cover shadow-sm border border-gray-250 self-center sm:self-start bg-white shrink-0"/>
                <div className="flex-grow text-center sm:text-left space-y-2">
                  <div>
                    <span className="text-[10px] bg-green-50 text-green-700 font-extrabold px-2.5 py-1 rounded inline-block">
                      {selectedDetailDoctor.specialization}
                    </span>
                    <h4 className="text-lg font-black text-slate-900 mt-1">{selectedDetailDoctor.name}</h4>
                    <p className="text-xs text-gray-400 font-medium">{selectedDetailDoctor.experience} ({selectedDetailDoctor.location})</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs pt-1">
                    <div className="flex items-center gap-1 text-slate-800">
                      <Star className="text-amber-400 fill-amber-400" size={14}/>
                      <span className="font-extrabold">{selectedDetailDoctor.rating}</span>
                      <span className="text-gray-400 text-[11px]">(48 reviews)</span>
                    </div>
                    <div className="h-4 w-px bg-gray-200"></div>
                    <div className="flex items-center gap-1 text-slate-800 font-medium">
                      <DollarSign size={14} className="text-green-600"/>
                      <span>
                        {selectedDetailDoctor.specialization === "Cardiologist" ? "$120" :
                selectedDetailDoctor.specialization === "Neurologist" ? "$115" :
                    selectedDetailDoctor.specialization === "Pediatrician" ? "$85" :
                        selectedDetailDoctor.specialization === "Dermatologist" ? "$95" : "$90"} / consult
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio block */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Expert Bio & Background</h4>
                <p className="text-xs text-gray-600 leading-relaxed font-sans">
                  {selectedDetailDoctor.bio} Dr. {selectedDetailDoctor.name.replace("Dr. ", "")} is recognized as an exceptionally detail-oriented practitioner, bringing state-of-the-art diagnostic paradigms to their clinic and participating in local healthcare innovation groups.
                </p>
              </div>

              {/* Certifications and credentials */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Clinical Board Certifications</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {(selectedDetailDoctor.certifications || [
                "Board Certified Specialist in Advanced Care Diagnostics",
                "Licensed Clinical Advisor for EliteCare General Network",
                "Fellow of the Joint Practitioner Academy of Therapeutics"
            ]).map((cert, index) => (<div key={index} className="flex gap-2.5 p-3 rounded-lg border border-gray-100 bg-emerald-50/20 text-xs">
                      <Award size={14} className="text-green-600 shrink-0 mt-0.5"/>
                      <span className="text-slate-800 font-sans font-medium">{cert}</span>
                    </div>))}
                </div>
              </div>

              {/* Interactive Calendar Slots Grid */}
              <div className="space-y-4 pt-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Interactive Consultation Calendar</h4>
                  <span className="text-[10px] text-gray-400 font-bold">Select Date & Time Slot</span>
                </div>

                {/* Day selector tabs */}
                <div className="grid grid-cols-3 gap-2">
                  {(selectedDetailDoctor.calendarSlots && selectedDetailDoctor.calendarSlots.length > 0
                ? selectedDetailDoctor.calendarSlots
                : [
                    { date: "2026-06-18", times: ["09:00 AM", "10:30 AM", "01:00 PM", "03:30 PM"] },
                    { date: "2026-06-19", times: ["10:00 AM", "11:30 AM", "02:15 PM", "04:00 PM"] },
                    { date: "2026-06-20", times: ["09:00 AM", "12:00 PM", "02:15 PM", "04:30 PM"] }
                ]).map((slot) => {
                const parsedDate = new Date(slot.date);
                const formattedDayName = parsedDate.toLocaleDateString("en-US", { weekday: "short" });
                const formattedDateStr = parsedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                return (<button key={slot.date} type="button" onClick={() => {
                        setCalendarSelectedDate(slot.date);
                        setCalendarSelectedTime(slot.times[0] || "10:00 AM");
                    }} className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-0.5 ${calendarSelectedDate === slot.date
                        ? "bg-green-600 border-transparent text-white shadow-md shadow-green-600/10"
                        : "bg-white border-gray-200 text-slate-800 hover:bg-gray-50"}`}>
                        <span className="text-[10px] uppercase font-extrabold tracking-wider">{formattedDayName}</span>
                        <span className="text-xs font-black">{formattedDateStr}</span>
                        <span className="text-[9px] font-medium opacity-80">{slot.times.length} slots</span>
                      </button>);
            })}
                </div>

                {/* Selected Date's Hours Grid */}
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 font-bold block">Available Hours for Class:</span>
                  <div className="grid grid-cols-4 gap-2">
                    {((selectedDetailDoctor.calendarSlots || [
                { date: "2026-06-18", times: ["09:00 AM", "10:30 AM", "01:00 PM", "03:30 PM"] },
                { date: "2026-06-19", times: ["10:00 AM", "11:30 AM", "02:15 PM", "04:00 PM"] },
                { date: "10:30 AM", times: ["09:00 AM", "12:00 PM", "02:15 PM", "04:30 PM"] }
            ]).find((slot) => slot.date === calendarSelectedDate)?.times || [
                "09:00 AM", "10:00 AM", "10:30 AM", "11:30 AM", "01:00 PM", "02:15 PM", "03:30 PM"
            ]).map((time) => (<button key={time} type="button" onClick={() => setCalendarSelectedTime(time)} className={`py-2 text-[11px] font-bold rounded-lg border text-center transition cursor-pointer ${calendarSelectedTime === time
                    ? "bg-green-600 border-transparent text-white"
                    : "bg-slate-50 border-gray-150 text-slate-700 hover:bg-gray-100"}`}>
                        {time}
                      </button>))}
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer Area */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3 shrink-0">
              <button type="button" onClick={() => setSelectedDetailDoctor(null)} className="w-1/3 py-3 border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-bold cursor-pointer">
                Close Profile
              </button>
              <button type="button" onClick={() => {
                setBookingDate(calendarSelectedDate || "2026-06-18");
                setBookingTime(calendarSelectedTime || "10:00 AM");
                setBookingDoctor(selectedDetailDoctor);
                setSelectedDetailDoctor(null);
            }} disabled={!calendarSelectedDate || !calendarSelectedTime} className="w-2/3 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-md shadow-green-600/20 scroll-pt-5 disabled:opacity-50 cursor-pointer">
                Confirm & Request This Slot
              </button>
            </div>
          </div>
        </div>)}

      {/* If booking modal is open */}
      {bookingDoctor && (<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal header banner */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white text-center relative">
              <h3 className="text-xl font-bold">Secure Appointment Scheduling</h3>
              <p className="text-xs text-emerald-100 mt-1">Select date and hours to confirm slot reservation.</p>
            </div>

            {isSuccess ? (<div className="p-8 text-center space-y-4 flex flex-col items-center">
                <div className="size-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center animate-bounce">
                  <CheckCircle size={32}/>
                </div>
                <h4 className="text-lg font-bold text-gray-800">Reservation Completed!</h4>
                <p className="text-xs text-gray-500 max-w-sm">
                  Your appointment with <span className="font-semibold text-gray-800">{bookingDoctor.name}</span> has been securely recorded. You are being redirected to your Patient Dashboard.
                </p>
              </div>) : (<form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
                {/* Micro doctor card */}
                <div className="flex gap-4 p-3 bg-gray-50 border border-gray-150 rounded-xl">
                  <img src={bookingDoctor.image} alt={bookingDoctor.name} className="size-12 rounded-lg object-cover"/>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">{bookingDoctor.name}</h4>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold uppercase mt-1 inline-block">
                      {bookingDoctor.specialization}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-0.5">{bookingDoctor.location}</p>
                  </div>
                </div>

                {/* Form fields */}
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                      Consultation Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14}/>
                      <input type="date" required className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-green-500" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)}/>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                      Select Available Slot
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {timeSlots.map((slot) => (<button key={slot} type="button" onClick={() => setBookingTime(slot)} className={`py-1.5 text-[10px] font-bold rounded-lg transition-colors border ${bookingTime === slot
                        ? "bg-green-600 text-white border-transparent"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`}>
                          {slot}
                        </button>))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                      Patient Full Name
                    </label>
                    <div className="relative">
                      <UserSquare2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14}/>
                      <input type="text" placeholder="John Doe" className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-green-500" value={patientName} onChange={(e) => setPatientName(e.target.value)}/>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg flex justify-between items-center text-xs">
                    <span className="text-gray-500">Intake / consultation fees:</span>
                    <span className="font-bold text-slate-900 font-mono">
                      {bookingDoctor.specialization === "Cardiologist" ? "$120" :
                    bookingDoctor.specialization === "Neurologist" ? "$115" :
                        bookingDoctor.specialization === "Pediatrician" ? "$85" :
                            bookingDoctor.specialization === "Dermatologist" ? "$95" : "$90"}
                    </span>
                  </div>
                </div>

                {/* Confirm actions */}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => {
                    setBookingDoctor(null);
                    clearPreSelectedDoctor();
                }} className="w-1/3 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="w-2/3 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-green-600/20 cursor-pointer">
                    Complete Booking
                  </button>
                </div>
              </form>)}
          </div>
        </div>)}

      {/* Main Doctor finder viewport */}
      <div className="space-y-6">
        
        {/* Premium Promotional Carousel of 4 Images */}
        <div className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 h-80 sm:h-[420px] lg:h-[500px] overflow-hidden shadow-sm border-y border-gray-100 group bg-slate-900">
          {/* Carousel Tracks */}
          <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {CAROUSEL_SLIDES.map((slide, idx) => (<div key={idx} className="w-full h-full relative shrink-0">
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover brightness-[0.45]" referrerPolicy="no-referrer"/>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent"></div>
                {/* Text Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white space-y-2 max-w-2xl">
                  <span className="text-[9px] bg-green-600 text-white font-bold tracking-widest uppercase px-2.5 py-1 rounded inline-block">
                    EliteCare Highlights & Features
                  </span>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
                    {slide.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-sans max-w-lg">
                    {slide.tagline}
                  </p>
                </div>
              </div>))}
          </div>

          {/* Bullet Indicators */}
          <div className="absolute bottom-4 right-6 flex gap-1.5 z-10">
            {CAROUSEL_SLIDES.map((_, idx) => (<button key={idx} type="button" onClick={() => setCurrentSlide(idx)} className={`size-2.5 rounded-full transition-all cursor-pointer ${currentSlide === idx ? "bg-green-500 w-6" : "bg-white/40 hover:bg-white/75"}`} title={`Go to slide ${idx + 1}`}/>))}
          </div>

          {/* Left Arrow Button */}
          <button type="button" onClick={() => setCurrentSlide((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length)} className="absolute left-4 top-1/2 -translate-y-1/2 size-10 rounded-full bg-slate-900/45 backdrop-blur-sm hover:bg-slate-900/75 text-white/80 hover:text-white flex items-center justify-center border border-white/10 transition duration-150 opacity-0 group-hover:opacity-100 z-10 cursor-pointer" title="Previous Highlight">
            <ChevronLeft size={18}/>
          </button>

          {/* Right Arrow Button */}
          <button type="button" onClick={() => setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length)} className="absolute right-4 top-1/2 -translate-y-1/2 size-10 rounded-full bg-slate-900/45 backdrop-blur-sm hover:bg-slate-900/75 text-white/80 hover:text-white flex items-center justify-center border border-white/10 transition duration-150 opacity-0 group-hover:opacity-100 z-10 cursor-pointer" title="Next Highlight">
            <ChevronRight size={18}/>
          </button>
        </div>

        {/* Top Controls Banner */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
            <input id="doctor-search" name="searchQuery" type="text" aria-label="Search doctors by name or specialization" placeholder="Search doctor name or specialization..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-xs shadow-inner" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
          </div>

          <div className="flex flex-wrap gap-1.5 w-full md:w-auto overflow-x-auto">
            {specialties.map((spec) => (<button key={spec} onClick={() => setSelectedSpecialty(spec)} className={`py-1.5 px-4 text-xs font-semibold rounded-full border transition cursor-pointer shrink-0 ${selectedSpecialty === spec
                ? "bg-green-600 text-white border-transparent"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>
                {spec}
              </button>))}
          </div>
        </div>

        {/* Catalog grid */}
        {filteredDoctors.length === 0 ? (<div className="text-center py-24 bg-white border border-gray-100 rounded-2xl">
            <UserSquare2 size={48} className="mx-auto text-gray-300 mb-3"/>
            <h4 className="font-bold text-gray-700 text-sm">No Match Found</h4>
            <p className="text-xs text-gray-400 mt-1">Try clarifying keywords or selecting alternative specialties.</p>
          </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => (<div key={doc.id} onClick={() => handleViewDetails(doc)} className="bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:scale-[1.02] transition-all duration-350 ease-out overflow-hidden flex flex-col justify-between cursor-pointer group hover:border-emerald-300" title="Click to view full bio, qualifications & live calendar">
                <div>
                  {/* Avatar wrapper */}
                  <div className="relative h-48 bg-gray-50 overflow-hidden">
                    <img src={doc.image} alt={doc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                    <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm shadow-sm rounded-lg px-2.5 py-1 flex items-center gap-1">
                      <Star className="text-amber-400 fill-amber-400" size={12}/>
                      <span className="text-[11px] font-bold text-gray-850">{doc.rating}</span>
                    </span>
                    <span className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-xs text-white text-[9px] px-2 py-0.5 rounded font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Click for Biography
                    </span>
                  </div>

                  <div className="p-5 space-y-3 text-left">
                    <div>
                      <span className="text-[10px] text-green-700 bg-green-50 font-bold px-2.5 py-0.5 rounded-full inline-block">
                        {doc.specialization}
                      </span>
                      <h4 className="font-extrabold text-slate-900 mt-2 text-sm group-hover:text-green-600 transition-colors">
                        {doc.name}
                      </h4>
                      <p className="text-xs text-gray-400 mt-0.5 font-medium">{doc.experience}</p>
                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed font-sans line-clamp-3">
                      {doc.bio}
                    </p>

                    <div className="border-t border-gray-50 pt-3">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block w-full mb-1">
                        Active Consult Days:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {doc.availability.map((day) => (<span key={day} className="text-[9px] bg-slate-50 text-slate-600 px-2.5 py-1 rounded-md font-bold border border-slate-100">
                            {day}
                          </span>))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button onClick={(e) => {
                    e.stopPropagation();
                    selectDoctorForBooking(doc);
                }} className="w-full bg-slate-950 font-semibold text-white text-xs py-2.5 rounded-xl hover:bg-green-600 transition flex items-center justify-center gap-1 cursor-pointer shadow-sm group-hover:bg-green-600">
                    <Calendar size={13}/>
                    <span>View Calendar & Book</span>
                  </button>
                </div>
              </div>))}
          </div>)}

      </div>
    </div>);
}
