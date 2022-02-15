export const saveStorage = (key: string, value: any) =>
  localStorage.setItem(key, JSON.stringify(value))

export const getStorage = (key: string) => {
  const value = localStorage.getItem(key)
  return value ? JSON.parse(value) : null
}
