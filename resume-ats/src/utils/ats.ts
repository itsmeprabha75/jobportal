export type KeywordScore = {
  keyword: string;
  present: boolean;
  count: number;
};

export type ATSScore = {
  overall: number; // 0-100
  keywords: KeywordScore[];
  details: {
    lengthOk: boolean;
    contactOk: boolean;
    bulletsOk: boolean;
    datesOk: boolean;
  };
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+.#\-\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

export function extractKeywords(jobText: string): string[] {
  const tokens = tokenize(jobText);
  const stop = new Set([
    'the','and','or','of','to','a','in','for','with','on','at','by','is','as','an','be','are','this','that','from','you','your','we','our','will','must','have','has','it','use','using','used','skills','requirements','responsibilities','preferred','minimum','years','experience'
  ]);
  const counts: Record<string, number> = {};
  for (const t of tokens) {
    if (t.length < 2 || stop.has(t)) continue;
    counts[t] = (counts[t] || 0) + 1;
  }
  const top = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 40)
    .map(([k]) => k);
  return uniq(top);
}

export function resumeToText(resume: any): string {
  const parts: string[] = [];
  if (!resume) return '';
  const b = resume.basics || {};
  parts.push(b.fullName, b.role, b.summary, b.email, b.phone, b.location, b.website);
  for (const s of resume.skills || []) parts.push(s);
  for (const e of resume.experience || []) {
    parts.push(e.title, e.company, e.location, e.startDate, e.endDate, ...(e.bullets || []));
  }
  for (const ed of resume.education || []) {
    parts.push(ed.school, ed.degree, ed.startYear, ed.endYear);
  }
  return parts.filter(Boolean).join(' ');
}

export function scoreATS(jobText: string, resume: any): ATSScore {
  const keywords = extractKeywords(jobText);
  const resumeText = tokenize(resumeToText(resume));
  const resumeSet = new Set(resumeText);

  const keywordScores: KeywordScore[] = keywords.map((kw) => {
    const present = resumeSet.has(kw);
    const count = resumeText.filter((t) => t === kw).length;
    return { keyword: kw, present, count };
  });

  const presentCount = keywordScores.filter((k) => k.present).length;
  const keywordScore = keywords.length ? (presentCount / keywords.length) * 70 : 0; // 70% weight

  // Heuristics
  const textLen = resumeToText(resume).length;
  const lengthOk = textLen >= 800 && textLen <= 8000; // rough bounds
  const contactOk = Boolean(resume?.basics?.email && resume?.basics?.fullName);
  const bulletsOk = (resume?.experience || []).some((e: any) => (e.bullets || []).length >= 3);
  const datesOk = (resume?.experience || []).every((e: any) => /^(\d{4}-\d{2}|present)$/i.test(String(e.startDate || '')));

  const heuristics = [lengthOk, contactOk, bulletsOk, datesOk];
  const heuristicScore = (heuristics.filter(Boolean).length / heuristics.length) * 30; // 30% weight

  const overall = Math.round(keywordScore + heuristicScore);

  return {
    overall,
    keywords: keywordScores,
    details: { lengthOk, contactOk, bulletsOk, datesOk },
  };
}