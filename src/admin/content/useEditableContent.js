import { useState, useEffect, useCallback } from 'react';
import { apiFetch, showToast } from './adminContentApi';

export function useEditableContent(apiType, staticData) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);

  const seed = useCallback(async () => {
    try {
      await apiFetch(`/api/admin/content/${apiType}/seed`, {
        method: 'POST',
        body: { items: staticData },
      });
    } catch {
      /* store may already be seeded */
    }
  }, [apiType, staticData]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/api/admin/content/${apiType}`);
      setItems(data.items || []);
    } catch (err) {
      showToast(err.message, 'error');
      setItems(Array.isArray(staticData) ? staticData : []);
    } finally {
      setLoading(false);
    }
  }, [apiType, staticData]);

  useEffect(() => {
    let active = true;
    (async () => {
      await seed();
      if (active) await load();
    })();
    return () => {
      active = false;
    };
  }, [seed, load]);

  const openAdd = (defaults = {}) => setModal({ mode: 'add', item: { ...defaults } });
  const openEdit = (item) => setModal({ mode: 'edit', item: { ...item } });
  const closeModal = () => setModal(null);

  const handleSave = async () => {
    if (!modal?.item) return;
    setSaving(true);
    try {
      await apiFetch(`/api/admin/content/${apiType}`, {
        method: 'POST',
        body: modal.item,
      });
      showToast('Saved!', 'success');
      setModal(null);
      await load();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    const key = item.id || item.slug;
    const label = item.title || item.celebrity || key;
    if (!window.confirm(`Delete "${label}"?`)) return;
    try {
      await apiFetch(`/api/admin/content/${apiType}/${key}`, { method: 'DELETE' });
      showToast('Deleted', 'success');
      setItems((prev) => prev.filter((x) => (x.id || x.slug) !== key));
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const updateModalItem = (item) => setModal((m) => (m ? { ...m, item } : m));

  return {
    items,
    loading,
    modal,
    saving,
    load,
    openAdd,
    openEdit,
    closeModal,
    handleSave,
    handleDelete,
    updateModalItem,
  };
}
