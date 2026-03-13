'use client'

import { useState, useEffect } from 'react'
import { X, FileText, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { LegalDocument } from '@/types/database'

interface KvkkModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: (version: string) => void
  type?: 'kvkk' | 'terms' | 'seller_agreement'
}

export default function LegalModal({ isOpen, onClose, onAccept, type = 'kvkk' }: KvkkModalProps) {
  const supabase = createClient()
  const [document, setDocument] = useState<LegalDocument | null>(null)
  const [loading, setLoading] = useState(true)
  const [scrolledToBottom, setScrolledToBottom] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadDocument()
      setScrolledToBottom(false)
    }
  }, [isOpen, type])

  const loadDocument = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('legal_documents')
      .select('*')
      .eq('type', type)
      .eq('is_active', true)
      .single()
    setDocument(data)
    setLoading(false)
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40
    if (atBottom) setScrolledToBottom(true)
  }

  if (!isOpen) return null

  const titles: Record<string, string> = {
    kvkk: 'KVKK Aydınlatma Metni',
    terms: 'Kullanım Koşulları',
    seller_agreement: 'Satıcı Sözleşmesi',
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-[520px] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl animate-fade-in-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-violet-500/10 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-violet-400" />
            </div>
            <h2 className="text-sm font-semibold text-white">{titles[type] || document?.title}</h2>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div
          onScroll={handleScroll}
          className="px-6 py-5 max-h-[400px] overflow-y-auto text-sm text-zinc-400 leading-relaxed custom-scrollbar"
        >
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : document ? (
            <div className="space-y-4">
              {document.content.split('\n\n').map((paragraph, i) => {
                if (paragraph.startsWith('## ')) {
                  return <h3 key={i} className="text-white font-semibold text-sm mt-4">{paragraph.replace('## ', '')}</h3>
                }
                if (paragraph.startsWith('- ')) {
                  return (
                    <ul key={i} className="space-y-1 ml-4">
                      {paragraph.split('\n').map((line, j) => (
                        <li key={j} className="list-disc text-zinc-400">{line.replace('- ', '')}</li>
                      ))}
                    </ul>
                  )
                }
                if (/^\d+\./.test(paragraph)) {
                  return (
                    <ol key={i} className="space-y-1 ml-4">
                      {paragraph.split('\n').map((line, j) => (
                        <li key={j} className="list-decimal text-zinc-400">{line.replace(/^\d+\.\s*/, '')}</li>
                      ))}
                    </ol>
                  )
                }
                return <p key={i}>{paragraph}</p>
              })}
              <p className="text-[11px] text-zinc-600 mt-6">
                Sürüm: {document.version} • Yayın: {new Date(document.created_at).toLocaleDateString('tr-TR')}
              </p>
            </div>
          ) : (
            <p className="text-zinc-600 text-center py-8">Belge yüklenemedi.</p>
          )}
        </div>

        {/* Scroll indicator */}
        {!scrolledToBottom && !loading && (
          <div className="absolute bottom-[72px] left-0 right-0 flex justify-center pointer-events-none">
            <div className="bg-zinc-800/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 text-[11px] text-zinc-400 animate-bounce">
              <ChevronDown className="w-3 h-3" /> Devamını oku
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-zinc-900/50">
          <button
            onClick={onClose}
            className="text-sm text-zinc-500 hover:text-white transition-colors"
          >
            Kapat
          </button>
          <button
            onClick={() => document && onAccept(document.version)}
            disabled={!scrolledToBottom || !document}
            className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl px-5 py-2.5 transition-all active:scale-[0.98] shadow-lg shadow-violet-500/20"
          >
            Okudum, Onaylıyorum
          </button>
        </div>
      </div>
    </div>
  )
}
