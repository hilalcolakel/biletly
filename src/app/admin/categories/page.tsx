'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Ticket, ArrowLeft, Plus, X, Edit2, Trash2, GripVertical, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface CategoryForm {
  name: string
  slug: string
  icon: string
  color: string
  sort_order: string
}

const emptyForm: CategoryForm = { name: '', slug: '', icon: '🎫', color: '#8b5cf6', sort_order: '0' }

export default function AdminCategoriesPage() {
  const supabase = createClient()
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<CategoryForm>(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const { data } = await supabase
      .from('event_categories')
      .select('*')
      .order('sort_order', { ascending: true })
    setCategories(data || [])
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9ğüşıöç]+/g, '-').replace(/(^-|-$)/g, '')
    const payload = {
      name: form.name,
      slug,
      icon: form.icon,
      color: form.color,
      sort_order: parseInt(form.sort_order) || 0,
    }

    if (editingId) {
      await supabase.from('event_categories').update(payload).eq('id', editingId)
    } else {
      await supabase.from('event_categories').insert(payload)
    }
    setSaving(false)
    setShowModal(false)
    setEditingId(null)
    setForm(emptyForm)
    loadData()
  }

  const openEdit = (cat: any) => {
    setEditingId(cat.id)
    setForm({
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon || '🎫',
      color: cat.color || '#8b5cf6',
      sort_order: cat.sort_order?.toString() || '0',
    })
    setShowModal(true)
  }

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('event_categories').update({ is_active: !current }).eq('id', id)
    loadData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kategoriyi silmek istediğinden emin misin?')) return
    await supabase.from('event_categories').delete().eq('id', id)
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

        <div className="flex items-center justify-between mb-1">
          <h1 className="font-display text-[28px] font-bold tracking-tight">Kategoriler</h1>
          <button onClick={() => { setEditingId(null); setForm(emptyForm); setShowModal(true) }}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 px-4 py-2 rounded-xl transition-colors">
            <Plus className="w-4 h-4" /> Yeni Kategori
          </button>
        </div>
        <p className="text-sm text-zinc-400 mb-8">{categories.length} kategori</p>

        <div className="space-y-2">
          {categories.map(cat => (
            <div key={cat.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${cat.is_active ? 'border-zinc-100 hover:border-zinc-200' : 'border-zinc-200 bg-zinc-50/50 opacity-60'}`}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ backgroundColor: cat.color + '20' }}>
                  {cat.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{cat.name}</h3>
                  <p className="text-xs text-zinc-400">/{cat.slug} · Sıra: {cat.sort_order}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="w-5 h-5 rounded-full border border-zinc-200" style={{ backgroundColor: cat.color }} title={cat.color} />
                <button onClick={() => openEdit(cat)} className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-all" title="Düzenle">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => toggleActive(cat.id, cat.is_active)}
                  className={`p-1.5 rounded-lg transition-all ${cat.is_active ? 'hover:bg-zinc-100 text-zinc-400' : 'hover:bg-emerald-50 text-emerald-500'}`}
                  title={cat.is_active ? 'Pasifleştir' : 'Aktifleştir'}>
                  {cat.is_active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-zinc-400 hover:text-red-500 transition-all" title="Sil">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          {categories.length === 0 && <p className="text-center text-sm text-zinc-400 py-12">Henüz kategori yok.</p>}
        </div>
      </div>

      {/* Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-zinc-100">
              <h2 className="font-display text-lg font-bold">{editingId ? 'Kategori Düzenle' : 'Yeni Kategori'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-zinc-100 rounded-lg"><X className="w-5 h-5 text-zinc-400" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Kategori Adı *</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-400" placeholder="ör. Konser" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Slug</label>
                <input type="text" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})}
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-400" placeholder="otomatik oluşturulur" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">İkon</label>
                  <input type="text" value={form.icon} onChange={e => setForm({...form, icon: e.target.value})}
                    className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-center outline-none focus:border-zinc-400" placeholder="🎫" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Renk</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.color} onChange={e => setForm({...form, color: e.target.value})}
                      className="w-10 h-10 border border-zinc-200 rounded-xl cursor-pointer" />
                    <input type="text" value={form.color} onChange={e => setForm({...form, color: e.target.value})}
                      className="flex-1 border border-zinc-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-zinc-400 font-mono" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Sıra</label>
                  <input type="number" min="0" value={form.sort_order} onChange={e => setForm({...form, sort_order: e.target.value})}
                    className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-400" />
                </div>
              </div>
              {/* Preview */}
              <div className="bg-zinc-50 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: form.color + '20' }}>
                  {form.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold">{form.name || 'Kategori Adı'}</p>
                  <p className="text-xs text-zinc-400">/{form.slug || 'slug'}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 p-5 border-t border-zinc-100">
              <button onClick={() => setShowModal(false)} className="text-sm text-zinc-500 hover:text-zinc-900 px-4 py-2 rounded-xl transition-colors">İptal</button>
              <button onClick={handleSave} disabled={saving || !form.name}
                className="text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 px-6 py-2.5 rounded-xl transition-colors">
                {saving ? 'Kaydediliyor...' : editingId ? 'Güncelle' : 'Oluştur'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
