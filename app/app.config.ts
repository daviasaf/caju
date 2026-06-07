export default defineAppConfig({
  ui: {
    colors: {
      primary: 'yellow',
      secondary: 'sky',
      success: 'green',
      warning: 'orange',
      error: 'red',
      neutral: 'zinc'
    },
    button: {
      slots: {
        base: 'font-bold rounded-lg shadow-none'
      },
      compoundVariants: [
        {
          color: 'primary',
          variant: 'solid',
          class: 'text-black'
        },
        {
          color: 'neutral',
          variant: 'soft',
          class: ''
        }
      ]
    },
    card: {
      slots: {
        root:
          'rounded-xl border border-[color:var(--caju-border)] !bg-white !text-[var(--caju-ink)] shadow-none'
      }
    }
  }
})
