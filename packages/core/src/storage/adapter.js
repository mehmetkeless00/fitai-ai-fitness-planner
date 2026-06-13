// Injectable storage seam. Default uses browser localStorage (graceful no-op in SSR/Node).
// React Native: call setStorageAdapter(AsyncStorage) at app startup.

let _adapter = null;

function getAdapter() {
  if (_adapter) return _adapter;
  return {
    getItem: (k) => (typeof localStorage !== 'undefined' ? localStorage.getItem(k) : null),
    setItem: (k, v) => (typeof localStorage !== 'undefined' ? localStorage.setItem(k, v) : null),
    removeItem: (k) => (typeof localStorage !== 'undefined' ? localStorage.removeItem(k) : null),
  };
}

export function setStorageAdapter(adapter) {
  _adapter = adapter;
}

export { getAdapter };
