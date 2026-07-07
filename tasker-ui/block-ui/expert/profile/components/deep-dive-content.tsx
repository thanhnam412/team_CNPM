import { UserPlus, Award, Briefcase, ExternalLink, Clock, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DeepDiveContentProps {
  expert: any;
  parsedSkills: { core: string[]; secondary: string[] };
  parsedShowcase: any[];
  reviews: any[];
  workHistory: any[];
}

export function DeepDiveContent({
  expert,
  parsedSkills,
  parsedShowcase,
  reviews,
  workHistory,
}: DeepDiveContentProps) {
  return (
    <div className="flex-1 p-6 md:p-8 space-y-12 bg-secondary/5">
      {/* Bio */}
      {expert.bio && (
        <section>
          <h2 className="font-heading font-black uppercase tracking-widest text-lg mb-4 flex items-center gap-2 border-b-2 border-border pb-2">
            <UserPlus className="w-5 h-5 text-primary" /> About
          </h2>
          <div className="bg-card border-2 border-border p-6 shadow-[4px_4px_0px_0px_var(--border)] text-sm font-semibold whitespace-pre-wrap leading-relaxed">
            {expert.bio}
          </div>
        </section>
      )}

      {/* Skill Tree */}
      {(parsedSkills.core.length > 0 || parsedSkills.secondary.length > 0) && (
        <section>
          <h2 className="font-heading font-black uppercase tracking-widest text-lg mb-4 flex items-center gap-2 border-b-2 border-border pb-2">
            <Award className="w-5 h-5 text-primary" /> Skills & Expertise
          </h2>
          <div className="space-y-4">
            {parsedSkills.core.length > 0 && (
              <div>
                <h3 className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  Core Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {parsedSkills.core.map((skill: string) => (
                    <span
                      key={skill}
                      className="bg-foreground text-background border-2 border-foreground px-3 py-1.5 text-xs font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_var(--foreground)]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {parsedSkills.secondary.length > 0 && (
              <div>
                <h3 className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  Secondary Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {parsedSkills.secondary.map((skill: string) => (
                    <span
                      key={skill}
                      className="bg-card border-2 border-border px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Portfolio */}
      {parsedShowcase.length > 0 && (
        <section>
          <h2 className="font-heading font-black uppercase tracking-widest text-lg mb-4 flex items-center gap-2 border-b-2 border-border pb-2">
            <Briefcase className="w-5 h-5 text-primary" /> Portfolio & External Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parsedShowcase.map((item: any, i: number) => (
              <a
                key={i}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-video bg-card border-2 border-border p-4 flex flex-col justify-end group hover:border-primary transition-colors cursor-pointer shadow-[4px_4px_0px_0px_var(--border)] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-secondary/50 flex items-center justify-center">
                  <span className="text-muted-foreground font-black uppercase tracking-widest opacity-30 rotate-12 text-2xl">
                    Preview
                  </span>
                </div>
                <div className="relative z-10 bg-background/90 p-3 border-2 border-foreground group-hover:border-primary">
                  <h3 className="font-bold text-sm uppercase truncate group-hover:text-primary transition-colors">
                    {item.project}
                  </h3>
                  <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mt-1 flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" /> Visit Link
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Work History & Reviews */}
      <section>
        <h2 className="font-heading font-black uppercase tracking-widest text-lg mb-4 flex items-center gap-2 border-b-2 border-border pb-2">
          <Clock className="w-5 h-5 text-primary" /> Work History & Reviews
        </h2>
        <div className="space-y-6">
          {reviews.length === 0 && workHistory.length === 0 ? (
            <div className="bg-card border-2 border-border p-6 text-center shadow-[4px_4px_0px_0px_var(--border)]">
              <p className="font-bold uppercase tracking-widest text-muted-foreground text-sm">
                No work history or reviews available yet.
              </p>
            </div>
          ) : null}

          {/* Render Work History first */}
          {workHistory.map((job: any) => (
            <div
              key={job.id}
              className="bg-card border-2 border-foreground p-6 shadow-[4px_4px_0px_0px_var(--foreground)]"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4 border-b-2 border-border pb-4">
                <div>
                  <h3 className="font-black text-sm uppercase transition-colors inline-flex items-center gap-2">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-3 text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mt-2">
                    <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                    <span className="w-1 h-1 bg-border rounded-full" />
                    <span className="text-primary">{job.status}</span>
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end gap-2 md:gap-1 shrink-0">
                  <div className="font-heading font-black text-lg">
                    ${job.budget}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Render Reviews */}
          {reviews.map((review: any) => (
            <div
              key={review.id}
              className="bg-card border-2 border-foreground p-6 shadow-[4px_4px_0px_0px_var(--foreground)]"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4 border-b-2 border-border pb-4">
                <div>
                  <h3 className="font-black text-sm uppercase transition-colors inline-flex items-center gap-2">
                    {review.taskTitle || "Task Review"}
                  </h3>
                  <div className="flex items-center gap-3 text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mt-2">
                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                    <span className="w-1 h-1 bg-border rounded-full" />
                    <span>By {review.reviewerName}</span>
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end gap-2 md:gap-1 shrink-0">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        className={cn(
                          "w-3 h-3",
                          idx < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-muted text-muted"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {review.feedback && (
                <div className="border-2 border-dashed border-border bg-secondary/10 p-4 text-sm font-semibold italic">
                  "{review.feedback}"
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
