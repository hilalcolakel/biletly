'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Ticket, ArrowLeft, Calendar, MapPin, Trash2, Search, Eye, EyeOff, Plus, X, Edit2, Settings, Music, Trophy, Drama, PartyPopper, Tag } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const CATEGORY_META: Record<string, { icon: string; color: string; label: string }> = {
  concert: { icon: '🎵', color: 'bg-violet-100 text-violet-700', label: 'Konser' },
  sport: { icon: '⚽', color: 'bg-orange-100 text-orange-700', label: 'Spor' },
  theatre: { icon: '🎭', color: 'bg-emerald-100 text-emerald-700', label: 'Tiyatro' },
  festival: { icon: '🎉', color: 'bg-pink-100 text-pink-700', label: 'Festival' },
  other: { icon: '🎫', color: 'bg-zinc-100 text-zinc-700', label: 'Diğer' },
}

interface EventForm {
  title: string
  description: string
  artist: string
  category: string
  city: string
  venue: string
  event_date: string
  image_url: string
  tags: string
}

const emptyForm: EventForm = {
  title: '', description: '', artist: '', category: 'concert',
  city: '', venue: '', event_date: '', image_url: '', tags: ''
}

interface ConstraintForm {
  allowed_delivery_types: string[]
  max_ticket_price: string
  min_seller_trust_score: string
  max_listings_per_seller: string
  requires_proof: boolean
  notes: string
}

const emptyConstraint: ConstraintForm = {
  allowed_delivery_types: ['transfer', 'pdf_qr'],
  max_ticket_price: '', min_seller_trust_score: '0',
  max_listings_per_seller: '5', requires_proof: false, notes: ''
}

