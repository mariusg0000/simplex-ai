import fs from 'fs'
import path from 'path'
import { config } from '../main/config.js'

function parseSkillMd(content) {
  const sections = {}
  const lines = content.split('\n')
  let current = null
  let buf = []

  for (const line of lines) {
    const m = line.trim().match(/^##\s+(\S+)\s*$/)
    if (m) {
      if (current) sections[current] = buf.join('\n').trim()
      current = m[1].toLowerCase()
      buf = []
    } else {
      buf.push(line)
    }
  }

  if (current) sections[current] = buf.join('\n').trim()
  return sections
}

export class SkillRegistry {
  constructor() {
    this.skills = new Map()
  }

  async discover() {
    const skillDirs = [
      path.join(config.simplexHome, 'skills'),
      path.join(process.cwd(), 'skills'),
    ]

    for (const dir of skillDirs) {
      if (!fs.existsSync(dir)) continue
      const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md') && f.toLowerCase() !== 'readme.md')
      for (const file of files) {
        try {
          const fullPath = path.join(dir, file)
          const raw = fs.readFileSync(fullPath, 'utf-8')
          const sections = parseSkillMd(raw)
          if (!sections.enabled || !sections.skill_description || !sections.skill_prompt) continue
          const enabled = sections.enabled.trim().toLowerCase() === 'enabled'
          const name = path.basename(file, '.md')
          this.skills.set(name, {
            name,
            path: fullPath,
            enabled,
            description: sections.skill_description.trim(),
            skillPrompt: sections.skill_prompt.trim(),
            parameters: {
              type: 'object',
              properties: {
                task: {
                  type: 'string',
                  description: `Task for ${name}. Describe what you need in detail.`,
                },
              },
              required: ['task'],
            },
          })
        } catch {
          // skip
        }
      }
    }
  }

  get(name) {
    return this.skills.get(name)
  }

  list() {
    return Array.from(this.skills.values()).filter((s) => s.enabled)
  }
}

export const skillRegistry = new SkillRegistry()
