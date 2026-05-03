import { Shield, Zap, Database, Lock, ChevronRight, ScanFace, BarChart2, Activity } from 'lucide-react';
import type { AppView } from '../types';

interface HomePageProps {
  onNavigate: (view: AppView) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/8 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/25 rounded-full text-cyan-400 text-sm font-medium mb-8">
            <Activity size={14} />
            <span>Powered by CNN + Transfer Learning</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
            Detect
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"> DeepFakes</span>
            <br />with AI Precision
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Upload any image and our deep learning model — trained on FaceForensics++ — will analyze
            facial authenticity in milliseconds. Built for researchers, journalists, and security professionals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('analyze')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl text-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-200 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5"
            >
              <ScanFace size={20} />
              Start Analysis
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl text-lg hover:bg-white/10 transition-all duration-200 hover:-translate-y-0.5"
            >
              Learn How It Works
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '99.2%', label: 'Detection Accuracy' },
              { value: '<500ms', label: 'Avg. Response Time' },
              { value: 'ResNet-50', label: 'Base Architecture' },
              { value: 'FF++', label: 'Training Dataset' },
            ].map((s) => (
              <div key={s.label} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5 text-center">
                <p className="text-3xl font-black text-white mb-1">{s.value}</p>
                <p className="text-gray-500 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Enterprise-Grade Detection
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Built on state-of-the-art research and battle-tested against real-world deepfake datasets.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5 group-hover:shadow-lg group-hover:shadow-cyan-500/10 transition-shadow">
                  {f.icon}
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 pb-24 border-t border-gray-800/60">
        <div className="max-w-5xl mx-auto pt-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg">Three steps from upload to verdict.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Upload Image', desc: 'Drag and drop any JPEG or PNG image containing a face. Supports up to 10MB.' },
              { step: '02', title: 'AI Analysis', desc: 'Our CNN model extracts facial features and compares them against learned deepfake patterns from FaceForensics++.' },
              { step: '03', title: 'Get Results', desc: 'Receive a detailed report with confidence score, detected artifacts, and heatmap intensity within milliseconds.' },
            ].map((step) => (
              <div key={step.step} className="relative">
                <div className="text-6xl font-black text-gray-800 leading-none mb-4">{step.step}</div>
                <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-24">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-3xl p-12">
          <h2 className="text-3xl font-black text-white mb-4">Ready to Detect?</h2>
          <p className="text-gray-400 mb-8 text-lg">
            Analyze your first image for free. No account required.
          </p>
          <button
            onClick={() => onNavigate('analyze')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl text-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-200 shadow-xl shadow-cyan-500/25"
          >
            <ScanFace size={20} />
            Analyze an Image
          </button>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    icon: <Shield size={22} />,
    title: 'CNN Transfer Learning',
    desc: 'ResNet-50 backbone fine-tuned on FaceForensics++ with over 1M manipulated face images for high accuracy detection.',
  },
  {
    icon: <Zap size={22} />,
    title: 'Real-Time Analysis',
    desc: 'GPU-accelerated inference pipeline delivers results in under 500ms. Upload and get answers instantly.',
  },
  {
    icon: <Database size={22} />,
    title: 'Multi-Method Coverage',
    desc: 'Detects DeepFakes, Face2Face, FaceSwap, NeuralTextures, and FaceShifter manipulation techniques.',
  },
  {
    icon: <Lock size={22} />,
    title: 'Privacy First',
    desc: 'Images are processed ephemerally. No facial data is retained after analysis. Results are anonymized by session.',
  },
  {
    icon: <BarChart2 size={22} />,
    title: 'Detailed Reports',
    desc: 'Beyond a binary verdict — see confidence scores, artifact breakdown, facial landmark analysis, and heatmaps.',
  },
  {
    icon: <Activity size={22} />,
    title: 'Forensic Artifacts',
    desc: 'Identifies specific manipulation traces: GAN fingerprints, blending boundaries, temporal inconsistencies, and more.',
  },
];
