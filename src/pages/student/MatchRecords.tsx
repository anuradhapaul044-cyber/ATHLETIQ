import React, { useMemo, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { addStudentMatchRecord, deleteStudentMatchRecord, getStudentMatchRecords, updateStudentMatchRecord, type MatchRecord } from '../../lib/matchRecords';

const emptyDraft = {
  event: '',
  date: '',
  sport: '',
  competition: '',
  result: '',
  notes: '',
};

export default function MatchRecords() {
  const [records, setRecords] = useState<MatchRecord[]>(() => getStudentMatchRecords());
  const [addOpen, setAddOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [error, setError] = useState('');

  const sortedRecords = useMemo(() => [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [records]);

  const closeModal = () => {
    setAddOpen(false);
    setEditingId(null);
    setDraft(emptyDraft);
    setError('');
  };

  const persistList = () => {
    setRecords(getStudentMatchRecords());
  };

  const handleSave = () => {
    if (!draft.event.trim() || !draft.date || !draft.sport.trim() || !draft.competition.trim() || !draft.result.trim()) {
      setError('Please complete the event, date, sport, discipline, and result fields.');
      return;
    }

    if (editingId) {
      updateStudentMatchRecord(editingId, { ...draft, verified: 'self' });
    } else {
      addStudentMatchRecord({ ...draft, verified: 'self', notes: draft.notes || '' });
    }

    persistList();
    closeModal();
  };

  const handleDelete = (id: string) => {
    deleteStudentMatchRecord(id);
    persistList();
  };

  const startEdit = (record: MatchRecord) => {
    setEditingId(record.id);
    setDraft({
      event: record.event,
      date: record.date,
      sport: record.sport,
      competition: record.competition,
      result: record.result,
      notes: record.notes,
    });
    setAddOpen(true);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]">Match Records</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Your competition history and achievements</p>
        </div>
        <Button onClick={() => setAddOpen(true)} icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>}>
          Add Record
        </Button>
      </div>

      {sortedRecords.length === 0 ? (
        <Card>
          <p className="text-sm text-[var(--color-text-secondary)]">No match records yet. Add your first result to keep your profile current.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {sortedRecords.map((r) => (
            <Card key={r.id} hoverable>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-[var(--color-text)]">{r.event}</h3>
                    <Badge variant={r.verified === 'official' ? 'official' : 'self'} className="text-[10px]">
                      {r.verified === 'official' ? 'Officially Verified' : 'Self-Reported'}
                    </Badge>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mb-2">{r.sport} · {r.competition} · {r.date}</p>
                  {r.notes && <p className="text-xs text-[var(--color-text-secondary)]">{r.notes}</p>}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-black text-[var(--color-brand)]">{r.result}</p>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <button onClick={() => startEdit(r)} className="text-xs text-[var(--color-brand)] hover:underline">Edit</button>
                <button onClick={() => handleDelete(r.id)} className="text-xs text-[var(--color-danger)] hover:underline">Delete</button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={addOpen}
        onClose={closeModal}
        title={editingId ? 'Edit Match Record' : 'Add Match Record'}
        footer={
          <>
            <Button variant="ghost" onClick={closeModal}>Cancel</Button>
            <Button onClick={handleSave}>{editingId ? 'Update Record' : 'Save Record'}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="p-3 bg-[var(--color-warning-light)] rounded-[var(--radius-sm)]">
            <p className="text-xs text-[var(--color-warning)]">Self-reported records are labelled accordingly on your profile. To have records officially verified, contact a verified coach.</p>
          </div>
          {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}
          <Input label="Event / Competition name" placeholder="e.g. State Athletics Championship" value={draft.event} onChange={e => setDraft(d => ({ ...d, event: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Date" type="date" value={draft.date} onChange={e => setDraft(d => ({ ...d, date: e.target.value }))} />
            <Input label="Sport" placeholder="e.g. Athletics" value={draft.sport} onChange={e => setDraft(d => ({ ...d, sport: e.target.value }))} />
          </div>
          <Input label="Event / Discipline" placeholder="e.g. 100m Sprint" value={draft.competition} onChange={e => setDraft(d => ({ ...d, competition: e.target.value }))} />
          <Input label="Result / Achievement" placeholder="e.g. 1st Place, 10.8s" value={draft.result} onChange={e => setDraft(d => ({ ...d, result: e.target.value }))} />
          <Input label="Notes (optional)" placeholder="Optional details" value={draft.notes} onChange={e => setDraft(d => ({ ...d, notes: e.target.value }))} />
        </div>
      </Modal>
    </div>
  );
}
