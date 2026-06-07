export function useAdminAction() {
  const toast = useToast()

  function success(title: string, description?: string) {
    toast.add({ title, description, color: 'success' })
  }

  function error(title: string, err?: any) {
    toast.add({
      title,
      description: err?.data?.message || err?.statusMessage || err?.message || 'Tente novamente.',
      color: 'error'
    })
  }

  return { success, error }
}
