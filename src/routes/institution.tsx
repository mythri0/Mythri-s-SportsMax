import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import {
  GraduationCap,
  School,
  Building,
  UserCheck,
  Award,
  Video,
  FileSpreadsheet,
  TrendingUp,
  Activity,
  Users,
  Search,
  Upload,
  Calendar,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  BarChart2,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageIntro, MetricCard, SectionHead, DemoBadge } from "@/components/sports-ui";
import { SportVideoSubmission } from "@/components/sport-video-submission";

export const Route = createFileRoute("/institution")({
  head: () => ({
    meta: [
      { title: "Institution Intelligence Hub (School & College) — SportsMax" },
      {
        name: "description",
        content:
          "Institutional sports hierarchy connecting schools, universities, coaches, and student athletes with video AI telemetry and individual analytics dashboards.",
      },
    ],
  }),
  component: InstitutionHubPage,
});

// Mock database of institutional student analytics
interface StudentRecord {
  id: string;
  name: string;
  institutionType: "School" | "College";
  institutionName: string;
  gradeOrYear: string;
  sport: string;
  coach: string;
  sessions: number;
  avgPaceOrSpeed: string;
  workloadScore: number;
  progressPercent: string;
  topMetric: string;
  status: "Active" | "Improving" | "Needs Rest";
}

const INITIAL_STUDENTS: StudentRecord[] = [
  {
    id: "stu_1",
    name: "Aiden Vance",
    institutionType: "School",
    institutionName: "Oakridge High School",
    gradeOrYear: "Grade 11",
    sport: "Football",
    coach: "Coach David Miller",
    sessions: 42,
    avgPaceOrSpeed: "28.4 km/h max",
    workloadScore: 88,
    progressPercent: "+14.2%",
    topMetric: "92% Pass Completion in Final 3rd",
    status: "Improving",
  },
  {
    id: "stu_2",
    name: "Maya Chen",
    institutionType: "College",
    institutionName: "Stanford University Sports Academy",
    gradeOrYear: "Sophomore (Yr 2)",
    sport: "Athletics / Running",
    coach: "Coach Sarah Lin",
    sessions: 58,
    avgPaceOrSpeed: "4:08 min/km",
    workloadScore: 94,
    progressPercent: "+18.5%",
    topMetric: "VO2 Max 62.4 mL/kg/min",
    status: "Active",
  },
  {
    id: "stu_3",
    name: "Rohan Verma",
    institutionType: "School",
    institutionName: "St. Xavier's Athletic School",
    gradeOrYear: "Grade 12",
    sport: "Cricket",
    coach: "Coach Vikram Rathore",
    sessions: 36,
    avgPaceOrSpeed: "138 km/h bowling release",
    workloadScore: 78,
    progressPercent: "+9.1%",
    topMetric: "Economy rate 4.2 in Powerplay",
    status: "Active",
  },
  {
    id: "stu_4",
    name: "Elena Rostova",
    institutionType: "College",
    institutionName: "Oxford Sports Institute",
    gradeOrYear: "Senior (Yr 4)",
    sport: "Swimming",
    coach: "Coach Liam Davies",
    sessions: 64,
    avgPaceOrSpeed: "1:02.4 / 100m Free",
    workloadScore: 91,
    progressPercent: "+11.8%",
    topMetric: "Stroke turn velocity +0.4m/s",
    status: "Active",
  },
  {
    id: "stu_5",
    name: "Marcus Thorne",
    institutionType: "School",
    institutionName: "Oakridge High School",
    gradeOrYear: "Grade 10",
    sport: "Basketball",
    coach: "Coach David Miller",
    sessions: 31,
    avgPaceOrSpeed: "78 cm vertical leap",
    workloadScore: 82,
    progressPercent: "+16.0%",
    topMetric: "48% True Shooting %",
    status: "Improving",
  },
  {
    id: "stu_6",
    name: "Sophie Bennett",
    institutionType: "College",
    institutionName: "Stanford University Sports Academy",
    gradeOrYear: "Junior (Yr 3)",
    sport: "Hockey",
    coach: "Coach Liam Davies",
    sessions: 49,
    avgPaceOrSpeed: "26.1 km/h sprint",
    workloadScore: 68,
    progressPercent: "+7.4%",
    topMetric: "Interception win rate 74%",
    status: "Needs Rest",
  },
];

