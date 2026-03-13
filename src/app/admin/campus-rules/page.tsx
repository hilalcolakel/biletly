'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Ticket, ArrowLeft, GraduationCap, Plus, Trash2, Edit3, Save, X, Globe, KeyRound, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { CampusRule } from '@/types/database'

export default function AdminCampusRulesPage() {
  const router = useRouter()
  const supabase = createClient()

  const [rules, setRules] = useState<CampusRule[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ campus_name: '', email_domain: '', invite_code: '', max_users: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }
    const { data } = await supabase.from('campus_rules').select('*').order('campus_name')
    setRules(data || [])
    setLoading(false)
  }

  const resetForm = () => {
    setForm({ campus_name: '', email_domain: '', invite_code: '', max_users: '' })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (rule: CampusRule) => {
    setForm({
      campus_name: rule.campus_name,
      email_domain: rule.email_domain,
      invite_code: rule.invite_code || '',
      max_users: rule.max_users?.toString() || '',
    })
    setEditingId(rule.id)
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.campus_name || !form.email_domain) return
    setSaving(true)

    const payload = {
      campus_name: form.campus_name,
      email_domain: form.email_domain,
      invite_code: form.invite_code || null,
      max_users: form.max_users ? parseInt(form.max_users) : null,
    }

    if (editingId) {
      await supabase.from('campus_rules').update(payload).eq('id', editingId)
    } else {
      await supabase.from('campus_rules').insert(payload)
    }

    setSaving(false)
    resetForm()
    loadData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kampüs kuralını silmek istediğinize emin misiniz?')) return
    await supabase.from('campus_rules').delete().eq('id', id)
    loadData()
  }

  const handleToggleActive = async (id: string, current: boolean) => {
    await supabase.from('campus_rules').update({ is_active: !current }).eq('id', id)
    loadData()
  }

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center"><p className="text-sm text-zinc-400">Yükleniyor...</p></div>

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-100">
        <div className="max-w-[980px] mx-auto px-6 h-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5">
            <Ticket className="w-[18px] h-[18px] text-zinc-900" strokeWidth={2.2} />
            <span className="font-display text-[15px] font-semibold tracking-tight">biletly</span>
          </Link>
          <span className="text-[11px] font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Admin</span>
        </div>
      </nav>

      <div className="max-w-[980px] mx-auto px-6 py-12">
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-900 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Admin Panel
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-[28px] font-bold tracking-tight flex items-center gap-3">
              <GraduationCap className="w-7 h-7 text-violet-500" /> Kampüs Kuralları
            </h1>
            <p className="text-sm text-zinc-400 mt-1">{rules.length} kampüs tanımlı</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true) }}
            className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium rounded-xl px-4 py-2.5 transition-colors"
          >
            <Plus className="w-4 h-4" /> Kampüs Ekle
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 mb-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">{editingId ? 'Kampüs Düzenle' : 'Yeni Kampüs Ekle'}</h3>
              <button onClick={resetForm} className="text-zinc-400 hover:text-zinc-900"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Kampüs Adı</label>
                <input type="text" value={form.campus_name} onChange={(e) => setForm({ ...form, campus_name: e.target.value })}
                  placeholder="Boğaziçi Üniversitesi" className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">E-posta Domain</label>
                <input type="text" value={form.email_domain} onChange={(e) => setForm({ ...form, email_domain: e.target.value })}
                  placeholder="boun.edu.tr" className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Davet Kodu (isteğe bağlı)</label>
                <input type="text" value={form.invite_code} onChange={(e) => setForm({ ...form, invite_code: e.target.value.toUpperCase() })}
                  placeholder="BOUN-2024" className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm font-mono outline-none focus:border-zinc-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Max Kullanıcı (isteğe bağlı)</label>
                <input type="number" value={form.max_users} onChange={(e) => setForm({ ...form, max_users: e.target.value })}
                  placeholder="500" className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-400" />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={handleSave} disabled={saving || !form.campus_name || !form.email_domain}
                className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors">
                <Save className="w-3.5 h-3.5" /> {saving ? 'Kaydediliyor...' : editingId ? 'Güncelle' : 'Ekle'}
              </button>
            </div>
          </div>
        )}

        {/* Rules List */}
        <div className="space-y-3">
          {rules.map((rule) => (
            <div key={rule.id} className={`p-4 rounded-xl border transition-all ${rule.is_active ? 'border-zinc-100' : 'border-zinc-100 bg-zinc-50 opacity-60'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${rule.is_active ? 'bg-violet-50' : 'bg-zinc-100'}`}>
                    <GraduationCap className={`w-5 h-5 ${rule.is_active ? 'text-violet-500' : 'text-zinc-400'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{rule.campus_name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-[11px] text-zinc-400">
                        <Globe className="w-3 h-3" /> @{rule.email_domain}
                      </span>
                      {rule.invite_code && (
                        <span className="flex items-center gap-1 text-[11px] text-zinc-400">
                          <KeyRound className="w-3 h-3" /> {rule.invite_code}
                        </span>
                      )}
                      {rule.max_users && (
                        <span className="flex items-center gap-1 text-[11px] text-zinc-400">
                          <Users className="w-3 h-3" /> Max {rule.max_users}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleToggleActive(rule.id, rule.is_active)}
                    className={`text-[11px] font-medium px-2 py-1 rounded-lg ${rule.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-500'}`}>
                    {rule.is_active ? 'Aktif' : 'Pasif'}
                  </button>
                  <button onClick={() => handleEdit(rule)} className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(rule.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-zinc-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {rules.length === 0 && (
            <div className="text-center py-12">
              <GraduationCap className="w-8 h-8 text-zinc-200 mx-auto mb-3" />
              <p className="text-sm text-zinc-400">Henüz kampüs kuralı tanımlanmamış.</p>
              <p className="text-xs text-zinc-300 mt-1">Yukarıdaki butonla yeni kampüs ekleyin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
