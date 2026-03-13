'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Ticket, ArrowLeft, FileText, Plus, Edit3, Check, X, Eye, Clock, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { LegalDocument, LegalDocumentType } from '@/types/database'

export default function AdminLegalPage() {
  const router = useRouter()
  const supabase = createClient()

  const [documents, setDocuments] = useState<LegalDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ type: 'kvkk' as LegalDocumentType, version: '', title: '', content: '' })
  const [saving, setSaving] = useState(false)
  const [viewingDoc, setViewingDoc] = useState<LegalDocument | null>(null)

  useEffect(() => { loadData() }, [filterType])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    let query = supabase.from('legal_documents').select('*').order('type').order('created_at', { ascending: false })
    if (filterType !== 'all') query = query.eq('type', filterType)

    const { data } = await query
    setDocuments(data || [])
    setLoading(false)
  }

  const typeLabels: Record<string, string> = {
    kvkk: 'KVKK',
    terms: 'Kullanım Koşulları',
    seller_agreement: 'Satıcı Sözleşmesi',
    privacy: 'Gizlilik Politikası',
  }

  const resetForm = () => {
    setForm({ type: 'kvkk', version: '', title: '', content: '' })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (doc: LegalDocument) => {
    setForm({ type: doc.type, version: doc.version, title: doc.title, content: doc.content })
    setEditingId(doc.id)
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.title || !form.version || !form.content) return
    setSaving(true)

    if (editingId) {
      await supabase.from('legal_documents').update({
        title: form.title,
        version: form.version,
        content: form.content,
      }).eq('id', editingId)
    } else {
      await supabase.from('legal_documents').insert({
        type: form.type,
        version: form.version,
        title: form.title,
        content: form.content,
        is_active: false,
      })
    }

    setSaving(false)
    resetForm()
    loadData()
  }

  const handleSetActive = async (id: string, type: string) => {
    // Deactivate all of same type
    await supabase.from('legal_documents').update({ is_active: false }).eq('type', type)
    // Activate selected
    await supabase.from('legal_documents').update({ is_active: true }).eq('id', id)
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
              <FileText className="w-7 h-7 text-violet-500" /> Hukuki Metinler
            </h1>
            <p className="text-sm text-zinc-400 mt-1">{documents.length} metin sürümü</p>
          </div>
          <button onClick={() => { resetForm(); setShowForm(true) }}
            className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium rounded-xl px-4 py-2.5 transition-colors">
            <Plus className="w-4 h-4" /> Yeni Sürüm
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {[
            { value: 'all', label: 'Tümü' },
            { value: 'kvkk', label: 'KVKK' },
            { value: 'terms', label: 'Kullanım Koşulları' },
            { value: 'seller_agreement', label: 'Satıcı Sözleşmesi' },
            { value: 'privacy', label: 'Gizlilik' },
          ].map((f) => (
            <button key={f.value} onClick={() => setFilterType(f.value)}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                filterType === f.value ? 'bg-zinc-900 text-white' : 'bg-zinc-50 text-zinc-500 hover:bg-zinc-100'
              }`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 mb-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">{editingId ? 'Metni Düzenle' : 'Yeni Metin Sürümü'}</h3>
              <button onClick={resetForm} className="text-zinc-400 hover:text-zinc-900"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Tür</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as LegalDocumentType })}
                    disabled={!!editingId}
                    className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-400 disabled:opacity-50">
                    <option value="kvkk">KVKK</option>
                    <option value="terms">Kullanım Koşulları</option>
                    <option value="seller_agreement">Satıcı Sözleşmesi</option>
                    <option value="privacy">Gizlilik Politikası</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Sürüm</label>
                  <input type="text" value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })}
                    placeholder="1.1" className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Başlık</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Metin başlığı" className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">İçerik (Markdown destekli)</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={12} placeholder="Metin içeriğini buraya yazın..."
                  className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-400 resize-y font-mono text-xs leading-relaxed" />
              </div>
              <div className="flex justify-end">
                <button onClick={handleSave} disabled={saving || !form.title || !form.version || !form.content}
                  className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors">
                  {saving ? 'Kaydediliyor...' : editingId ? 'Güncelle' : 'Oluştur'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Documents List */}
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className={`p-4 rounded-xl border transition-all ${doc.is_active ? 'border-emerald-200 bg-emerald-50/30' : 'border-zinc-100'}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${doc.is_active ? 'bg-emerald-100' : 'bg-zinc-100'}`}>
                    <FileText className={`w-5 h-5 ${doc.is_active ? 'text-emerald-600' : 'text-zinc-400'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{doc.title}</p>
                      {doc.is_active && (
                        <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">
                          <Star className="w-2.5 h-2.5" /> Aktif
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[11px] text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">
                        {typeLabels[doc.type]}
                      </span>
                      <span className="text-[11px] text-zinc-400">v{doc.version}</span>
                      <span className="flex items-center gap-1 text-[11px] text-zinc-300">
                        <Clock className="w-3 h-3" /> {new Date(doc.created_at).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!doc.is_active && (
                    <button onClick={() => handleSetActive(doc.id, doc.type)}
                      className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-2 py-1 rounded-lg transition-colors">
                      <Check className="w-3 h-3" /> Aktif Yap
                    </button>
                  )}
                  <button onClick={() => setViewingDoc(doc)}
                    className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors">
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleEdit(doc)}
                    className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {documents.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-8 h-8 text-zinc-200 mx-auto mb-3" />
              <p className="text-sm text-zinc-400">Henüz hukuki metin tanımlanmamış.</p>
            </div>
          )}
        </div>
      </div>

      {/* Document Preview Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewingDoc(null)} />
          <div className="relative w-full max-w-[600px] bg-white rounded-2xl shadow-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
              <div>
                <h3 className="text-sm font-semibold">{viewingDoc.title}</h3>
                <p className="text-[11px] text-zinc-400">v{viewingDoc.version} • {typeLabels[viewingDoc.type]}</p>
              </div>
              <button onClick={() => setViewingDoc(null)} className="text-zinc-400 hover:text-zinc-900"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-5 overflow-y-auto text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap">
              {viewingDoc.content}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
