const waitEvent = (
  element: HTMLElement | Element,
  eventName: string
): Promise<void> =>
  new Promise((resolve) => {
    element.addEventListener(eventName, () => resolve())
  })

export default waitEvent
