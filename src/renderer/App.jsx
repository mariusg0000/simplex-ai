/**
 * App.jsx — src/renderer/App.jsx
 * Root layout component for Simplex AI.
 * Composes Sidebar, ChatView, StatusBar, and Settings modal.
 * Owns session lifecycle, chat lifecycle, settings, and theme state.
 */
import React from 'react'
import { ChatView } from './components/ChatView.jsx'
import { Sidebar } from './components/Sidebar.jsx'
import { Settings } from './components/Settings.jsx'
import { StatusBar } from './components/StatusBar.jsx'
import { useSessions } from './hooks/useSessions.js'
import { useSettings } from './hooks/useSettings.js'
import { useChat } from './hooks/useChat.js'
import { useTheme } from './hooks/useTheme.js'

export default function App() {
  const [showSettings, setShowSettings] = React.useState(false)
  const sessions = useSessions()
  const settings = useSettings()
  const chat = useChat({
    onSave: async (messages, sessionId) => {
      let currentId = sessionId || sessions.currentId()
      if (!currentId) {
        const title = messages.find((m) => m.role === 'user')?.content?.slice(0, 50) || 'New Chat'
        currentId = await sessions.create(title)
      }
      await sessions.saveMessages(currentId, messages)
    },
  })

  // Theme — read from config, save back via settings.save on toggle
  const { theme, toggleTheme } = useTheme(
    settings.values.theme,
    (newTheme) => settings.save({ ...settings.values, theme: newTheme }),
  )

  const handleSelectSession = async (id) => {
    const session = await sessions.load(id)
    if (session) {
      chat.setMessages(session.messages || [])
      sessions.setCurrentId(id)
    }
  }

  const handleNewSession = () => {
    sessions.create()
    chat.setMessages([])
  }

  const handleDeleteSession = async (id) => {
    const isCurrent = sessions.currentId() === id
    await sessions.remove(id)
    if (isCurrent) {
      const remaining = await window.ipc.invoke('sessions:list')
      if (remaining.length > 0) {
        await handleSelectSession(remaining[0].id)
      } else {
        chat.setMessages([])
      }
    }
  }

  const handleSend = async (content) => {
    const msg = { role: 'user', content }
    const updatedMessages = [...chat.messages, msg]
    chat.setMessages(updatedMessages)

    let currentId = sessions.currentId()
    if (!currentId) {
      currentId = await sessions.create(content.slice(0, 50))
    }

    chat.send(updatedMessages, currentId)
  }

  return (
    <div className="app-layout">
      <Sidebar
        sessions={sessions.list()}
        currentId={sessions.currentId()}
        onSelect={handleSelectSession}
        onNew={handleNewSession}
        onDelete={handleDeleteSession}
        onRename={sessions.rename}
        onSettings={() => setShowSettings(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <div className="main-area">
        <ChatView
          messages={chat.messages}
          onSend={handleSend}
          streaming={chat.streaming}
          reasoning={chat.reasoning}
          onAbort={chat.cancel}
        />
        <StatusBar
          tokens={chat.tokenCount}
          cost={chat.cost}
          status={chat.status}
          activeModel={settings.values.chatModel}
        />
      </div>
      {showSettings && (
        <Settings
          values={settings.values}
          providers={settings.providers}
          loaded={settings.loaded}
          fetchModels={settings.fetchModels}
          onSave={settings.save}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
