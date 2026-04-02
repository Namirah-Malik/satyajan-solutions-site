// Popup permanently disabled
export function useScrollModal(_options?: any) {
  return {
    showModal: false,
    closeModal: () => {},
  }
}
