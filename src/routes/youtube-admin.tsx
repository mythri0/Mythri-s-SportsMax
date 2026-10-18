import { createFileRoute } from "@tanstack/react-router";
import { PageIntro } from "@/components/sports-ui";
import { YouTubeAdminDashboard } from "@/components/youtube-admin";

export const Route = createFileRoute("/youtube-admin")({
  head: () => ({
    meta: [
      { title: "YouTube Automation & Management — SportsMax" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: YouTubeAdminPage,
});

function YouTubeAdminPage() {
  return (
    <>
      <PageIntro
        eyebrow="Admin Portal"
        title="YouTube Channel & Video Automation"
        text="Manage channel synchronization, configure OAuth tokens, and schedule automated match video publications."
      />

      <section className="py-12">
        <div className="content-wrap max-w-6xl">
          <YouTubeAdminDashboard />
        </div>
      </section>
    </>
  );
}
