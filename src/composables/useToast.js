import { reactive } from 'vue'

const toasts = reactive([])
let idCounter = 0

export function useToast() {
  function showAchievement(achievement) {
    const id = ++idCounter
    toasts.push({ id, emoji: achievement.emoji, text: `ปลดล็อกความสำเร็จ: ${achievement.name}` })
    setTimeout(() => {
      const i = toasts.findIndex((t) => t.id === id)
      if (i > -1) toasts.splice(i, 1)
    }, 2600)
  }

  return { toasts, showAchievement }
}