export default function AdminEventsPage() {
  const supabase = createClient()
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<EventForm>(emptyForm)
  const [saving, setSaving] = useState(false)

  // Constraint modal
  const [showConstraintModal, setShowConstraintModal] = useState(false)
  const [constraintEventId, setConstraintEventId] = useState<string | null>(null)
  const [constraintForm, setConstraintForm] = useState<ConstraintForm>(emptyConstraint)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const { data } = await supabase
      .from('events')
      .select('*, listings(count), event_constraints(*)')
      .order('event_date', { ascending: false })
    setEvents(data || [])
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const slug = form.title.toLowerCase().replace(/[^a-z0-9ğüşıöç]+/g, '-').replace(/(^-|-$)/g, '')
    const payload = {
      title: form.title,
      description: form.description || null,
      artist: form.artist || null,
      category: form.category,
      city: form.city,
      venue: form.venue,
      event_date: form.event_date,
      image_url: form.image_url || null,
      slug: slug + '-' + Date.now().toString(36),
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    }

    if (editingId) {
      await supabase.from('events').update(payload).eq('id', editingId)
    } else {
      await supabase.from('events').insert(payload)
    }
    setSaving(false)
    setShowModal(false)
    setEditingId(null)
    setForm(emptyForm)
    loadData()
  }

  const openEdit = (event: any) => {
    setEditingId(event.id)
    setForm({
      title: event.title,
      description: event.description || '',
      artist: event.artist || '',
      category: event.category,
      city: event.city,
      venue: event.venue,
      event_date: event.event_date?.slice(0, 16) || '',
      image_url: event.image_url || '',
      tags: event.tags?.join(', ') || '',
    })
    setShowModal(true)
  }

  const openConstraint = (event: any) => {
    setConstraintEventId(event.id)
    const c = event.event_constraints?.[0]
    if (c) {
      setConstraintForm({
        allowed_delivery_types: c.allowed_delivery_types || ['transfer', 'pdf_qr'],
        max_ticket_price: c.max_ticket_price?.toString() || '',
        min_seller_trust_score: c.min_seller_trust_score?.toString() || '0',
        max_listings_per_seller: c.max_listings_per_seller?.toString() || '5',
        requires_proof: c.requires_proof || false,
        notes: c.notes || '',
      })
    } else {
      setConstraintForm(emptyConstraint)
    }
    setShowConstraintModal(true)
  }

  const saveConstraint = async () => {
    if (!constraintEventId) return
    setSaving(true)
    const payload = {
      event_id: constraintEventId,
      allowed_delivery_types: constraintForm.allowed_delivery_types,
      max_ticket_price: constraintForm.max_ticket_price ? parseFloat(constraintForm.max_ticket_price) : null,
      min_seller_trust_score: parseInt(constraintForm.min_seller_trust_score) || 0,
      max_listings_per_seller: parseInt(constraintForm.max_listings_per_seller) || 5,
      requires_proof: constraintForm.requires_proof,
      notes: constraintForm.notes || null,
    }
    await supabase.from('event_constraints').upsert(payload, { onConflict: 'event_id' })
    setSaving(false)
    setShowConstraintModal(false)
    loadData()
  }

  const handleToggleActive = async (id: string, active: boolean) => {
    await supabase.from('events').update({ is_active: !active }).eq('id', id)
    loadData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu etkinliği silmek istediğinden emin misin?')) return
    await supabase.from('events').delete().eq('id', id)
    loadData()
  }

  const filtered = events.filter(e => {
    const q = searchQuery.toLowerCase()
    const matchSearch = !q || e.title.toLowerCase().includes(q) || e.city?.toLowerCase().includes(q) || e.venue?.toLowerCase().includes(q) || e.artist?.toLowerCase().includes(q)
    const matchCat = categoryFilter === 'all' || e.category === categoryFilter
    return matchSearch && matchCat
  })

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
          <h1 className="font-display text-[28px] font-bold tracking-tight">Etkinlikler</h1>
          <button onClick={() => { setEditingId(null); setForm(emptyForm); setShowModal(true) }}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 px-4 py-2 rounded-xl transition-colors">
            <Plus className="w-4 h-4" /> Yeni Etkinlik
          </button>
        </div>
        <p className="text-sm text-zinc-400 mb-6">{events.length} etkinlik</p>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Etkinlik, şehir, mekan veya sanatçı ara..."
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-300 outline-none focus:border-zinc-400 focus:bg-white transition-all" />
          </div>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
            className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-400">
            <option value="all">Tüm Kategoriler</option>
            <option value="concert">🎵 Konser</option>
            <option value="sport">⚽ Spor</option>
            <option value="theatre">🎭 Tiyatro</option>
            <option value="festival">🎉 Festival</option>
            <option value="other">🎫 Diğer</option>
          </select>
        </div>

        {/* Event list */}
        <div className="space-y-2">
          {filtered.map(event => {
            const date = new Date(event.event_date)
            const isPast = date < new Date()
            const listingCount = event.listings?.[0]?.count || 0
            const cat = CATEGORY_META[event.category] || CATEGORY_META.other
            const hasConstraints = event.event_constraints?.length > 0

            return (
              <div key={event.id} className={`p-4 rounded-xl border transition-all ${!event.is_active ? 'border-zinc-200 bg-zinc-50/50 opacity-60' : isPast ? 'border-amber-200 bg-amber-50/20' : 'border-zinc-100 hover:border-zinc-200'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-sm font-semibold truncate">{event.title}</h3>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${cat.color}`}>{cat.icon} {cat.label}</span>
                      {event.artist && <span className="text-[10px] text-zinc-400">• {event.artist}</span>}
                      {!event.is_active && <span className="text-[10px] font-medium text-zinc-500 bg-zinc-200 px-1.5 py-0.5 rounded">GİZLİ</span>}
                      {isPast && <span className="text-[10px] font-medium text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">GEÇMİŞ</span>}
                      {hasConstraints && <span className="text-[10px] font-medium text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">KISITLI</span>}
                    </div>
                    {event.description && <p className="text-xs text-zinc-400 mb-1 truncate max-w-xl">{event.description}</p>}
                    <div className="flex items-center gap-3 text-xs text-zinc-400">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.venue}, {event.city}</span>
                      <span>{listingCount} ilan</span>
                      {event.tags?.length > 0 && <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{event.tags.join(', ')}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 ml-3 shrink-0">
                    <button onClick={() => openConstraint(event)} className="p-1.5 rounded-lg hover:bg-blue-50 text-zinc-400 hover:text-blue-500 transition-all" title="Kısıtlar">
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => openEdit(event)} className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-all" title="Düzenle">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleToggleActive(event.id, event.is_active)}
                      className={`p-1.5 rounded-lg transition-all ${event.is_active ? 'hover:bg-zinc-100 text-zinc-400' : 'hover:bg-emerald-50 text-emerald-500'}`}
                      title={event.is_active ? 'Gizle' : 'Aktifleştir'}>
                      {event.is_active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => handleDelete(event.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-zinc-400 hover:text-red-500 transition-all" title="Sil">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && <p className="text-center text-sm text-zinc-400 py-12">Etkinlik bulunamadı.</p>}
        </div>
      </div>

      {/* Event Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-zinc-100">
              <h2 className="font-display text-lg font-bold">{editingId ? 'Etkinlik Düzenle' : 'Yeni Etkinlik'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-zinc-100 rounded-lg"><X className="w-5 h-5 text-zinc-400" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Etkinlik Adı *</label>
                <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-400" placeholder="ör. Tarkan Konseri" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Açıklama</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-400 resize-none" rows={3} placeholder="Etkinlik açıklaması..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Sanatçı / Takım</label>
                  <input type="text" value={form.artist} onChange={e => setForm({...form, artist: e.target.value})}
                    className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-400" placeholder="ör. Tarkan" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Kategori *</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                    className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-400 bg-white">
                    <option value="concert">🎵 Konser</option>
                    <option value="sport">⚽ Spor</option>
                    <option value="theatre">🎭 Tiyatro</option>
                    <option value="festival">🎉 Festival</option>
                    <option value="other">🎫 Diğer</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Şehir *</label>
                  <input type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})}
                    className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-400" placeholder="ör. İstanbul" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Mekan *</label>
                  <input type="text" value={form.venue} onChange={e => setForm({...form, venue: e.target.value})}
                    className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-400" placeholder="ör. Harbiye Açıkhava" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Tarih & Saat *</label>
                <input type="datetime-local" value={form.event_date} onChange={e => setForm({...form, event_date: e.target.value})}
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Görsel URL</label>
                <input type="url" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})}
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-400" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Etiketler (virgülle ayırın)</label>
                <input type="text" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})}
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-400" placeholder="ör. pop, yaz konseri, açık hava" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 p-5 border-t border-zinc-100">
              <button onClick={() => setShowModal(false)} className="text-sm text-zinc-500 hover:text-zinc-900 px-4 py-2 rounded-xl transition-colors">İptal</button>
              <button onClick={handleSave} disabled={saving || !form.title || !form.city || !form.venue || !form.event_date}
                className="text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 px-6 py-2.5 rounded-xl transition-colors">
                {saving ? 'Kaydediliyor...' : editingId ? 'Güncelle' : 'Oluştur'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Constraint Modal */}
      {showConstraintModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-zinc-100">
              <h2 className="font-display text-lg font-bold">Etkinlik Kısıtları</h2>
              <button onClick={() => setShowConstraintModal(false)} className="p-1 hover:bg-zinc-100 rounded-lg"><X className="w-5 h-5 text-zinc-400" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-2">İzin Verilen Teslim Yöntemleri</label>
                <div className="flex gap-3">
                  {['transfer', 'pdf_qr'].map(type => (
                    <label key={type} className="flex items-center gap-2 text-sm">
                      <input type="checkbox"
                        checked={constraintForm.allowed_delivery_types.includes(type)}
                        onChange={e => {
                          setConstraintForm(prev => ({
                            ...prev,
                            allowed_delivery_types: e.target.checked
                              ? [...prev.allowed_delivery_types, type]
                              : prev.allowed_delivery_types.filter(t => t !== type)
                          }))
                        }}
                        className="rounded border-zinc-300" />
                      {type === 'transfer' ? 'Transfer' : 'PDF / QR'}
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Max Bilet Fiyatı (₺)</label>
                  <input type="number" value={constraintForm.max_ticket_price} onChange={e => setConstraintForm({...constraintForm, max_ticket_price: e.target.value})}
                    className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-400" placeholder="Limit yok" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Min Satıcı Trust Score</label>
                  <input type="number" min="0" max="100" value={constraintForm.min_seller_trust_score} onChange={e => setConstraintForm({...constraintForm, min_seller_trust_score: e.target.value})}
                    className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Max İlan / Satıcı</label>
                  <input type="number" min="1" value={constraintForm.max_listings_per_seller} onChange={e => setConstraintForm({...constraintForm, max_listings_per_seller: e.target.value})}
                    className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-400" />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={constraintForm.requires_proof} onChange={e => setConstraintForm({...constraintForm, requires_proof: e.target.checked})} className="rounded border-zinc-300" />
                    Sahiplik kanıtı zorunlu
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Not</label>
                <textarea value={constraintForm.notes} onChange={e => setConstraintForm({...constraintForm, notes: e.target.value})}
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-400 resize-none" rows={2} placeholder="Admin notu..." />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 p-5 border-t border-zinc-100">
              <button onClick={() => setShowConstraintModal(false)} className="text-sm text-zinc-500 hover:text-zinc-900 px-4 py-2 rounded-xl transition-colors">İptal</button>
              <button onClick={saveConstraint} disabled={saving}
                className="text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 px-6 py-2.5 rounded-xl transition-colors">
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
