import { create } from 'zustand';

export type ResumeExperience = {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string; // YYYY-MM
  endDate: string;   // YYYY-MM or "Present"
  bullets: string[];
};

export type ResumeEducation = {
  id: string;
  school: string;
  degree: string;
  startYear: string; // YYYY
  endYear: string;   // YYYY or "Present"
};

export type ResumeData = {
  basics: {
    fullName: string;
    role: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    summary: string;
  };
  skills: string[];
  experience: ResumeExperience[];
  education: ResumeEducation[];
};

export type JobDescription = {
  text: string;
};

type ResumeStore = {
  resume: ResumeData;
  job: JobDescription;
  setResume: (data: Partial<ResumeData>) => void;
  setBasics: (basics: Partial<ResumeData['basics']>) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  addExperience: () => void;
  updateExperience: (id: string, update: Partial<ResumeExperience>) => void;
  removeExperience: (id: string) => void;
  addExperienceBullet: (id: string, bullet: string) => void;
  removeExperienceBullet: (id: string, idx: number) => void;
  addEducation: () => void;
  updateEducation: (id: string, update: Partial<ResumeEducation>) => void;
  removeEducation: (id: string) => void;
  setJobText: (text: string) => void;
  importFromJson: (json: string) => void;
  exportToJson: () => string;
  reset: () => void;
};

const emptyResume: ResumeData = {
  basics: {
    fullName: 'Your Name',
    role: 'Target Role',
    email: '',
    phone: '',
    location: '',
    website: '',
    summary: '',
  },
  skills: [],
  experience: [],
  education: [],
};

function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export const useResumeStore = create<ResumeStore>((set, get) => ({
  resume: emptyResume,
  job: { text: '' },
  setResume: (data) => set((state) => ({
    resume: { ...state.resume, ...data },
  })),
  setBasics: (basics) => set((state) => ({
    resume: { ...state.resume, basics: { ...state.resume.basics, ...basics } },
  })),
  addSkill: (skill) => set((state) => ({
    resume: { ...state.resume, skills: Array.from(new Set([...state.resume.skills, skill])).filter(Boolean) },
  })),
  removeSkill: (skill) => set((state) => ({
    resume: { ...state.resume, skills: state.resume.skills.filter((s) => s !== skill) },
  })),
  addExperience: () => set((state) => ({
    resume: {
      ...state.resume,
      experience: [
        ...state.resume.experience,
        { id: generateId('exp'), title: '', company: '', location: '', startDate: '', endDate: '', bullets: [] },
      ],
    },
  })),
  updateExperience: (id, update) => set((state) => ({
    resume: {
      ...state.resume,
      experience: state.resume.experience.map((e) => (e.id === id ? { ...e, ...update } : e)),
    },
  })),
  removeExperience: (id) => set((state) => ({
    resume: { ...state.resume, experience: state.resume.experience.filter((e) => e.id !== id) },
  })),
  addExperienceBullet: (id, bullet) => set((state) => ({
    resume: {
      ...state.resume,
      experience: state.resume.experience.map((e) => (e.id === id ? { ...e, bullets: [...e.bullets, bullet] } : e)),
    },
  })),
  removeExperienceBullet: (id, idx) => set((state) => ({
    resume: {
      ...state.resume,
      experience: state.resume.experience.map((e) => (e.id === id ? { ...e, bullets: e.bullets.filter((_, i) => i !== idx) } : e)),
    },
  })),
  addEducation: () => set((state) => ({
    resume: {
      ...state.resume,
      education: [
        ...state.resume.education,
        { id: generateId('edu'), school: '', degree: '', startYear: '', endYear: '' },
      ],
    },
  })),
  updateEducation: (id, update) => set((state) => ({
    resume: {
      ...state.resume,
      education: state.resume.education.map((ed) => (ed.id === id ? { ...ed, ...update } : ed)),
    },
  })),
  removeEducation: (id) => set((state) => ({
    resume: { ...state.resume, education: state.resume.education.filter((ed) => ed.id !== id) },
  })),
  setJobText: (text) => set(() => ({ job: { text } })),
  importFromJson: (json) => {
    try {
      const parsed = JSON.parse(json) as ResumeData;
      set(() => ({ resume: parsed }));
    } catch (e) {
      console.error('Failed to import JSON', e);
    }
  },
  exportToJson: () => JSON.stringify(get().resume, null, 2),
  reset: () => set(() => ({ resume: emptyResume, job: { text: '' } })),
}));