import Link from "next/link";
import { BookOpen } from "./icons";
import { editorialTeam } from "../lib/editorial-team";

export function ArticleByline() {
  return (
    <p className="mt-4 text-sm text-slate-600">
      By <Link href={editorialTeam.path} rel="author" className="content-link font-semibold">{editorialTeam.name}</Link>
    </p>
  );
}

export function ArticleAuthorCard() {
  return (
    <section aria-label="About the author" className="card-surface mt-10 p-6 sm:p-8">
      <div className="flex flex-col items-start gap-4 sm:flex-row">
        <span className="icon-badge brand-badge shrink-0" aria-hidden="true"><BookOpen className="h-5 w-5" /></span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-emerald-700">About the author</p>
          <h2 className="mt-2 text-xl"><Link href={editorialTeam.path} rel="author" className="content-link">{editorialTeam.name}</Link></h2>
          <p className="body-copy mt-3">{editorialTeam.description}</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            This team byline does not indicate medical review. Our guides offer general education; they cannot assess your health or replace advice from a qualified healthcare professional.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <Link href={editorialTeam.path} className="content-link font-semibold">Meet the editorial team</Link>
            <Link href="/editorial-policy" className="content-link">Editorial policy</Link>
            <Link href="/contact-us" className="content-link">Report a correction</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
