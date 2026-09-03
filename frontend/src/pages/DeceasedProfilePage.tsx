import React, { useState, useEffect } from 'react';
import { deceasedApi } from '../services/apiServices';
import { DeceasedProfile } from '../types';
import { User, Calendar, MapPin, Building, Edit3, Check, AlertCircle } from 'lucide-react';

export const DeceasedProfilePage: React.FC = () => {
  const [profiles, setProfiles] = useState<DeceasedProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<DeceasedProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Edit Form State
  const [fullName, setFullName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [claimantRole, setClaimantRole] = useState<'Nominee' | 'Legal Heir' | 'Both' | 'Other'>('Nominee');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [dateOfDeath, setDateOfDeath] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [notes, setNotes] = useState('');

  const fetchProfiles = async () => {
    try {
      const res = await deceasedApi.getAll();
      setProfiles(res.profiles);
      if (res.profiles.length > 0) {
        const p = res.profiles[0];
        setActiveProfile(p);
        setFullName(p.fullName);
        setRelationship(p.relationship);
        setClaimantRole(p.claimantRole);
        setDateOfBirth(p.dateOfBirth ? p.dateOfBirth.split('T')[0] : '');
        setDateOfDeath(p.dateOfDeath ? p.dateOfDeath.split('T')[0] : '');
        setContactInfo(p.contactInfo || '');
        setNotes(p.notes || '');
      }
    } catch (err) {
      console.error('[Profile Fetch Error]', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProfile) return;

    try {
      const res = await deceasedApi.update(activeProfile._id, {
        fullName,
        relationship,
        claimantRole,
        dateOfBirth: dateOfBirth || undefined,
        dateOfDeath: dateOfDeath || undefined,
        contactInfo,
        notes,
      });
      setActiveProfile(res.profile);
      setIsEditing(false);
    } catch (err) {
      console.error('[Update Error]', err);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12 text-slate-400 text-sm">Loading deceased profile...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Deceased Person Profile</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage personal information, claimant relationship, and institution context.</p>
        </div>

        {activeProfile && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-teal-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors flex items-center"
          >
            <Edit3 className="w-3.5 h-3.5 mr-1.5" /> Edit Profile
          </button>
        )}
      </div>

      {activeProfile ? (
        <div className="glass-card p-6 rounded-2xl border-slate-800 space-y-6">
          {!isEditing ? (
            <div className="space-y-6">
              <div className="flex items-center space-x-4 border-b border-slate-800 pb-6">
                <div className="w-16 h-16 rounded-2xl bg-teal-950 text-teal-400 border border-teal-800 flex items-center justify-center text-2xl font-extrabold">
                  {activeProfile.fullName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{activeProfile.fullName}</h2>
                  <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
                    <span className="px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800 font-medium">
                      Role: {activeProfile.claimantRole}
                    </span>
                    <span>Relationship: <strong className="text-slate-200">{activeProfile.relationship}</strong></span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-500 font-semibold uppercase tracking-wider block mb-1">Date of Demise</span>
                  <div className="text-sm font-semibold text-white flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-teal-400" />
                    {activeProfile.dateOfDeath ? new Date(activeProfile.dateOfDeath).toLocaleDateString() : 'Not provided'}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-500 font-semibold uppercase tracking-wider block mb-1">Date of Birth</span>
                  <div className="text-sm font-semibold text-white flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-sky-400" />
                    {activeProfile.dateOfBirth ? new Date(activeProfile.dateOfBirth).toLocaleDateString() : 'Not provided'}
                  </div>
                </div>
              </div>

              {activeProfile.knownInstitutions && activeProfile.knownInstitutions.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center">
                    <Building className="w-3.5 h-3.5 mr-1.5 text-teal-400" /> Associated Institutions
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {activeProfile.knownInstitutions.map((inst, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200">
                        {inst}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeProfile.notes && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Additional Notes</h3>
                  <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
                    {activeProfile.notes}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-white mb-4">Edit Profile Information</h3>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Relationship</label>
                  <input
                    type="text"
                    required
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Claimant Role</label>
                  <select
                    value={claimantRole}
                    onChange={(e) => setClaimantRole(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:border-teal-500 focus:outline-none"
                  >
                    <option value="Nominee">Nominee</option>
                    <option value="Legal Heir">Legal Heir</option>
                    <option value="Both">Both</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Date of Demise</label>
                  <input
                    type="date"
                    value={dateOfDeath}
                    onChange={(e) => setDateOfDeath(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Notes</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold flex items-center"
                >
                  <Check className="w-3.5 h-3.5 mr-1" /> Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <div className="glass-card p-8 rounded-2xl border-slate-800 text-center text-slate-400 text-xs">
          No deceased profile created yet. Please complete onboarding or load sample demo data.
        </div>
      )}
    </div>
  );
};
