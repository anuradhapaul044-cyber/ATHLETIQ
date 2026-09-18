import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

type Stage = 'intro' | 'upload' | 'processing' | 'result';

const requirements = [
  'Record in a well-lit space so your full body is visible',
  'Camera should be placed to the side, at roughly hip height',
  'Wear fitted clothing so movement is clearly visible',
  'Perform push-ups at a consistent pace',
  'Complete as many full-range reps as possible',
];

function ProgressDots({ stage }: { stage: Stage }) {
  const stages: Stage[] = ['intro', 'upload', 'processing', 'result'];
  return (
    <div className="flex items-center gap-2 mb-8">
      {stages.map((s, i) => (
        <React.Fragment key={s}>
          <div className={`w-2.5 h-2.5 rounded-full ${
            stages.indexOf(stage) > i ? 'bg-[var(--color-success)]' :
            stage === s ? 'bg-[var(--color-brand)]' : 'bg-[var(--color-border)]'
          }`} />
          {i < stages.length - 1 && <div className={`flex-1 h-px ${stages.indexOf(stage) > i ? 'bg-[var(--color-success)]' : 'bg-[var(--color-border)]'}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function Assessment() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>('intro');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState('');
  const [processingStep, setProcessingStep] = useState(0);
  const [saved, setSaved] = useState(false);

  const handleUpload = async () => {
    setUploading(true);
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(r => setTimeout(r, 60));
      setUploadProgress(i);
    }
    setUploading(false);
    setStage('processing');
    const steps = ['Extracting video frames...', 'Detecting body pose keypoints...', 'Counting valid repetitions...', 'Evaluating form consistency...', 'Generating performance report...'];
    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(i);
      await new Promise(r => setTimeout(r, 900));
    }
    setStage('result');
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) { setFileName(file.name); }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button onClick={() => navigate('/student')} className="flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] mb-6">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
        Back to Dashboard
      </button>

      <ProgressDots stage={stage} />

      {stage === 'intro' && (
        <div>
          <Badge variant="ai" dot className="mb-4">AI-Powered Assessment</Badge>
          <h1 className="text-3xl font-black text-[var(--color-text)] mb-2">Push-up Assessment</h1>
          <p className="text-[var(--color-text-secondary)] mb-8">
            Upload or record a push-up video. Our AI will count your valid repetitions and evaluate your form — no equipment or trainer needed.
          </p>
          <Card className="mb-6">
            <h3 className="text-sm font-bold text-[var(--color-text)] mb-3">Recording requirements</h3>
            <ul className="space-y-2">
              {requirements.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                  <span className="w-5 h-5 rounded-full bg-[var(--color-brand)]/10 text-[var(--color-brand)] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  {r}
                </li>
              ))}
            </ul>
          </Card>
          <Card className="mb-6 border-[var(--color-warning)]/30 bg-[var(--color-warning-light)]">
            <p className="text-xs text-[var(--color-warning)] font-medium">
              <strong>Important:</strong> AI analysis provides automated rep counting and movement evaluation. Results are labelled as AI-generated and have not been independently validated. For official record purposes, coach attestation is required.
            </p>
          </Card>
          <Button size="lg" fullWidth onClick={() => setStage('upload')}>
            Begin Assessment →
          </Button>
        </div>
      )}

      {stage === 'upload' && (
        <div>
          <h1 className="text-3xl font-black text-[var(--color-text)] mb-2">Upload your video</h1>
          <p className="text-[var(--color-text-secondary)] mb-6">Upload a video file (MP4, MOV, AVI) or record directly if your device supports it.</p>

          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            className={`border-2 border-dashed rounded-[var(--radius-lg)] p-10 text-center transition-all mb-4 ${
              dragOver ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/5' : 'border-[var(--color-border-strong)] hover:border-[var(--color-brand)]/50'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-[var(--color-muted)] flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
            </div>
            {fileName ? (
              <div>
                <p className="text-sm font-semibold text-[var(--color-success)] mb-1">✓ {fileName}</p>
                <p className="text-xs text-[var(--color-text-muted)]">Ready to upload</p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-[var(--color-text)] mb-1">Drop video here or click to browse</p>
                <p className="text-xs text-[var(--color-text-muted)]">MP4, MOV, AVI · Max 500MB</p>
              </div>
            )}
            <input type="file" accept="video/*" className="hidden" id="video-input" onChange={handleFileInput} />
          </div>

          <div className="flex gap-3">
            <label htmlFor="video-input">
              <Button variant="outline" type="button" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>} className="cursor-pointer">
                Browse files
              </Button>
            </label>
            <Button
              variant="secondary"
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /></svg>}
              onClick={() => { setFileName('camera_recording.mp4'); }}
            >
              Record video
            </Button>
          </div>

          {uploading && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] mb-1.5">
                <span>Uploading...</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-[var(--color-border)] rounded-full h-1.5">
                <div className="bg-[var(--color-brand)] h-1.5 rounded-full transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <Button variant="ghost" onClick={() => setStage('intro')}>← Back</Button>
            <Button
              fullWidth
              onClick={handleUpload}
              loading={uploading}
              disabled={!fileName}
            >
              {uploading ? 'Uploading...' : 'Upload & Analyse →'}
            </Button>
          </div>
        </div>
      )}

      {stage === 'processing' && (
        <div className="text-center py-8">
          <div className="w-20 h-20 rounded-full bg-[var(--color-brand)]/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[var(--color-brand)] animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <Badge variant="ai" dot className="mb-4">AI Analysis in Progress</Badge>
          <h1 className="text-2xl font-black text-[var(--color-text)] mb-2">Analysing your movement</h1>
          <p className="text-[var(--color-text-secondary)] mb-8 max-w-sm mx-auto">
            Our AI is reviewing your video footage to count valid repetitions and evaluate your form. This takes about 30–60 seconds.
          </p>
          <div className="space-y-2 text-left max-w-xs mx-auto">
            {[
              'Extracting video frames...',
              'Detecting body pose keypoints...',
              'Counting valid repetitions...',
              'Evaluating form consistency...',
              'Generating performance report...',
            ].map((step, i) => (
              <div key={i} className={`flex items-center gap-2 text-sm transition-all ${
                i < processingStep ? 'text-[var(--color-success)]' :
                i === processingStep ? 'text-[var(--color-text)]' :
                'text-[var(--color-text-muted)]'
              }`}>
                {i < processingStep ? (
                  <span className="w-4 h-4 flex-shrink-0">✓</span>
                ) : i === processingStep ? (
                  <span className="w-4 h-4 flex-shrink-0 animate-spin border border-current border-t-transparent rounded-full inline-block" />
                ) : (
                  <span className="w-4 h-4 flex-shrink-0 text-[var(--color-border)]">○</span>
                )}
                {step}
              </div>
            ))}
          </div>
        </div>
      )}

      {stage === 'result' && (
        <div>
          <Badge variant="ai" dot className="mb-4">AI-Generated Result</Badge>
          <h1 className="text-3xl font-black text-[var(--color-text)] mb-1">Assessment Complete</h1>
          <p className="text-[var(--color-text-secondary)] mb-6">Results have been automatically generated from your uploaded video.</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="text-center bg-[var(--color-brand)] border-[var(--color-brand)] text-white">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-1">Valid Repetitions</p>
              <p className="text-5xl font-black" style={{ fontFamily: 'var(--font-mono)' }}>42</p>
              <p className="text-xs text-white/60 mt-1">AI-detected valid push-ups</p>
            </Card>
            <Card className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Form Score</p>
              <p className="text-5xl font-black text-[var(--color-text)]" style={{ fontFamily: 'var(--font-mono)' }}>8.4</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Out of 10</p>
            </Card>
          </div>

          <Card className="mb-4">
            <h3 className="text-sm font-bold text-[var(--color-text)] mb-3">Performance Breakdown</h3>
            <div className="space-y-3">
              {[
                { label: 'Depth consistency', value: 88, grade: 'Good' },
                { label: 'Body alignment', value: 92, grade: 'Excellent' },
                { label: 'Tempo control', value: 74, grade: 'Fair' },
                { label: 'Elbow tracking', value: 80, grade: 'Good' },
              ].map(m => (
                <div key={m.label}>
                  <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)] mb-1">
                    <span>{m.label}</span>
                    <span className="font-medium">{m.grade}</span>
                  </div>
                  <div className="w-full bg-[var(--color-border)] rounded-full h-1.5">
                    <div className="bg-[var(--color-brand)] h-1.5 rounded-full" style={{ width: `${m.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="mb-4 border-[var(--color-ai)]/30 bg-[var(--color-ai-light)]">
            <div className="flex items-start gap-2">
              <span className="text-[var(--color-ai)] text-lg">◎</span>
              <div>
                <p className="text-xs font-bold text-[var(--color-ai)] uppercase tracking-wider mb-1">AI Movement Feedback</p>
                <p className="text-sm text-[var(--color-text-secondary)]">Strong overall form with consistent depth. Tempo slowed slightly in the final 8 reps — consider conditioning your pace. Body alignment was excellent throughout.</p>
              </div>
            </div>
          </Card>

          <Card className="mb-6 border-[var(--color-border)]">
            <p className="text-xs text-[var(--color-text-muted)]">
              <strong>Source notice:</strong> This result was generated automatically by AI video analysis. It has not been reviewed by a human coach. Results are labelled as <strong>AI-Generated</strong> on your profile until coach-attested.
            </p>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStage('intro')}>New Assessment</Button>
            <Button
              fullWidth
              loading={saved}
              onClick={() => { setSaved(true); setTimeout(() => navigate('/student/profile'), 1000); }}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></svg>}
            >
              Save to Profile →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
