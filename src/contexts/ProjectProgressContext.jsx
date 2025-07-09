import React, { createContext, useContext, useState, useEffect } from 'react';

const ProjectProgressContext = createContext();

export const ProjectProgressProvider = ({ children }) => {
  const [projectProgress, setProjectProgress] = useState({
    overallProgress: 0,
    currentPhase: 'setup',
    estimatedCompletion: null,
    phases: [
      {
        id: 'payment',
        name: 'Pembayaran',
        description: 'Konfirmasi pembayaran dan pembuatan akun',
        progress: 100,
        status: 'completed',
        startDate: null,
        completedDate: null,
        estimatedDuration: 0, // immediate
        tasks: [
          { id: 1, name: 'Pembayaran dikonfirmasi', completed: true },
          { id: 2, name: 'Akun customer dibuat', completed: true },
          { id: 3, name: 'Invoice digenerate', completed: true }
        ]
      },
      {
        id: 'setup',
        name: 'Setup & Konfigurasi',
        description: 'Persiapan sistem dan konfigurasi awal',
        progress: 0,
        status: 'pending',
        startDate: null,
        completedDate: null,
        estimatedDuration: 3, // 3 days
        tasks: [
          { id: 1, name: 'Analisis kebutuhan klinik', completed: false },
          { id: 2, name: 'Setup server dan database', completed: false },
          { id: 3, name: 'Konfigurasi sistem RME', completed: false },
          { id: 4, name: 'Integrasi dengan sistem existing', completed: false },
          { id: 5, name: 'Testing sistem', completed: false }
        ]
      },
      {
        id: 'customization',
        name: 'Kustomisasi',
        description: 'Penyesuaian sistem sesuai kebutuhan klinik',
        progress: 0,
        status: 'pending',
        startDate: null,
        completedDate: null,
        estimatedDuration: 5, // 5 days
        tasks: [
          { id: 1, name: 'Desain template form medis', completed: false },
          { id: 2, name: 'Setup workflow klinik', completed: false },
          { id: 3, name: 'Konfigurasi user roles', completed: false },
          { id: 4, name: 'Integrasi printer & hardware', completed: false },
          { id: 5, name: 'Setup backup system', completed: false }
        ]
      },
      {
        id: 'migration',
        name: 'Migrasi Data',
        description: 'Transfer data dari sistem lama ke SentraBASE',
        progress: 0,
        status: 'pending',
        startDate: null,
        completedDate: null,
        estimatedDuration: 2, // 2 days
        tasks: [
          { id: 1, name: 'Export data dari sistem lama', completed: false },
          { id: 2, name: 'Cleaning dan validasi data', completed: false },
          { id: 3, name: 'Import data ke SentraBASE', completed: false },
          { id: 4, name: 'Verifikasi data integrity', completed: false }
        ]
      },
      {
        id: 'training',
        name: 'Training & Testing',
        description: 'Pelatihan tim dan testing sistem',
        progress: 0,
        status: 'pending',
        startDate: null,
        completedDate: null,
        estimatedDuration: 3, // 3 days
        tasks: [
          { id: 1, name: 'Training admin sistem', completed: false },
          { id: 2, name: 'Training dokter & perawat', completed: false },
          { id: 3, name: 'Training staff front office', completed: false },
          { id: 4, name: 'User acceptance testing', completed: false },
          { id: 5, name: 'Dokumentasi sistem', completed: false }
        ]
      },
      {
        id: 'golive',
        name: 'Go Live',
        description: 'Sistem mulai digunakan secara penuh',
        progress: 0,
        status: 'pending',
        startDate: null,
        completedDate: null,
        estimatedDuration: 1, // 1 day
        tasks: [
          { id: 1, name: 'Final system check', completed: false },
          { id: 2, name: 'Go live ceremony', completed: false },
          { id: 3, name: 'Monitoring sistem 24/7', completed: false },
          { id: 4, name: 'Support standby', completed: false }
        ]
      }
    ]
  });

  // Calculate overall progress
  const calculateOverallProgress = () => {
    const totalPhases = projectProgress.phases.length;
    const totalProgress = projectProgress.phases.reduce((sum, phase) => sum + phase.progress, 0);
    return Math.round(totalProgress / totalPhases);
  };

  // Calculate estimated completion date
  const calculateEstimatedCompletion = () => {
    const today = new Date();
    const remainingDays = projectProgress.phases
      .filter(phase => phase.status !== 'completed')
      .reduce((sum, phase) => sum + phase.estimatedDuration, 0);
    
    const estimatedDate = new Date(today);
    estimatedDate.setDate(today.getDate() + remainingDays);
    return estimatedDate;
  };

  // Update phase progress
  const updatePhaseProgress = (phaseId, progress, tasks = null) => {
    setProjectProgress(prev => ({
      ...prev,
      phases: prev.phases.map(phase => {
        if (phase.id === phaseId) {
          const updatedPhase = {
            ...phase,
            progress: Math.min(100, Math.max(0, progress)),
            status: progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'pending'
          };

          if (tasks) {
            updatedPhase.tasks = tasks;
          }

          if (progress === 100 && !phase.completedDate) {
            updatedPhase.completedDate = new Date().toISOString();
          }

          if (progress > 0 && !phase.startDate) {
            updatedPhase.startDate = new Date().toISOString();
          }

          return updatedPhase;
        }
        return phase;
      })
    }));
  };

  // Simulate progress updates (in real app, this would come from backend)
  const simulateProgress = () => {
    // Start setup phase after payment
    setTimeout(() => {
      updatePhaseProgress('setup', 20);
    }, 2000);

    setTimeout(() => {
      updatePhaseProgress('setup', 60);
    }, 5000);

    setTimeout(() => {
      updatePhaseProgress('setup', 100);
      updatePhaseProgress('customization', 30);
    }, 8000);
  };

  // Get current active phase
  const getCurrentPhase = () => {
    return projectProgress.phases.find(phase => 
      phase.status === 'in-progress' || 
      (phase.status === 'pending' && phase.progress === 0)
    ) || projectProgress.phases[0];
  };

  // Get next milestone
  const getNextMilestone = () => {
    const currentPhaseIndex = projectProgress.phases.findIndex(phase => 
      phase.status === 'in-progress' || phase.status === 'pending'
    );
    
    if (currentPhaseIndex === -1) return null;
    return projectProgress.phases[currentPhaseIndex];
  };

  useEffect(() => {
    // Update overall progress when phases change
    const overall = calculateOverallProgress();
    const estimated = calculateEstimatedCompletion();
    
    setProjectProgress(prev => ({
      ...prev,
      overallProgress: overall,
      estimatedCompletion: estimated
    }));
  }, [projectProgress.phases]);

  const value = {
    projectProgress,
    updatePhaseProgress,
    simulateProgress,
    getCurrentPhase,
    getNextMilestone,
    calculateOverallProgress,
    calculateEstimatedCompletion
  };

  return (
    <ProjectProgressContext.Provider value={value}>
      {children}
    </ProjectProgressContext.Provider>
  );
};

export const useProjectProgress = () => {
  const context = useContext(ProjectProgressContext);
  if (!context) {
    throw new Error('useProjectProgress must be used within ProjectProgressProvider');
  }
  return context;
};
