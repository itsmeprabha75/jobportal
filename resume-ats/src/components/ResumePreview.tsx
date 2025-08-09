import { forwardRef } from 'react';
import { useResumeStore } from '../store/resumeStore';

const ResumePreview = forwardRef<HTMLDivElement>(function ResumePreview(_, ref) {
  const { resume } = useResumeStore();

  return (
    <div ref={ref} className="mx-auto w-[816px] bg-white p-8 text-gray-900 shadow print:shadow-none">
      <header className="border-b border-gray-200 pb-3">
        <h1 className="text-3xl font-bold leading-tight">{resume.basics.fullName}</h1>
        <div className="mt-1 text-brand font-medium">{resume.basics.role}</div>
        <div className="mt-1 text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-1">
          {resume.basics.email && <span>{resume.basics.email}</span>}
          {resume.basics.phone && <span>{resume.basics.phone}</span>}
          {resume.basics.location && <span>{resume.basics.location}</span>}
          {resume.basics.website && <span>{resume.basics.website}</span>}
        </div>
      </header>

      {resume.basics.summary && (
        <section className="mt-4">
          <h2 className="text-lg font-semibold text-gray-800">Summary</h2>
          <p className="mt-1 text-sm leading-relaxed">{resume.basics.summary}</p>
        </section>
      )}

      {resume.skills.length > 0 && (
        <section className="mt-4">
          <h2 className="text-lg font-semibold text-gray-800">Skills</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {resume.skills.map((s) => (
              <span key={s} className="rounded bg-gray-100 px-2 py-1 text-xs">{s}</span>
            ))}
          </div>
        </section>
      )}

      {resume.experience.length > 0 && (
        <section className="mt-4">
          <h2 className="text-lg font-semibold text-gray-800">Experience</h2>
          <div className="mt-2 space-y-3">
            {resume.experience.map((e) => (
              <div key={e.id}>
                <div className="flex items-center justify-between text-sm">
                  <div className="font-semibold">{e.title}{e.company ? `, ${e.company}` : ''}</div>
                  <div className="text-gray-600">{[e.location, [e.startDate, e.endDate].filter(Boolean).join(' - ')].filter(Boolean).join(' • ')}</div>
                </div>
                {e.bullets.length > 0 && (
                  <ul className="mt-1 list-disc pl-5 text-sm leading-relaxed">
                    {e.bullets.map((b, idx) => b && <li key={idx}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.education.length > 0 && (
        <section className="mt-4">
          <h2 className="text-lg font-semibold text-gray-800">Education</h2>
          <div className="mt-2 space-y-2">
            {resume.education.map((ed) => (
              <div key={ed.id} className="text-sm">
                <div className="font-semibold">{ed.school}</div>
                <div className="text-gray-600">{[ed.degree, [ed.startYear, ed.endYear].filter(Boolean).join(' - ')].filter(Boolean).join(' • ')}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
});

export default ResumePreview;