import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { adminApi } from '../../../services/api';
import { ContactInfoData, RegistrationSettingsData } from '../../../types/cms';
import { FALLBACK_BOOTSTRAP_DATA } from '../../../data/fallbackData';

interface ContactEditorProps {
  onDataUpdated: () => void;
}

export const ContactInfoEditor: React.FC<ContactEditorProps> = ({ onDataUpdated }) => {
  const [info, setInfo] = useState<ContactInfoData>(FALLBACK_BOOTSTRAP_DATA.contactInfo);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .getContactInfo()
      .then((res) => {
        if (res.contactInfo) setInfo(res.contactInfo);
      })
      .catch((err) => setErrorMsg(err instanceof Error ? err.message : 'Failed to load contact info.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    try {
      await adminApi.updateContactInfo(info);
      setStatusMsg('Contact Page Academy Information saved into the public website.');
      setTimeout(() => setStatusMsg(null), 4000);
      onDataUpdated();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to update contact info.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-sm text-[#55635c]">Loading content...</div>;

  return (
    <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[#e5dfd3] p-6 space-y-5">
      <div className="flex items-center justify-between border-b border-[#efeae0] pb-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#11382b]">Contact Page — Academy Information</h3>
          <p className="text-xs text-[#6d7972]">
            Edit address, global availability, WhatsApp, email, and descriptions. (The public Contact Inquiry Form stays unchanged.)
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#184c3c] text-white text-xs font-semibold cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saving ? 'Saving...' : 'Save Contact Info'}</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{statusMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Card Heading</label>
          <input type="text" required value={info.cardTitle} onChange={(e) => setInfo({ ...info, cardTitle: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Address / Location</label>
          <input type="text" required value={info.addressLocation} onChange={(e) => setInfo({ ...info, addressLocation: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Page Header Description</label>
        <textarea rows={2} required value={info.headerDescription} onChange={(e) => setInfo({ ...info, headerDescription: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Global Availability Title</label>
          <input type="text" required value={info.globalAvailabilityTitle} onChange={(e) => setInfo({ ...info, globalAvailabilityTitle: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Global Availability Description</label>
          <input type="text" required value={info.globalAvailabilityText} onChange={(e) => setInfo({ ...info, globalAvailabilityText: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">WhatsApp Section Title</label>
          <input type="text" required value={info.whatsappTitle} onChange={(e) => setInfo({ ...info, whatsappTitle: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">WhatsApp / Contact Number</label>
          <input type="text" value={info.whatsappNumber} onChange={(e) => setInfo({ ...info, whatsappNumber: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">WhatsApp Description</label>
          <input type="text" required value={info.whatsappText} onChange={(e) => setInfo({ ...info, whatsappText: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Email Section Title</label>
          <input type="text" required value={info.emailTitle} onChange={(e) => setInfo({ ...info, emailTitle: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Support Email Address *</label>
          <input type="email" required value={info.emailAddress} onChange={(e) => setInfo({ ...info, emailAddress: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">Email Description</label>
          <input type="text" required value={info.emailText} onChange={(e) => setInfo({ ...info, emailText: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-[#11382b] mb-1">CTA Button Text</label>
        <input type="text" required value={info.ctaButtonText} onChange={(e) => setInfo({ ...info, ctaButtonText: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-sm" />
      </div>
    </form>
  );
};

interface TrialOptionsEditorProps {
  onDataUpdated: () => void;
}

export const TrialOptionsEditor: React.FC<TrialOptionsEditorProps> = ({ onDataUpdated }) => {
  const [settings, setSettings] = useState<RegistrationSettingsData>(
    FALLBACK_BOOTSTRAP_DATA.registrationSettings
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [newHour, setNewHour] = useState('');
  const [newMinute, setNewMinute] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [newWeeklyDay, setNewWeeklyDay] = useState('');
  const [newMonthlyDay, setNewMonthlyDay] = useState('');

  useEffect(() => {
    adminApi
      .getRegistrationSettings()
      .then((res) => {
        if (res.registrationSettings) {
          setSettings({
            ...FALLBACK_BOOTSTRAP_DATA.registrationSettings,
            ...res.registrationSettings,
            allowTimeSelection: res.registrationSettings.allowTimeSelection ?? true,
            allowDurationSelection: res.registrationSettings.allowDurationSelection ?? true,
          });
        }
      })
      .catch((err) => setErrorMsg(err instanceof Error ? err.message : 'Failed to load registration options.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg(null);
    try {
      await adminApi.updateRegistrationSettings({
        ...settings,
        allowTimeSelection: settings.allowTimeSelection ?? true,
        allowDurationSelection: settings.allowDurationSelection ?? true,
      });
      setStatusMsg('Free Trial form options saved into the public website.');
      setTimeout(() => setStatusMsg(null), 4000);
      onDataUpdated();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save options.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-sm text-[#55635c]">Loading content...</div>;

  const timeEnabled = settings.allowTimeSelection ?? true;
  const durationEnabled = settings.allowDurationSelection ?? true;
  const timeVisibleOnPublic = timeEnabled && settings.hours.length > 0 && settings.minutes.length > 0;
  const durationVisibleOnPublic = durationEnabled && settings.durations.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-[#e5dfd3] p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#efeae0] pb-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#11382b]">Free Trial Form — Selectable Options</h3>
          <p className="text-xs text-[#6d7972]">
            Add, delete, clear all, or toggle visibility for any schedule card. If you disable a card or delete all of its options, that card will be hidden on the public Free Trial form while staying editable here.
          </p>
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#184c3c] text-white text-xs font-semibold cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saving ? 'Saving...' : 'Save Options'}</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{statusMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Class Time Visibility & Hours / Minutes */}
      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#e5dfd3] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e5dfd3] pb-3">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#11382b]">
              Select Class Time Card (Hours &amp; Minutes)
            </h4>
            <p className="text-[11px] text-[#6d7972]">
              {timeVisibleOnPublic
                ? 'Shown on the public Free Trial form.'
                : 'Hidden on the public Free Trial form (disabled or missing hours/minutes).'}
            </p>
          </div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-[#11382b] cursor-pointer">
            <input
              type="checkbox"
              checked={timeEnabled}
              onChange={(e) => setSettings({ ...settings, allowTimeSelection: e.target.checked })}
              className="accent-[#184c3c]"
            />
            <span>Show on Public Form</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white p-4 rounded-xl border border-[#e5dfd3] space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#11382b]">Available Hours (AM/PM)</h5>
              {settings.hours.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, hours: [] })}
                  className="text-[11px] text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>
            {settings.hours.length === 0 ? (
              <p className="text-xs text-[#78857f] italic py-1">
                No hours configured. Class Time card will stay hidden on the public form until hours are added.
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {settings.hours.map((hr) => (
                  <span key={hr} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FAF7F2] border border-[#d6cfc1] text-xs font-medium">
                    {hr}
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, hours: settings.hours.filter((h) => h !== hr) })}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                      aria-label={`Remove hour ${hr}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={newHour}
                onChange={(e) => setNewHour(e.target.value)}
                placeholder="e.g. 09"
                className="flex-1 px-3 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  const v = newHour.trim();
                  if (v && !settings.hours.includes(v)) {
                    setSettings({ ...settings, hours: [...settings.hours, v] });
                    setNewHour('');
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-[#184c3c] text-white text-xs font-semibold cursor-pointer inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#e5dfd3] space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#11382b]">Available Minutes</h5>
              {settings.minutes.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, minutes: [] })}
                  className="text-[11px] text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>
            {settings.minutes.length === 0 ? (
              <p className="text-xs text-[#78857f] italic py-1">
                No minutes configured. Class Time card will stay hidden on the public form until minutes are added.
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {settings.minutes.map((min) => (
                  <span key={min} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FAF7F2] border border-[#d6cfc1] text-xs font-medium">
                    :{min}
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, minutes: settings.minutes.filter((m) => m !== min) })}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                      aria-label={`Remove minute ${min}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={newMinute}
                onChange={(e) => setNewMinute(e.target.value)}
                placeholder="e.g. 20"
                className="flex-1 px-3 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#d6cfc1] text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  const v = newMinute.trim();
                  if (v && !settings.minutes.includes(v)) {
                    setSettings({ ...settings, minutes: [...settings.minutes, v] });
                    setNewMinute('');
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-[#184c3c] text-white text-xs font-semibold cursor-pointer inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Class Duration Options */}
      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#e5dfd3] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e5dfd3] pb-3">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#11382b]">
              Class Duration Options (Editable)
            </h4>
            <p className="text-[11px] text-[#6d7972]">
              {durationVisibleOnPublic
                ? 'Shown on the public Free Trial form.'
                : 'Hidden on the public Free Trial form. You can add durations or re-enable anytime.'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {settings.durations.length > 0 && (
              <button
                type="button"
                onClick={() => setSettings({ ...settings, durations: [] })}
                className="text-[11px] text-red-600 hover:text-red-700 font-semibold cursor-pointer"
              >
                Remove All Durations
              </button>
            )}
            <label className="flex items-center gap-1.5 text-xs font-semibold text-[#11382b] cursor-pointer">
              <input
                type="checkbox"
                checked={durationEnabled}
                onChange={(e) => setSettings({ ...settings, allowDurationSelection: e.target.checked })}
                className="accent-[#184c3c]"
              />
              <span>Show on Public Form</span>
            </label>
          </div>
        </div>

        {settings.durations.length === 0 ? (
          <p className="text-xs text-[#78857f] italic py-2">
            No durations added. The Class Duration card will not appear on the public Free Trial form until you add one below.
          </p>
        ) : (
          <div className="space-y-2">
            {settings.durations.map((dur, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={dur}
                  onChange={(e) => {
                    const next = [...settings.durations];
                    next[idx] = e.target.value;
                    setSettings({ ...settings, durations: next });
                  }}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#d6cfc1] text-xs"
                />
                <button
                  type="button"
                  onClick={() =>
                    setSettings({
                      ...settings,
                      durations: settings.durations.filter((_, i) => i !== idx),
                    })
                  }
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                  aria-label={`Remove duration ${dur}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={newDuration}
            onChange={(e) => setNewDuration(e.target.value)}
            placeholder="e.g. 2 Hours"
            className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#d6cfc1] text-xs"
          />
          <button
            type="button"
            onClick={() => {
              const v = newDuration.trim();
              if (v && !settings.durations.includes(v)) {
                setSettings({ ...settings, durations: [...settings.durations, v] });
                setNewDuration('');
              }
            }}
            className="px-3 py-1.5 rounded-lg bg-[#184c3c] text-white text-xs font-semibold cursor-pointer inline-flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Duration
          </button>
        </div>
      </div>

      {/* Days per Week & Days per Month */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#e5dfd3] space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#11382b]">Days per Week Options</h4>
            <div className="flex items-center gap-3">
              {settings.daysPerWeekOptions.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, daysPerWeekOptions: [] })}
                  className="text-[11px] text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                >
                  Clear All
                </button>
              )}
              <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowWeeklySelection}
                  onChange={(e) => setSettings({ ...settings, allowWeeklySelection: e.target.checked })}
                  className="accent-[#184c3c]"
                />
                <span>Enabled</span>
              </label>
            </div>
          </div>
          {settings.daysPerWeekOptions.length === 0 ? (
            <p className="text-xs text-[#78857f] italic py-1">
              No weekly options configured.
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {settings.daysPerWeekOptions.map((opt) => (
                <span key={opt} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-[#d6cfc1] text-xs font-medium">
                  {opt}
                  <button
                    type="button"
                    onClick={() =>
                      setSettings({
                        ...settings,
                        daysPerWeekOptions: settings.daysPerWeekOptions.filter((d) => d !== opt),
                      })
                    }
                    className="text-red-500 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={newWeeklyDay}
              onChange={(e) => setNewWeeklyDay(e.target.value)}
              placeholder="e.g. 7 Days / Week"
              className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#d6cfc1] text-xs"
            />
            <button
              type="button"
              onClick={() => {
                const v = newWeeklyDay.trim();
                if (v && !settings.daysPerWeekOptions.includes(v)) {
                  setSettings({ ...settings, daysPerWeekOptions: [...settings.daysPerWeekOptions, v] });
                  setNewWeeklyDay('');
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-[#184c3c] text-white text-xs font-semibold cursor-pointer inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </div>

        <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#e5dfd3] space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#11382b]">Days per Month Options</h4>
            <div className="flex items-center gap-3">
              {settings.daysPerMonthOptions.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, daysPerMonthOptions: [] })}
                  className="text-[11px] text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                >
                  Clear All
                </button>
              )}
              <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowMonthlySelection}
                  onChange={(e) => setSettings({ ...settings, allowMonthlySelection: e.target.checked })}
                  className="accent-[#184c3c]"
                />
                <span>Enabled</span>
              </label>
            </div>
          </div>
          {settings.daysPerMonthOptions.length === 0 ? (
            <p className="text-xs text-[#78857f] italic py-1">
              No monthly options configured.
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {settings.daysPerMonthOptions.map((opt) => (
                <span key={opt} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-[#d6cfc1] text-xs font-medium">
                  {opt}
                  <button
                    type="button"
                    onClick={() =>
                      setSettings({
                        ...settings,
                        daysPerMonthOptions: settings.daysPerMonthOptions.filter((d) => d !== opt),
                      })
                    }
                    className="text-red-500 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={newMonthlyDay}
              onChange={(e) => setNewMonthlyDay(e.target.value)}
              placeholder="e.g. 10 Days / Month"
              className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#d6cfc1] text-xs"
            />
            <button
              type="button"
              onClick={() => {
                const v = newMonthlyDay.trim();
                if (v && !settings.daysPerMonthOptions.includes(v)) {
                  setSettings({ ...settings, daysPerMonthOptions: [...settings.daysPerMonthOptions, v] });
                  setNewMonthlyDay('');
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-[#184c3c] text-white text-xs font-semibold cursor-pointer inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
