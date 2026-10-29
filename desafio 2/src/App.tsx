/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { TopNav } from './components/TopNav';
import { Hero } from './components/Hero';
import { VisualCalculator } from './components/VisualCalculator';
import { CodeViewer } from './components/CodeViewer';
import { InteractiveSimulator } from './components/InteractiveSimulator';
import { ComponentDeepDive } from './components/ComponentDeepDive';
import { HowToRunGuide } from './components/HowToRunGuide';
import { QuizSection } from './components/QuizSection';
import { Footer } from './components/Footer';
import { pythonCodeLevels, CodeLevel } from './data/pythonCodes';

export default function App() {
  const [currentLevel, setCurrentLevel] = useState<CodeLevel>(pythonCodeLevels[0]);

  const handleDownload = () => {
    const codeToDownload = currentLevel?.code || pythonCodeLevels[0].code;
    const filename = currentLevel?.filename || 'calculadora.py';
    const blob = new Blob([codeToDownload], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Bar with download action and clean links */}
      <TopNav onDownload={handleDownload} />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onScrollToCalc={() => scrollToSection('calculadora-interativa')}
          onScrollToCode={() => scrollToSection('codigo')}
          onScrollToSimulator={() => scrollToSection('simulador')}
        />

        {/* Super Interactive Visual Calculator for Beginners */}
        <div id="calculadora-interativa">
          <VisualCalculator />
        </div>

        {/* Code Viewer with 3 learning levels and syntax highlighting */}
        <CodeViewer onSelectLevel={setCurrentLevel} />

        {/* Interactive Simulator: Terminal and RAM Memory Inspector */}
        <InteractiveSimulator />

        {/* Deep Dive into all core components and beginner pitfalls */}
        <ComponentDeepDive />

        {/* Practical step-by-step guide to run locally */}
        <HowToRunGuide />

        {/* Knowledge check quiz */}
        <QuizSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
