import React, { useState } from "react";
import {
  UploadCloud,
  FileVideo,
  CheckCircle2,
  AlertCircle,
  Film,
  Send,
  Loader2,
  X,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SportVideoSubmissionProps {
  sportName: string;
  category?: string;
  defaultDrill?: string;
  onSuccess?: () => void;
}

export function SportVideoSubmission({
  sportName,
  category = "General",
  defaultDrill = "Match / Practice Session",
  onSuccess,
}: SportVideoSubmissionProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [athleteOrCoachName, setAthleteOrCoachName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"coach" | "student" | "athlete">("coach");
  const [sessionDate, setSessionDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [drillType, setDrillType] = useState(defaultDrill);
  const [tacticalNotes, setTacticalNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        setErrorMessage("Please select a valid video file (.mp4, .mov, .webm, .avi)");
        return;
      }
      setSelectedFile(file);
      setErrorMessage("");
      const url = URL.createObjectURL(file);
      setFilePreviewUrl(url);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMessage("Please choose a video file to upload for analysis.");
      return;
    }
    if (!athleteOrCoachName.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }
    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    setStatus("uploading");
    setErrorMessage("");

    try {
      // Store submission metadata in localStorage so it reflects in institution / athlete dashboards
      const submissionRecord = {
        id: "sub_" + Math.random().toString(36).substring(2, 9),
        sportName,
        category,
        role,
        name: athleteOrCoachName.trim(),
        email: email.trim(),
        fileName: selectedFile.name,
        fileSize: (selectedFile.size / (1024 * 1024)).toFixed(1) + " MB",
        drillType,
        sessionDate,
        tacticalNotes,
        submittedAt: new Date().toISOString(),
        aiProcessingStatus: "Processing (Frame Extraction & Optical Kinematics)",
      };

      const existingSubs = JSON.parse(
        localStorage.getItem("smx_video_submissions") || "[]"
      );
      existingSubs.unshift(submissionRecord);
      localStorage.setItem("smx_video_submissions", JSON.stringify(existingSubs));

      // Simulate realistic upload latency
      await new Promise((resolve) => setTimeout(resolve, 1400));
      setStatus("success");
      if (onSuccess) onSuccess();
    } catch {
      setStatus("error");
      setErrorMessage("Failed to upload video submission. Please try again.");
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <Film className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              {sportName} Tactical Video & Drill Upload
            </h3>
            <p className="text-xs text-muted-foreground">
              Upload match footage or practice drills for AI biomechanical and optical analysis.
            </p>
          </div>
        </div>
        <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-semibold text-accent uppercase tracking-wider">
          AI Telemetry
        </span>
      </div>

      {status === "success" ? (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-emerald-500/20 text-emerald-500">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h4 className="text-lg font-bold text-foreground">Video Uploaded Successfully!</h4>
          <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
            Your footage for <strong>{sportName}</strong> has been ingested into the SportsMax pipeline.
            AI optical tracking models are extracting player tracking polygons, kinematic speeds, and tactical tag markers.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStatus("idle");
                setSelectedFile(null);
                setFilePreviewUrl(null);
                setTacticalNotes("");
              }}
            >
              Upload Another Video
            </Button>
            <Button asChild size="sm">
              <a href="/institution">View in Institution Hub</a>
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs font-semibold text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Video Dropzone */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Select or Drag Video Footage *
            </label>
            {selectedFile ? (
              <div className="relative rounded-xl border border-border bg-secondary/50 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/20 text-primary">
                    <FileVideo className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground truncate max-w-xs sm:max-w-md">
                      {selectedFile.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · Ready for processing
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
                  title="Remove video"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-secondary/20 hover:bg-secondary/40 p-6 text-center transition">
                <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm font-semibold text-foreground">
                  Click to select video or drag & drop
                </span>
                <span className="mt-1 text-xs text-muted-foreground">
                  MP4, MOV, WEBM, AVI (Max 500MB suggested)
                </span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
            )}
          </div>

          {/* Form Fields Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Role *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "coach" | "student" | "athlete")}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="coach">Coach / Instructor</option>
                <option value="student">Student Athlete</option>
                <option value="athlete">Senior Athlete / Player</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Full Name *
              </label>
              <Input
                required
                value={athleteOrCoachName}
                onChange={(e) => setAthleteOrCoachName(e.target.value)}
                placeholder="e.g. Coach David Miller or Sarah Lin"
                className="bg-background text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Email Address *
              </label>
              <Input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="coach@sportsmax.ai"
                className="bg-background text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Drill / Match Session Name
              </label>
              <Input
                value={drillType}
                onChange={(e) => setDrillType(e.target.value)}
                placeholder="e.g. Penalty Box Spacing Drill"
                className="bg-background text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Recorded Date
              </label>
              <Input
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="bg-background text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Sport & Category
              </label>
              <Input
                readOnly
                value={`${sportName} (${category})`}
                className="bg-secondary/50 text-xs text-muted-foreground cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Tactical Objectives & Coaching Notes
            </label>
            <textarea
              rows={3}
              value={tacticalNotes}
              onChange={(e) => setTacticalNotes(e.target.value)}
              placeholder="Highlight key player numbers, tactical focal points (e.g. high press triggers, sprint acceleration angles, jump takeoff phase)..."
              className="w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <Button type="submit" disabled={status === "uploading"} className="w-full font-bold">
            {status === "uploading" ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Ingesting & Analyzing Video...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="h-4 w-4" /> Submit Video for AI Tactical Extraction
              </span>
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
