import React from 'react'

export function ModelSelector({ label, providers, selectedProvider, selectedModel, fetchModels, onProviderChange, onModelChange }) {
  const [models, setModels] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [loaded, setLoaded] = React.useState(false)

  React.useEffect(() => {
    if (!selectedProvider || loaded) return
    loadModels(selectedProvider)
  }, [selectedProvider])

  const loadModels = async (provider) => {
    setLoading(true)
    try {
      const result = await fetchModels(provider)
      setModels(result)
      setLoaded(true)
    } catch {
      setModels([])
    } finally {
      setLoading(false)
    }
  }

  const handleProviderChange = (e) => {
    const provider = e.target.value
    setLoaded(false)
    setModels([])
    onProviderChange(provider)
    if (provider) loadModels(provider)
  }

  const handleModelInput = (e) => {
    onModelChange(e.target.value)
  }

  const datalistId = `models-${label.replace(/\s+/g, '-').toLowerCase()}`

  return (
    <div className="model-selector">
      <label>{label}</label>
      <div className="model-selector-row">
        <select value={selectedProvider} onChange={handleProviderChange}>
          <option value="">-- Provider --</option>
          {providers.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        {loading && <span className="text-muted">Loading...</span>}
      </div>
      {models.length > 0 && (
        <input
          type="text"
          list={datalistId}
          placeholder="Select or type model..."
          value={selectedModel || ''}
          onChange={handleModelInput}
          className="model-combo-input"
        />
      )}
      {models.length > 0 && (
        <datalist id={datalistId}>
          {models.slice(0, 200).map((m) => (
            <option key={m} value={m} />
          ))}
        </datalist>
      )}
    </div>
  )
}
