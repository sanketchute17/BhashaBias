import React, { useState, useEffect } from 'react';
import { Search, Plus, Upload, Download, Trash2, Edit3, Filter } from 'lucide-react';
import { MOCK_SCENARIOS } from '../data/mockData';

export default function Scenarios({ darkMode }) {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingScenario, setEditingScenario] = useState(null);
  const [formData, setFormData] = useState({
    scenario_id: '',
    category: 'Gender',
    english_prompt: '',
    hindi_prompt: '',
    hinglish_prompt: ''
  });

  useEffect(() => {
    fetchScenarios();
  }, [categoryFilter, search]);

  const fetchScenarios = async () => {
    try {
      let url = `/api/scenarios?category=${categoryFilter}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      const ct = res.headers.get('content-type') || '';
      if (res.ok && ct.includes('application/json')) {
        const data = await res.json();
        if (data.success && data.scenarios?.length > 0) {
          setScenarios(data.scenarios);
          return;
        }
      }
      // Fallback to pre-seeded mock scenarios
      let list = [...MOCK_SCENARIOS];
      if (categoryFilter !== 'All') {
        list = list.filter(s => s.category.toLowerCase() === categoryFilter.toLowerCase());
      }
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(s =>
          s.scenario_id.toLowerCase().includes(q) ||
          s.english_prompt.toLowerCase().includes(q) ||
          s.hinglish_prompt?.toLowerCase().includes(q)
        );
      }
      setScenarios(list);
    } catch (e) {
      let list = [...MOCK_SCENARIOS];
      if (categoryFilter !== 'All') {
        list = list.filter(s => s.category.toLowerCase() === categoryFilter.toLowerCase());
      }
      setScenarios(list);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveScenario = async (e) => {
    e.preventDefault();
    try {
      const isEdit = Boolean(editingScenario);
      const url = isEdit ? `/api/scenarios/${editingScenario.id}` : '/api/scenarios';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setEditingScenario(null);
        setFormData({ scenario_id: '', category: 'Gender', english_prompt: '', hindi_prompt: '', hinglish_prompt: '' });
        fetchScenarios();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteScenario = async (id) => {
    if (!confirm('Delete scenario from archive?')) return;
    try {
      const res = await fetch(`/api/scenarios/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchScenarios();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCSVImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const dataForm = new FormData();
    dataForm.append('file', file);

    try {
      const res = await fetch('/api/scenarios/import-csv', {
        method: 'POST',
        body: dataForm
      });
      const json = await res.json();
      if (json.success) {
        alert(json.message);
        fetchScenarios();
      } else {
        alert(json.error);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const cardBg = darkMode ? 'bg-[#1c1814] border-[#524434]' : 'bg-[#ffffff] border-[#b8a68d]';
  const inputBg = darkMode ? 'bg-[#12100e] border-[#524434] text-[#ffffff]' : 'bg-[#faf5ea] border-[#b8a68d] text-[#000000]';
  const textMuted = darkMode ? 'text-[#e5e7eb]' : 'text-[#27272a]';

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-serif">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b-2 border-[#b8a68d] dark:border-[#524434] pb-3">
        <div>
          <div className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#b45309]">
            DATASET ARCHIVE
          </div>
          <h1 className="font-cinzel text-2xl font-black tracking-tight text-[#000000] dark:text-[#ffffff]">
            Multilingual Dataset Management
          </h1>
          <p className={`text-xs font-bold italic mt-0.5 ${textMuted}`}>
            50 Controlled Social Scenarios preserving exact semantic equivalence across English, Hindi, and Hinglish.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-serif text-xs">
          <label className={`flex items-center gap-1.5 px-3 py-2 rounded-md border-2 font-extrabold cursor-pointer transition ${
            darkMode ? 'bg-[#1c1814] border-[#524434] hover:bg-[#26201a]' : 'bg-[#faf5ea] border-[#b8a68d] hover:bg-[#efe5d5]'
          }`}>
            <Upload className="w-4 h-4 text-[#b45309]" />
            Import CSV
            <input type="file" accept=".csv" onChange={handleCSVImport} className="hidden" />
          </label>

          <a
            href="/api/scenarios/export-csv"
            download
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md border-2 font-extrabold transition ${
              darkMode ? 'bg-[#1c1814] border-[#524434] hover:bg-[#26201a]' : 'bg-[#faf5ea] border-[#b8a68d] hover:bg-[#efe5d5]'
            }`}
          >
            <Download className="w-4 h-4 text-[#b45309]" />
            Export CSV
          </a>

          <button
            onClick={() => {
              setEditingScenario(null);
              setFormData({ scenario_id: `S${Date.now().toString().slice(-3)}`, category: 'Gender', english_prompt: '', hindi_prompt: '', hinglish_prompt: '' });
              setShowAddModal(true);
            }}
            className="flex items-center gap-1.5 bg-[#990000] hover:bg-[#800020] text-white font-extrabold px-4 py-2 rounded-md transition shadow"
          >
            <Plus className="w-4 h-4" />
            Add Scenario
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className={`p-4 rounded-xl border-2 ornate-border flex flex-col md:flex-row items-center justify-between gap-4 ${cardBg}`}>
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-[#b45309]" />
          <input
            type="text"
            placeholder="Search scenario ID or prompt text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 text-xs rounded-md border font-mono font-bold ${inputBg}`}
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#000000] dark:text-[#ffffff]">
          <Filter className="w-4 h-4 text-[#b45309]" />
          <span className="font-mono uppercase text-xs">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={`px-3 py-2 rounded-md border font-mono font-bold text-xs ${inputBg}`}
          >
            <option value="All">All Categories ({scenarios.length})</option>
            <option value="Gender">Gender</option>
            <option value="Regional">Regional / Urban-Rural</option>
            <option value="Socio-economic">Socio-economic</option>
            <option value="Education / Career">Education / Career</option>
            <option value="Cultural / Social">Cultural / Social</option>
          </select>
        </div>
      </div>

      {/* Journal Table */}
      <div className={`rounded-xl border-2 ornate-border overflow-hidden shadow-sm ${cardBg}`}>
        <div className="overflow-x-auto">
          <table className="journal-table text-xs">
            <thead>
              <tr className={darkMode ? 'bg-[#12100e] text-[#e5e7eb]' : 'bg-[#faf5ea] text-[#27272a]'}>
                <th className="w-20 font-mono font-extrabold">ID</th>
                <th className="w-36 font-extrabold">Category</th>
                <th className="font-extrabold">English Prompt</th>
                <th className="font-extrabold">Hindi Prompt</th>
                <th className="font-extrabold">Hinglish Prompt</th>
                <th className="w-24 text-right font-extrabold">Actions</th>
              </tr>
            </thead>
            <tbody className="font-medium text-[#000000] dark:text-[#ffffff]">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-[#27272a] dark:text-[#e5e7eb] italic font-bold">Loading archival scenarios...</td>
                </tr>
              ) : scenarios.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-[#27272a] dark:text-[#e5e7eb] italic font-bold">No scenarios found in archive.</td>
                </tr>
              ) : (
                scenarios.map((sc) => (
                  <tr key={sc.id}>
                    <td className="font-mono font-extrabold text-[#990000] dark:text-[#fbbf24]">{sc.scenario_id}</td>
                    <td>
                      <span className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold border ${inputBg}`}>
                        {sc.category}
                      </span>
                    </td>
                    <td className="max-w-xs truncate">{sc.english_prompt}</td>
                    <td className="max-w-xs truncate font-sans">{sc.hindi_prompt}</td>
                    <td className="max-w-xs truncate">{sc.hinglish_prompt}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingScenario(sc);
                            setFormData({
                              scenario_id: sc.scenario_id,
                              category: sc.category,
                              english_prompt: sc.english_prompt,
                              hindi_prompt: sc.hindi_prompt,
                              hinglish_prompt: sc.hinglish_prompt
                            });
                            setShowAddModal(true);
                          }}
                          className="p-1.5 hover:text-[#b45309] transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteScenario(sc.id)}
                          className="p-1.5 hover:text-rose-600 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className={`rounded-xl border-2 ornate-border p-6 w-full max-w-lg space-y-4 shadow-2xl ${cardBg}`}>
            <h2 className="font-cinzel text-base font-bold tracking-tight text-[#000000] dark:text-[#ffffff]">
              {editingScenario ? 'Edit Scenario Record' : 'Add New Scenario Record'}
            </h2>

            <form onSubmit={handleSaveScenario} className="space-y-3 text-xs font-serif">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1 text-[#000000] dark:text-[#ffffff]">Scenario ID</label>
                  <input
                    type="text"
                    required
                    disabled={Boolean(editingScenario)}
                    value={formData.scenario_id}
                    onChange={(e) => setFormData({ ...formData, scenario_id: e.target.value })}
                    className={`w-full p-2 rounded border font-mono font-bold ${inputBg}`}
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1 text-[#000000] dark:text-[#ffffff]">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={`w-full p-2 rounded border font-bold ${inputBg}`}
                  >
                    <option value="Gender">Gender</option>
                    <option value="Regional">Regional / Urban-Rural</option>
                    <option value="Socio-economic">Socio-economic</option>
                    <option value="Education / Career">Education / Career</option>
                    <option value="Cultural / Social">Cultural / Social</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1 text-[#000000] dark:text-[#ffffff]">English Prompt</label>
                <textarea
                  required
                  rows="2"
                  value={formData.english_prompt}
                  onChange={(e) => setFormData({ ...formData, english_prompt: e.target.value })}
                  className={`w-full p-2 rounded border font-medium ${inputBg}`}
                ></textarea>
              </div>

              <div>
                <label className="font-bold block mb-1 text-[#000000] dark:text-[#ffffff]">Hindi Prompt (Devanagari)</label>
                <textarea
                  required
                  rows="2"
                  value={formData.hindi_prompt}
                  onChange={(e) => setFormData({ ...formData, hindi_prompt: e.target.value })}
                  className={`w-full p-2 rounded border font-sans font-medium ${inputBg}`}
                ></textarea>
              </div>

              <div>
                <label className="font-bold block mb-1 text-[#000000] dark:text-[#ffffff]">Hinglish Prompt (Roman Script)</label>
                <textarea
                  required
                  rows="2"
                  value={formData.hinglish_prompt}
                  onChange={(e) => setFormData({ ...formData, hinglish_prompt: e.target.value })}
                  className={`w-full p-2 rounded border font-medium ${inputBg}`}
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`px-4 py-2 rounded-md border font-bold transition ${inputBg}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#990000] hover:bg-[#800020] text-white font-extrabold rounded-md transition shadow"
                >
                  Save Scenario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
