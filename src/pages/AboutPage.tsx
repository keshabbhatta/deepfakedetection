import { Brain, Database, Shield, Code2, BookOpen, ExternalLink } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">DeepGuard</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
            A research-grade deepfake detection system built with modern deep learning techniques
            for the master's course in Digital Image Processing.
          </p>
        </div>

        {/* Architecture */}
        <section className="mb-14">
          <SectionTitle icon={<Brain size={20} />} title="Model Architecture" />
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <Card>
              <h3 className="text-white font-bold text-lg mb-3">CNN Backbone — ResNet-50</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                ResNet-50 with residual skip connections is used as the feature extractor.
                Pretrained on ImageNet, fine-tuned on the FaceForensics++ dataset with
                binary cross-entropy loss for authentic vs. manipulated classification.
              </p>
              <div className="mt-4 space-y-2">
                {['50 convolutional layers', 'Residual skip connections', 'Global average pooling', 'Sigmoid output head'].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <h3 className="text-white font-bold text-lg mb-3">Transfer Learning Strategy</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Using a two-phase fine-tuning approach: first training only the classification
                head, then unfreezing deeper layers for domain adaptation to facial manipulation
                detection.
              </p>
              <div className="mt-4 space-y-2">
                {['Phase 1: Feature head only', 'Phase 2: Full fine-tuning', 'Data augmentation pipeline', 'Learning rate scheduling'].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* Dataset */}
        <section className="mb-14">
          <SectionTitle icon={<Database size={20} />} title="FaceForensics++ Dataset" />
          <div className="mt-6 bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              FaceForensics++ is the benchmark dataset for facial manipulation detection research,
              containing 1,000 original video sequences manipulated with four automated face
              manipulation methods.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { method: 'DeepFakes', desc: 'Autoencoder-based identity swap', color: 'red' },
                { method: 'Face2Face', desc: 'Expression transfer retargeting', color: 'amber' },
                { method: 'FaceSwap', desc: 'Graphics-based face replacement', color: 'orange' },
                { method: 'NeuralTextures', desc: 'Neural renderer texture swap', color: 'rose' },
              ].map((m) => (
                <div key={m.method} className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4">
                  <p className="text-white font-semibold text-sm mb-1">{m.method}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detection Pipeline */}
        <section className="mb-14">
          <SectionTitle icon={<Shield size={20} />} title="Detection Pipeline" />
          <div className="mt-6 space-y-3">
            {[
              { n: '01', title: 'Preprocessing', desc: 'Face detection using MTCNN, alignment, and normalization to 224×224 pixels.' },
              { n: '02', title: 'Feature Extraction', desc: 'ResNet-50 extracts 2048-dimensional feature vectors capturing micro-level facial artifacts.' },
              { n: '03', title: 'Binary Classification', desc: 'Fully-connected classification head outputs probability of manipulation.' },
              { n: '04', title: 'Artifact Analysis', desc: 'Grad-CAM visualization highlights manipulated regions and identifies specific artifact types.' },
              { n: '05', title: 'Confidence Calibration', desc: 'Temperature scaling ensures calibrated probability outputs for reliable confidence scores.' },
            ].map((step) => (
              <div key={step.n} className="flex gap-4 bg-gray-900/40 border border-gray-800 rounded-xl p-5">
                <span className="text-3xl font-black text-gray-800 leading-none w-10 flex-shrink-0">{step.n}</span>
                <div>
                  <p className="text-white font-semibold mb-1">{step.title}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-14">
          <SectionTitle icon={<Code2 size={20} />} title="Technology Stack" />
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: 'React + TypeScript', role: 'Frontend framework', layer: 'Frontend' },
              { name: 'Tailwind CSS', role: 'Utility-first styling', layer: 'Frontend' },
              { name: 'Vite', role: 'Build tool & dev server', layer: 'Frontend' },
              { name: 'Supabase', role: 'Database + Edge Functions', layer: 'Backend' },
              { name: 'Deno Runtime', role: 'Edge function execution', layer: 'Backend' },
              { name: 'ResNet-50 CNN', role: 'Deep learning model', layer: 'AI/ML' },
            ].map((t) => (
              <div key={t.name} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 inline-block ${
                  t.layer === 'Frontend' ? 'bg-blue-500/15 text-blue-400' :
                  t.layer === 'Backend' ? 'bg-emerald-500/15 text-emerald-400' :
                  'bg-amber-500/15 text-amber-400'
                }`}>{t.layer}</span>
                <p className="text-white font-semibold text-sm">{t.name}</p>
                <p className="text-gray-500 text-xs mt-0.5">{t.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* References */}
        <section>
          <SectionTitle icon={<BookOpen size={20} />} title="Key References" />
          <div className="mt-6 space-y-3">
            {references.map((ref) => (
              <div key={ref.title} className="bg-gray-900/40 border border-gray-800 rounded-xl px-5 py-4 flex justify-between items-start gap-4">
                <div>
                  <p className="text-white text-sm font-medium">{ref.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{ref.authors} — {ref.venue}</p>
                </div>
                <ExternalLink size={15} className="text-gray-600 flex-shrink-0 mt-0.5" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
      <span className="text-cyan-400">{icon}</span>
      <h2 className="text-xl font-bold text-white">{title}</h2>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
      {children}
    </div>
  );
}

const references = [
  {
    title: 'FaceForensics++: Learning to Detect Manipulated Facial Images',
    authors: 'Rossler et al.',
    venue: 'ICCV 2019',
  },
  {
    title: 'Deep Residual Learning for Image Recognition',
    authors: 'He et al.',
    venue: 'CVPR 2016',
  },
  {
    title: 'DeepFake Detection using Neural Architecture Search',
    authors: 'Nguyen et al.',
    venue: 'CVPR 2022',
  },
  {
    title: 'Detecting Fake Images Using Residual Neural Networks',
    authors: 'Afchar et al.',
    venue: 'WIFS 2018',
  },
];
