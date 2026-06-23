// src/app/(app)/home/page.tsx
"use client";

import { useState, useRef, useEffect, type ChangeEvent, type FormEvent } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/hooks/useLocale';
import { analyzePlantHealth, type AnalyzePlantHealthOutput, type AnalyzePlantHealthInput } from '@/ai/flows/analyze-plant-health';
import { Loader2, UploadCloud, Camera, AlertTriangle, RefreshCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useIsMobile } from '@/hooks/use-mobile';

export default function HomePage() {
  const { t, locale } = useLocale();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [plantDescription, setPlantDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzePlantHealthOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Camera specific state
  const [isCameraDialogOpen, setIsCameraDialogOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null);
  const isMobile = useIsMobile();
  const [currentFacingMode, setCurrentFacingMode] = useState<'user' | 'environment'>('user');

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAnalysisResult(null);
      setError(null);
    }
  };

  const handleOpenCameraDialog = () => {
    setHasCameraPermission(null); 
    setCameraError(null);
    if (isMobile) {
      setCurrentFacingMode('user');
    }
    setIsCameraDialogOpen(true);
  };

  const handleCloseCameraDialog = () => {
    setIsCameraDialogOpen(false);
    // Stream stop is handled by useEffect cleanup for isCameraDialogOpen
  };
  
  useEffect(() => {
    if (isCameraDialogOpen) {
      let activeStream: MediaStream | null = null;
      const enableCamera = async () => {
        setHasCameraPermission(null);
        setCameraError(null);

        try {
          const videoConstraints: MediaTrackConstraints = {};
          if (isMobile) {
            videoConstraints.facingMode = currentFacingMode;
          } else {
            videoConstraints.facingMode = 'user';
          }

          const stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints });
          activeStream = stream;
          setCurrentStream(stream);
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error('Error accessing camera:', err);
          setHasCameraPermission(false);
          let permissionErrorMsg = locale === 'ar' 
            ? 'تم رفض الوصول إلى الكاميرا أو فشل تهيئتها. يرجى تمكين أذونات الكاميرا في إعدادات المتصفح والمحاولة مرة أخرى.' 
            : 'Camera access denied or failed to initialize. Please enable camera permissions in your browser settings and try again.';
          if (err instanceof Error && err.name === "OverconstrainedError") {
            permissionErrorMsg = locale === 'ar' 
            ? `الكاميرا المطلوبة (${currentFacingMode === 'user' ? 'الأمامية' : 'الخلفية'}) غير متوفرة.`
            : `The requested camera (${currentFacingMode === 'user' ? 'front' : 'rear'}) is not available.`;
          }
          setCameraError(permissionErrorMsg);
        }
      };
      enableCamera();

      return () => {
        if (activeStream) {
          activeStream.getTracks().forEach(track => track.stop());
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setCurrentStream(null);
      };
    }
  }, [isCameraDialogOpen, currentFacingMode, isMobile, locale]);


  async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], fileName, { type: blob.type || 'image/jpeg' });
  }

  const handleSwitchCamera = () => {
    if (!isMobile || !hasCameraPermission) return;
    setCurrentFacingMode(prevMode => (prevMode === 'user' ? 'environment' : 'user'));
  };

  const handleCapturePhoto = async () => {
    if (!videoRef.current || !hasCameraPermission || !currentStream) {
      // This case should ideally not be reached if button is disabled correctly
      return;
    }

    setIsLoading(true); 

    try {
      const canvas = document.createElement('canvas');
      if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
        const errMsg = locale === 'ar' ? 'أبعاد الفيديو غير متاحة. حاول مرة أخرى أو أعد فتح الكاميرا.' : 'Video dimensions not available. Please try again or reopen the camera.';
        setCameraError(errMsg); // Display this error within the dialog
        toast({ title: t('errorOccurred'), description: errMsg, variant: 'destructive'});
        return; 
      }
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');

      if (!context) {
        const errMsg = locale === 'ar' ? 'فشل في الحصول على سياق الرسم للصورة.' : 'Failed to get drawing context for image.';
        setCameraError(errMsg); // Display this error within the dialog
        toast({ title: t('errorOccurred'), description: errMsg, variant: 'destructive'});
        return;
      }

      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL('image/jpeg'); // Captured still image as data URL
      
      setPreviewUrl(imageDataUrl); // Show the captured still image on the main page

      try {
        const capturedFile = await dataUrlToFile(imageDataUrl, `capture-${Date.now()}.jpg`);
        setSelectedImage(capturedFile); // This File (still image) will be used for analysis
        setAnalysisResult(null);
        setError(null);
        handleCloseCameraDialog(); // Close dialog on full success
      } catch (fileError) {
        console.error("Error converting data URL to file:", fileError);
        const conversionErrorMsg = locale === 'ar' ? 'فشل في معالجة الصورة الملتقطة.' : 'Failed to process captured image.';
        setError(conversionErrorMsg); // Show error on main page
        toast({ title: t('errorOccurred'), description: conversionErrorMsg, variant: 'destructive'});
        handleCloseCameraDialog(); // Close dialog, error will be visible on main page
      }
    } catch (err: any) {
      // Catch unexpected errors from canvas operations or other issues
      console.error("Unexpected error during photo capture:", err);
      const unexpectedErrorMsg = err.message || (locale === 'ar' ? 'حدث خطأ غير متوقع أثناء التقاط الصورة.' : 'An unexpected error occurred while capturing the photo.');
      setError(unexpectedErrorMsg); // Show error on main page
      toast({ title: t('errorOccurred'), description: unexpectedErrorMsg, variant: 'destructive'});
      handleCloseCameraDialog(); // Close dialog
    } finally {
      setIsLoading(false); // CRITICAL: Ensure isLoading is always reset
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedImage) {
      setError(t('noImageSelected'));
      toast({
        title: t('errorOccurred'),
        description: t('noImageSelected'),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);
    setError(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage); // selectedImage is the captured still photo
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        const input: AnalyzePlantHealthInput = {
          photoDataUri: base64data,
          plantDescription: plantDescription,
          locale: locale,
        };
        const result = await analyzePlantHealth(input);
        setAnalysisResult(result);
      };
      reader.onerror = () => {
        // This error is less likely if dataUrlToFile succeeded, but good to have
        throw new Error(locale === 'ar' ? 'فشل في قراءة ملف الصورة.' : 'Failed to read image file.');
      };
    } catch (err) {
      console.error("Analysis error:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`${t('errorOccurred')}: ${errorMessage}`);
      toast({
        title: t('errorOccurred'),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="text-center py-8">
        <h1 className="text-4xl font-bold text-primary mb-4">{t('homeTitle')}</h1>
        <p className="text-lg text-muted-foreground">{t('homeSubtitle')}</p>
      </section>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{t('analyzeButton')}</CardTitle>
          <CardDescription> {t('homeSubtitle')} </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="plant-image">{t('uploadImage')}</Label>
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <Input id="plant-image" type="file" accept="image/*" onChange={handleImageChange} className="flex-grow" disabled={isLoading}/>
                <Button type="button" variant="outline" onClick={handleOpenCameraDialog} className="shrink-0" disabled={isLoading}>
                  <Camera className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" /> {t('captureImage')}
                </Button>
              </div>
            </div>

            {previewUrl && (
              <div className="mt-4 relative w-full max-w-md mx-auto h-64 rounded-md overflow-hidden border border-muted">
                <Image src={previewUrl} alt={t('plantPreview')} layout="fill" objectFit="cover" data-ai-hint="plant closeup" />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="plant-description">{t('plantDescriptionLabel')}</Label>
              <Textarea
                id="plant-description"
                value={plantDescription}
                onChange={(e) => setPlantDescription(e.target.value)}
                placeholder={t('plantDescriptionPlaceholder')}
                rows={3}
                disabled={isLoading}
              />
            </div>

            <Button type="submit" disabled={isLoading || (!selectedImage && !previewUrl)} className="w-full">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin rtl:ml-2 rtl:mr-0" />
              ) : (
                <UploadCloud className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
              )}
              {isLoading ? t('analyzing') : t('analyzeButton')}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive bg-destructive/10 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <AlertTriangle className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" /> {t('errorOccurred')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive-foreground">{error}</p>
          </CardContent>
        </Card>
      )}
      
      {analysisResult && (
        <Card className="shadow-lg mt-8">
          <CardHeader>
            <CardTitle>{t('diagnosisResultTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{t('healthStatus')}:</h3>
              <p className={analysisResult.healthStatus === 'healthy' ? 'text-green-600' : 'text-red-600'}>
                {analysisResult.healthStatus === 'healthy' ? t('healthy') : t('sick')}
              </p>
            </div>
            {analysisResult.disease && (
              <div>
                <h3 className="font-semibold text-lg">{t('disease')}:</h3>
                <p>{analysisResult.disease}</p>
              </div>
            )}
            {analysisResult.treatmentAdvice && (
              <div>
                <h3 className="font-semibold text-lg">{t('treatmentAdvice')}:</h3>
                <p className="whitespace-pre-wrap">{analysisResult.treatmentAdvice}</p>
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg">{t('confidenceLevel')}:</h3>
              <p>{(analysisResult.confidenceLevel * 100).toFixed(0)}%</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={isCameraDialogOpen} onOpenChange={(open) => { setIsCameraDialogOpen(open); if (!open) handleCloseCameraDialog();}}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t('captureImage')}</DialogTitle>
          </DialogHeader>
          <div className="my-4 space-y-4">
            <div className="relative w-full aspect-video rounded-md bg-muted flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline 
                className="w-full h-full object-cover"
              />
              {isCameraDialogOpen && hasCameraPermission === null && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                  <p className="text-muted-foreground">{locale === 'ar' ? 'جاري طلب إذن الكاميرا...' : 'Requesting camera permission...'}</p>
                </div>
              )}
              {isCameraDialogOpen && hasCameraPermission === false && !cameraError && ( 
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10 p-4 text-center">
                    <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">
                      {locale === 'ar' ? 'الكاميرا غير متاحة أو تم رفض الإذن.' : 'Camera not available or permission denied.'}
                    </p>
                 </div>
              )}
            </div>
            {cameraError && ( 
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{t('errorOccurred')}</AlertTitle>
                <AlertDescription>{cameraError}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter className="gap-2 sm:flex-row sm:justify-between">
            <Button variant="outline" onClick={handleCloseCameraDialog} disabled={isLoading}>
              {locale === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <div className="flex flex-col-reverse sm:flex-row gap-2">
              {isMobile && hasCameraPermission && (
                <Button variant="outline" onClick={handleSwitchCamera} disabled={isLoading || !currentStream}>
                  <RefreshCcw className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                  {t('switchCamera')}
                </Button>
              )}
              <Button onClick={handleCapturePhoto} disabled={!hasCameraPermission || isLoading || !currentStream}>
                {isLoading && videoRef.current /* Distinguish capture loading from analysis loading */ ? <Loader2 className="mr-2 h-4 w-4 animate-spin rtl:ml-2 rtl:mr-0" /> : <Camera className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />}
                {locale === 'ar' ? 'التقاط صورة' : 'Capture Photo'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
