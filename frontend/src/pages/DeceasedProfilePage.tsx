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
    return <div className="text-center py-12 text-slate-500 text-xs">Loading deceased profile...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Liabilities & Profile</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage liabilities, loans, and family profile context.</p>
        </div>

        {activeProfile && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3.5 py-1.5 text-xs font-bold text-finclosure-800 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors flex items-center"
          >
            <Edit3 className="w-3.5 h-3.5 mr-1.5" /> Edit Profile
          </button>
        )}
      </div>

      {activeProfile ? (
        <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-6 shadow-2xs">
          {!isEditing ? (
            <div className="space-y-6">
              <div className="flex items-center space-x-4 border-b border-slate-100 pb-6">
                <div className="w-14 h-14 rounded-2xl bg-finclosure-100 text-finclosure-800 border border-finclosure-200 flex items-center justify-center text-xl font-black">
                  {activeProfile.fullName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">{activeProfile.fullName}</h2>
                  <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-100 font-bold">
                      Role: {activeProfile.claimantRole}
                    </span>
                    <span>Relationship: <strong className="text-slate-900">{activeProfile.relationship}</strong></span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-bold uppercase tracking-wider block mb-1">Date of Demise</span>
                  <div className="text-xs font-bold text-slate-900 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-finclosure-800" />
                    {activeProfile.dateOfDeath ? new Date(activeProfile.dateOfDeath).toLocaleDateString() : 'Not provided'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-bold uppercase tracking-wider block mb-1">Date of Birth</span>
                  <div className="text-xs font-bold text-slate-900 flex items-center">
                    <User className="w-4 h-4 mr-2 text-finclosure-800" />
                    {activeProfile.dateOfBirth ? new Date(activeProfile.dateOfBirth).toLocaleDateString() : 'Not provided'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold focus:border-finclosure-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Relationship</label>
                  <input
                    type="text"
                    required
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold focus:border-finclosure-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Claimant Role</label>
                  <select
                    value={claimantRole}
                    onChange={(e) => setClaimantRole(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold focus:border-finclosure-800"
                  >
                    <option value="Nominee">Nominee</option>
                    <option value="Legal Heir">Legal Heir</option>
                    <option value="Both">Both</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-finclosure-800 hover:bg-finclosure-900 text-white font-bold text-xs rounded-xl"
                >
                  Save Profile
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 p-8 rounded-3xl text-center text-slate-500">
          <User className="w-10 h-10 text-finclosure-800 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-900 mb-1">No Profile Active</h3>
          <p className="text-xs text-slate-500">Complete onboarding to link your family profile.</p>
        </div>
      )}
    </div>
  );
};