export function InstitutionHubPage() {
  const [institutionFilter, setInstitutionFilter] = useState<"All" | "School" | "College">("All");
  const [hierarchyRole, setHierarchyRole] = useState<"All" | "Coach" | "Student">("All");
  const [selectedSport, setSelectedSport] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(INITIAL_STUDENTS[0] ?? null);

  // Video submissions stored in localStorage
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("smx_video_submissions") || "[]");
      setSubmissions(data);
    } catch {
      setSubmissions([]);
    }
  }, []);

  const filteredStudents = INITIAL_STUDENTS.filter((st) => {
    const matchType = institutionFilter === "All" || st.institutionType === institutionFilter;
    const matchSport = selectedSport === "All" || st.sport.toLowerCase().includes(selectedSport.toLowerCase());
    const matchQuery =
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.coach.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSport && matchQuery;
  });

  return (
    <>
      <PageIntro
        eyebrow="Educational Sports Intelligence"
        title="Institution Hierarchy: Schools & Colleges"
        text="Unified telemetry hierarchy bridging Academic Institutions, Coaches, and Student Athletes. Streamline video footage uploads, tactical forms, and granular individual athletic analytics."
        action={
          <div className="flex flex-col items-end gap-2">
            <DemoBadge />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <GraduationCap className="h-4 w-4 text-primary" />
              <span>Multi-Tier Academic Portal</span>
            </div>
          </div>
        }
      />

      <section className="py-12 bg-background">
        <div className="content-wrap space-y-12">
          {/* Top Hierarchy Navigation Banner */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5 mb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Structural Hierarchy
                </span>
                <h2 className="text-xl font-extrabold text-foreground mt-0.5">
                  Select Institutional Entity Level
                </h2>
                <p className="text-xs text-muted-foreground">
                  Navigate between Academic Tiers (School vs College) and Roles (Coach vs Student).
                </p>
              </div>

              {/* Institution Type Filter */}
              <div className="flex items-center gap-2">
                <Button
                  variant={institutionFilter === "All" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setInstitutionFilter("All")}
                  className="text-xs"
                >
                  <Building className="h-3.5 w-3.5 mr-1" /> All Institutions
                </Button>
                <Button
                  variant={institutionFilter === "School" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setInstitutionFilter("School")}
                  className="text-xs"
                >
                  <School className="h-3.5 w-3.5 mr-1" /> Schools
                </Button>
                <Button
                  variant={institutionFilter === "College" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setInstitutionFilter("College")}
                  className="text-xs"
                >
                  <GraduationCap className="h-3.5 w-3.5 mr-1" /> Colleges & Universities
                </Button>
              </div>
            </div>

            {/* Hierarchy Tree Visualization */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-border bg-secondary/30 p-4">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase mb-1">
                  <Building className="h-4 w-4" /> Tier 1: Institution
                </div>
                <div className="text-sm font-bold text-foreground">Schools & Colleges</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Campus-wide program oversight, equipment inventory & multi-sport rosters.
                </div>
              </div>

              <div className="rounded-xl border border-border bg-secondary/30 p-4">
                <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase mb-1">
                  <UserCheck className="h-4 w-4" /> Tier 2: Coaches
                </div>
                <div className="text-sm font-bold text-foreground">Coaching Staff</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Upload match videos, fill tactical drills, manage workloads & tag performance.
                </div>
              </div>

              <div className="rounded-xl border border-border bg-secondary/30 p-4">
                <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase mb-1">
                  <Award className="h-4 w-4" /> Tier 3: Students
                </div>
                <div className="text-sm font-bold text-foreground">Student Athletes</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Individual analytics dashboard, progress trajectory, speed & stamina telemetry.
                </div>
              </div>

              <div className="rounded-xl border border-border bg-secondary/30 p-4">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase mb-1">
                  <Video className="h-4 w-4" /> Ingestion Layer
                </div>
                <div className="text-sm font-bold text-foreground">Video & Tactical Forms</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Optical kinematic engine translates footage into verifiable student analytics.
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 1: COACH PORTAL (Video Upload & Drill Forms) */}
          <div id="coach-upload-section" className="space-y-4">
            <SectionHead
              eyebrow="Tier 2 · Coach Management"
              title="Coach Portal: Upload Video & Tactical Evaluation Forms"
              text="For high school coaches and collegiate directors: upload practice/game recordings, submit tactical drills, and dispatch feedback to student athlete dashboards."
            />

            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <SportVideoSubmission
                  sportName="Institutional Multi-Sport"
                  category={institutionFilter === "All" ? "School & College" : institutionFilter}
                  defaultDrill="Match Telemetry & Tactical Drill Session"
                  onSuccess={() => {
                    const data = JSON.parse(localStorage.getItem("smx_video_submissions") || "[]");
                    setSubmissions(data);
                  }}
                />
              </div>

              {/* Coach Guidelines & Recent Ingested Videos */}
              <div className="space-y-5">
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
                    <Video className="h-4 w-4 text-primary" /> Recent Uploaded Footage
                  </h4>
                  {submissions.length === 0 ? (
                    <div className="text-center py-6 text-xs text-muted-foreground">
                      No video uploads recorded in this browser session yet. Upload a video to see real-time optical queue status.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {submissions.slice(0, 4).map((sub) => (
                        <div
                          key={sub.id}
                          className="rounded-lg border border-border bg-secondary/40 p-3 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between font-bold text-foreground">
                            <span className="truncate max-w-[160px]">{sub.fileName}</span>
                            <span className="text-[10px] text-emerald-500 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                              Ingested
                            </span>
                          </div>
                          <div className="text-muted-foreground">
                            Coach: {sub.name} · {sub.sportName}
                          </div>
                          <div className="text-[10px] text-primary font-mono">
                            {sub.drillType} ({sub.fileSize})
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-accent" /> Coach AI Workflow
                  </h4>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      Upload footage taken from tactical sideline or high-angle cameras.
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      Specify drill parameters (sprints, formations, set-pieces, swimming turns).
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      Optical AI synchronizes individual athlete metrics directly to student profiles below.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: STUDENT ATHLETE ANALYTICS DASHBOARD */}
          <div id="student-analytics-section" className="space-y-6">
            <SectionHead
              eyebrow="Tier 3 · Student Analytics"
              title="Student Athlete Analytics Dashboard"
              text="Comprehensive performance dashboards for school and college student athletes. Track speed progression, training workload ratios, attendance, and coach feedback."
              action={
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search student, school, coach..."
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    className="w-56 text-xs bg-card"
                  />
                </div>
              }
            />

            {/* Filter pills */}
            <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
              <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mr-2">
                <Filter className="h-3.5 w-3.5" /> Filter Sport:
              </span>
              {["All", "Football", "Athletics", "Cricket", "Swimming", "Basketball", "Hockey"].map(
                (sp) => (
                  <button
                    key={sp}
                    type="button"
                    onClick={() => setSelectedSport(sp)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      selectedSport === sp
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {sp}
                  </button>
                )
              )}
            </div>

            {/* Two-Column Interactive Student Dashboard */}
            <div className="grid gap-8 lg:grid-cols-12">
              {/* Left Column: Student Roster List */}
              <div className="lg:col-span-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Enrolled Students ({filteredStudents.length})
                </h4>

                <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
                  {filteredStudents.map((st) => {
                    const isSelected = selectedStudent?.id === st.id;
                    return (
                      <div
                        key={st.id}
                        onClick={() => setSelectedStudent(st)}
                        className={`cursor-pointer rounded-xl border p-4 transition ${
                          isSelected
                            ? "border-primary bg-primary/10 shadow-md"
                            : "border-border bg-card hover:bg-secondary/50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                              {st.name}
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                  st.institutionType === "College"
                                    ? "bg-purple-500/20 text-purple-400"
                                    : "bg-blue-500/20 text-blue-400"
                                }`}
                              >
                                {st.institutionType}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {st.institutionName} · {st.gradeOrYear}
                            </div>
                          </div>
                          <span className="text-xs font-bold text-primary font-mono">
                            {st.progressPercent}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-xs border-t border-border/60 pt-2 text-muted-foreground">
                          <span>Sport: <strong className="text-foreground">{st.sport}</strong></span>
                          <span>Coach: {st.coach}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Selected Student's Granular Analytics Dashboard */}
              <div className="lg:col-span-7">
                {selectedStudent ? (
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-extrabold text-foreground">
                            {selectedStudent.name}
                          </h3>
                          <span className="rounded-full bg-emerald-500/15 text-emerald-500 px-2 py-0.5 text-xs font-bold">
                            {selectedStudent.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {selectedStudent.institutionName} ({selectedStudent.institutionType}) · {selectedStudent.gradeOrYear}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-semibold text-muted-foreground">Assigned Coach</div>
                        <div className="text-sm font-bold text-primary">{selectedStudent.coach}</div>
                      </div>
                    </div>

                    {/* KPI Metric Cards Grid */}
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-xl border border-border bg-secondary/30 p-4">
                        <div className="text-xs text-muted-foreground font-semibold">Total Sessions</div>
                        <div className="text-2xl font-black text-foreground mt-1">
                          {selectedStudent.sessions}
                        </div>
                        <div className="text-[11px] text-emerald-500 font-medium mt-0.5">
                          98% Attendance
                        </div>
                      </div>

                      <div className="rounded-xl border border-border bg-secondary/30 p-4">
                        <div className="text-xs text-muted-foreground font-semibold">Peak Speed / Pace</div>
                        <div className="text-lg font-black text-foreground mt-1">
                          {selectedStudent.avgPaceOrSpeed}
                        </div>
                        <div className="text-[11px] text-primary font-medium mt-0.5">
                          Sensor Verified
                        </div>
                      </div>

                      <div className="rounded-xl border border-border bg-secondary/30 p-4">
                        <div className="text-xs text-muted-foreground font-semibold">Workload Score</div>
                        <div className="text-2xl font-black text-accent mt-1">
                          {selectedStudent.workloadScore} <span className="text-xs text-muted-foreground">/100</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          ACWR Balance: 1.12
                        </div>
                      </div>
                    </div>

                    {/* Top Tactical Highlight */}
                    <div className="rounded-xl border border-primary/20 bg-primary/10 p-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase">
                        <Sparkles className="h-4 w-4" /> AI Key Performance Highlight
                      </div>
                      <div className="text-sm font-bold text-foreground mt-1">
                        {selectedStudent.topMetric}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Extracted across last 6 match video recordings and GPS vest tracking.
                      </div>
                    </div>

                    {/* Weekly Performance Progression Simulation */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center justify-between">
                        <span>Biomechanical & Skill Trajectory</span>
                        <span className="text-emerald-500 font-bold">{selectedStudent.progressPercent} Improvement</span>
                      </h4>

                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span className="text-foreground">Technical Skill Precision</span>
                            <span className="text-primary">88%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                            <div className="h-full rounded-full bg-primary" style={{ width: "88%" }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span className="text-foreground">Tactical Positioning & Spacing</span>
                            <span className="text-accent">92%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                            <div className="h-full rounded-full bg-accent" style={{ width: "92%" }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span className="text-foreground">Aerobic & Anaerobic Stamina</span>
                            <span className="text-emerald-500">84%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                            <div className="h-full rounded-full bg-emerald-500" style={{ width: "84%" }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-border">
                      <Button asChild size="sm">
                        <a href="#coach-upload-section">
                          <Upload className="h-3.5 w-3.5 mr-1" /> Upload Video For This Student
                        </a>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link to="/sports">
                          Explore Sport Directory <ArrowRight className="h-3.5 w-3.5 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
                    Select a student from the roster on the left to view their detailed performance dashboard.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
