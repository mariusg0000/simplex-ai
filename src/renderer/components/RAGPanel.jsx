/**
 * RAGPanel.jsx — src/renderer/components/RAGPanel.jsx
 * Placeholder panel for RAG (Retrieval-Augmented Generation) controls.
 * Displayed at the bottom of the Sidebar with a Beta badge.
 */
import React from 'react'
import { Database } from 'lucide-react'

export function RAGPanel() {
  return (
    <div className="rag-panel">
      <div className="rag-panel-header">
        <Database size={12} />
        <span className="rag-panel-title">RAG</span>
        <span className="rag-badge">Beta</span>
      </div>
      <div className="rag-panel-content">
        <p className="text-muted">Knowledge base — coming soon</p>
      </div>
    </div>
  )
}
