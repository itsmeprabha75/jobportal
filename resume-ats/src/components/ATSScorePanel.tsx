import { useMemo } from 'react';
import { useResumeStore } from '../store/resumeStore';
import { scoreATS } from '../utils/ats';

export default function ATSScorePanel() {
  const { resume, job, setJobText } = useResumeStore();

  const result = useMemo(() => scoreATS(job.text, resume), [job.text, resume]);

  return (
    <div className="space-y-3">
      <div>
        <label className="label">Job Description</label>
        <textarea className="textarea mt-1" placeholder="Paste a job description here" value={job.text} onChange={(e) => setJobText(e.target.value)} />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-sm text-gray-600">ATS Match</div>
            <div className="text-2xl font-bold">{result.overall}%</div>
          </div>
          <div className="w-40 h-2 rounded-full bg-gray-100">
            <div className="h-2 rounded-full bg-brand" style={{ width: `${result.overall}%` }} />
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className={result.details.contactOk ? 'text-green-700' : 'text-gray-600'}>Contact info</div>
          <div className={result.details.lengthOk ? 'text-green-700' : 'text-gray-600'}>Length</div>
          <div className={result.details.bulletsOk ? 'text-green-700' : 'text-gray-600'}>Bullets</div>
          <div className={result.details.datesOk ? 'text-green-700' : 'text-gray-600'}>Dates</div>
        </div>
      </div>

      {result.keywords.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="font-medium">Keywords</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {result.keywords.map((k) => (
              <span key={k.keyword} className={`rounded-full px-3 py-1 text-xs ${k.present ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                {k.keyword}{k.count > 1 ? ` ×${k.count}` : ''}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}