import { useState } from 'react';
import { useResumeStore } from '../store/resumeStore';
import { Plus, Trash2 } from 'lucide-react';

export default function ResumeEditor() {
  const {
    resume,
    setBasics,
    addSkill,
    removeSkill,
    addExperience,
    updateExperience,
    removeExperience,
    addExperienceBullet,
    removeExperienceBullet,
    addEducation,
    updateEducation,
    removeEducation,
  } = useResumeStore();

  const [skillInput, setSkillInput] = useState('');

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="h2">Basics</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="label">Full Name
            <input className="input mt-1" value={resume.basics.fullName} onChange={(e) => setBasics({ fullName: e.target.value })} />
          </label>
          <label className="label">Role
            <input className="input mt-1" value={resume.basics.role} onChange={(e) => setBasics({ role: e.target.value })} />
          </label>
          <label className="label">Email
            <input className="input mt-1" value={resume.basics.email} onChange={(e) => setBasics({ email: e.target.value })} />
          </label>
          <label className="label">Phone
            <input className="input mt-1" value={resume.basics.phone} onChange={(e) => setBasics({ phone: e.target.value })} />
          </label>
          <label className="label">Location
            <input className="input mt-1" value={resume.basics.location} onChange={(e) => setBasics({ location: e.target.value })} />
          </label>
          <label className="label">Website
            <input className="input mt-1" value={resume.basics.website} onChange={(e) => setBasics({ website: e.target.value })} />
          </label>
        </div>
        <label className="label">Summary
          <textarea className="textarea mt-1" value={resume.basics.summary} onChange={(e) => setBasics({ summary: e.target.value })} />
        </label>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="h2">Skills</h2>
        </div>
        <div className="flex gap-2">
          <input className="input" placeholder="Add a skill and press Enter" value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && skillInput.trim()) {
                addSkill(skillInput.trim());
                setSkillInput('');
              }
            }}
          />
          <button className="button" onClick={() => { if (skillInput.trim()) { addSkill(skillInput.trim()); setSkillInput(''); } }}>
            <Plus size={16} /> Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {resume.skills.map((s) => (
            <span key={s} className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm">
              {s}
              <button className="text-gray-500 hover:text-red-600" onClick={() => removeSkill(s)}>×</button>
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="h2">Experience</h2>
          <button className="button" onClick={addExperience}><Plus size={16} /> Add Experience</button>
        </div>
        <div className="space-y-6">
          {resume.experience.map((exp) => (
            <div key={exp.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="grid grow grid-cols-1 md:grid-cols-2 gap-3">
                  <input className="input" placeholder="Title" value={exp.title} onChange={(e) => updateExperience(exp.id, { title: e.target.value })} />
                  <input className="input" placeholder="Company" value={exp.company} onChange={(e) => updateExperience(exp.id, { company: e.target.value })} />
                  <input className="input" placeholder="Location" value={exp.location} onChange={(e) => updateExperience(exp.id, { location: e.target.value })} />
                  <div className="grid grid-cols-2 gap-2">
                    <input className="input" placeholder="Start YYYY-MM" value={exp.startDate} onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })} />
                    <input className="input" placeholder="End YYYY-MM or Present" value={exp.endDate} onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })} />
                  </div>
                </div>
                <button className="button-ghost" onClick={() => removeExperience(exp.id)}><Trash2 size={16} /></button>
              </div>

              <div className="mt-3 space-y-2">
                <h3 className="label">Bullets</h3>
                {exp.bullets.map((b, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input className="input" value={b} onChange={(e) => {
                      const copy = [...exp.bullets];
                      copy[idx] = e.target.value;
                      updateExperience(exp.id, { bullets: copy });
                    }} />
                    <button className="button-ghost" onClick={() => removeExperienceBullet(exp.id, idx)}>Remove</button>
                  </div>
                ))}
                <button className="button" onClick={() => addExperienceBullet(exp.id, '')}><Plus size={16} /> Add Bullet</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="h2">Education</h2>
          <button className="button" onClick={addEducation}><Plus size={16} /> Add Education</button>
        </div>
        <div className="space-y-6">
          {resume.education.map((ed) => (
            <div key={ed.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input className="input" placeholder="School" value={ed.school} onChange={(e) => updateEducation(ed.id, { school: e.target.value })} />
                <input className="input" placeholder="Degree" value={ed.degree} onChange={(e) => updateEducation(ed.id, { degree: e.target.value })} />
                <input className="input" placeholder="Start YYYY" value={ed.startYear} onChange={(e) => updateEducation(ed.id, { startYear: e.target.value })} />
                <input className="input" placeholder="End YYYY or Present" value={ed.endYear} onChange={(e) => updateEducation(ed.id, { endYear: e.target.value })} />
              </div>
              <div className="mt-2 flex justify-end">
                <button className="button-ghost" onClick={() => removeEducation(ed.id)}><Trash2 size={16} /> Remove</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}