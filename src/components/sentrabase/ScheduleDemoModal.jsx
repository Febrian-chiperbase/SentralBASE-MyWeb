import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import {
  Calendar,
  Clock,
  User,
  Building2,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  Users,
  MapPin,
} from 'lucide-react';

const ScheduleDemoModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    fullName: '',
    email: '',
    phone: '',
    jobTitle: '',
    
    // Step 2: Company Info
    companyName: '',
    companySize: '',
    location: '',
    currentSystem: '',
    
    // Step 3: Demo Preferences
    preferredDate: '',
    preferredTime: '',
    demoType: '',
    specificNeeds: '',
    
    // Step 4: Additional Info
    additionalNotes: '',
    hearAboutUs: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Available time slots
  const timeSlots = [
    '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'
  ];

  // Company sizes
  const companySizes = [
    '1-5 klinik',
    '6-15 klinik',
    '16-50 klinik',
    '50+ klinik'
  ];

  // Demo types
  const demoTypes = [
    'Demo Umum (30 menit)',
    'Demo Teknis Mendalam (60 menit)',
    'Konsultasi Kebutuhan (45 menit)',
    'Demo Khusus Fitur Tertentu (30 menit)'
  ];

  // How they heard about us
  const hearAboutOptions = [
    'Google Search',
    'Referensi Kolega',
    'Media Sosial',
    'Event/Webinar',
    'Iklan Online',
    'Lainnya'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return formData.fullName && formData.email && formData.phone && formData.jobTitle;
      case 2:
        return formData.companyName && formData.companySize && formData.location;
      case 3:
        return formData.preferredDate && formData.preferredTime && formData.demoType;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    } else {
      toast({
        title: "⚠️ Lengkapi Data",
        description: "Mohon lengkapi semua field yang diperlukan",
        variant: "destructive"
      });
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Here you would typically send data to your backend
    console.log('Demo scheduled with data:', formData);
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    toast({
      title: "🎉 Demo Berhasil Dijadwalkan!",
      description: "Tim kami akan menghubungi Anda dalam 24 jam untuk konfirmasi.",
    });

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSuccess(false);
      setStep(1);
      setFormData({
        fullName: '', email: '', phone: '', jobTitle: '',
        companyName: '', companySize: '', location: '', currentSystem: '',
        preferredDate: '', preferredTime: '', demoType: '', specificNeeds: '',
        additionalNotes: '', hearAboutUs: '',
      });
      onClose();
    }, 3000);
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  const renderStep = () => {
    if (isSuccess) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-green-600 mb-2">Demo Terjadwalkan!</h3>
          <p className="text-gray-700 mb-4">
            Terima kasih {formData.fullName}! Kami akan menghubungi Anda di {formData.email} untuk konfirmasi jadwal demo.
          </p>
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Jadwal yang Dipilih:</strong><br />
              {formData.preferredDate} pukul {formData.preferredTime}<br />
              {formData.demoType}
            </p>
          </div>
        </motion.div>
      );
    }

    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2 mb-4">
              <User className="w-5 h-5 text-cyan-500" />
              <h3 className="text-lg font-semibold text-gray-900">Informasi Personal</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800">Nama Lengkap *</label>
                <Input
                  placeholder="Masukkan nama lengkap"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800">Jabatan *</label>
                <Input
                  placeholder="Direktur, Manajer, dll."
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-800">Email *</label>
              <Input
                type="email"
                placeholder="nama@perusahaan.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-800">Nomor Telepon *</label>
              <Input
                type="tel"
                placeholder="+62 812-3456-7890"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              />
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Building2 className="w-5 h-5 text-cyan-500" />
              <h3 className="text-lg font-semibold text-gray-900">Informasi Perusahaan</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-800">Nama Perusahaan/Klinik *</label>
              <Input
                placeholder="PT. Klinik Sehat Bersama"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800">Jumlah Klinik *</label>
                <Select onValueChange={(value) => handleInputChange('companySize', value)}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                    <SelectValue placeholder="Pilih jumlah klinik" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300">
                    {companySizes.map((size) => (
                      <SelectItem key={size} value={size} className="text-gray-900 hover:bg-gray-100">{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800">Lokasi *</label>
                <Input
                  placeholder="Jakarta, Surabaya, dll."
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-800">Sistem Saat Ini (Opsional)</label>
              <Input
                placeholder="Sistem manajemen yang sedang digunakan"
                value={formData.currentSystem}
                onChange={(e) => handleInputChange('currentSystem', e.target.value)}
                className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              />
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="w-5 h-5 text-cyan-500" />
              <h3 className="text-lg font-semibold text-gray-900">Preferensi Demo</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800">Tanggal Preferensi *</label>
                <Input
                  type="date"
                  min={getMinDate()}
                  max={getMaxDate()}
                  value={formData.preferredDate}
                  onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800">Waktu Preferensi *</label>
                <Select onValueChange={(value) => handleInputChange('preferredTime', value)}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                    <SelectValue placeholder="Pilih waktu" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300">
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time} className="text-gray-900 hover:bg-gray-100">{time} WIB</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-800">Jenis Demo *</label>
              <Select onValueChange={(value) => handleInputChange('demoType', value)}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder="Pilih jenis demo" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300">
                  {demoTypes.map((type) => (
                    <SelectItem key={type} value={type} className="text-gray-900 hover:bg-gray-100">{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-800">Kebutuhan Spesifik (Opsional)</label>
              <Textarea
                placeholder="Fitur atau aspek tertentu yang ingin Anda lihat dalam demo..."
                value={formData.specificNeeds}
                onChange={(e) => handleInputChange('specificNeeds', e.target.value)}
                rows={3}
                className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              />
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2 mb-4">
              <MessageSquare className="w-5 h-5 text-cyan-500" />
              <h3 className="text-lg font-semibold text-gray-900">Informasi Tambahan</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-800">Bagaimana Anda mengetahui Sentrabase?</label>
              <Select onValueChange={(value) => handleInputChange('hearAboutUs', value)}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder="Pilih sumber informasi" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300">
                  {hearAboutOptions.map((option) => (
                    <SelectItem key={option} value={option} className="text-gray-900 hover:bg-gray-100">{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-800">Catatan Tambahan (Opsional)</label>
              <Textarea
                placeholder="Pertanyaan khusus, tantangan yang dihadapi, atau informasi lain yang ingin Anda sampaikan..."
                value={formData.additionalNotes}
                onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                rows={4}
                className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Summary */}
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg mt-6">
              <h4 className="font-semibold mb-2 text-gray-900">Ringkasan Demo:</h4>
              <div className="text-sm space-y-1 text-gray-800">
                <p><strong>Nama:</strong> {formData.fullName}</p>
                <p><strong>Perusahaan:</strong> {formData.companyName}</p>
                <p><strong>Tanggal:</strong> {formData.preferredDate}</p>
                <p><strong>Waktu:</strong> {formData.preferredTime} WIB</p>
                <p><strong>Jenis Demo:</strong> {formData.demoType}</p>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white text-gray-900 border border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Jadwalkan Demo Sentrabase
          </DialogTitle>
          <DialogDescription className="text-gray-700">
            Dapatkan demo personal untuk melihat bagaimana Sentrabase dapat membantu klinik Anda
          </DialogDescription>
        </DialogHeader>

        {!isSuccess && (
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    i <= step
                      ? 'bg-cyan-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {i}
                </div>
                {i < 4 && (
                  <div
                    className={`w-12 h-1 mx-2 ${
                      i < step ? 'bg-cyan-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>

        {!isSuccess && (
          <div className={`flex ${step === 1 ? 'justify-end' : 'justify-between'} pt-6 border-t border-gray-200`}>
            {step > 1 && (
              <Button
                variant="outline"
                onClick={prevStep}
                className="flex items-center space-x-2"
              >
                <span>Kembali</span>
              </Button>
            )}

            {step < 4 ? (
              <Button
                onClick={nextStep}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white hover:text-white flex items-center space-x-2"
              >
                <span>Lanjut</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:text-white flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menjadwalkan...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Jadwalkan Demo</span>
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleDemoModal;
