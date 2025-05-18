"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocale } from "@/hooks/useLocale";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, Mail, MapPin, Phone } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const ContactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormData = z.infer<typeof ContactFormSchema>;

export default function ContactUsPage() {
  const { t, locale } = useLocale();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(ContactFormSchema),
  });

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    setIsSubmitting(true);
    // Placeholder for actual submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    toast({
      title: t("messageSentSuccess"),
      description: `${t("nameLabel")}: ${data.name}, ${t("emailLabel")}: ${data.email}`,
    });
    reset();
  };

  return (
    <div className="space-y-12">
      <section className="text-center py-8">
        <h1 className="text-4xl font-bold text-primary mb-4">{t("contactUsTitle")}</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">{t("contactUsIntro")}</p>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{t("sendMessageButton")}</CardTitle>
            <CardDescription>Fill out the form below to get in touch.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="name">{t("nameLabel")}</Label>
                <Input id="name" type="text" {...register("name")} placeholder={t("nameLabel")} className="mt-1" />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="email">{t("emailLabel")}</Label>
                <Input id="email" type="email" {...register("email")} placeholder={t("emailLabel")} className="mt-1" />
                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="message">{t("messageLabel")}</Label>
                <Textarea id="message" {...register("message")} placeholder={t("messageLabel")} rows={5} className="mt-1" />
                {errors.message && <p className="text-sm text-destructive mt-1">{errors.message.message}</p>}
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin rtl:ml-2 rtl:mr-0" />
                ) : (
                  <Send className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                )}
                {t("sendMessageButton")}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-secondary/50">
          <CardHeader>
            <CardTitle>Our Information</CardTitle>
            <CardDescription>Find us or get in touch through other channels.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Mail className="h-5 w-5 text-primary" />
              <a href="mailto:soumia.so770717@gmail.com" className="text-muted-foreground hover:text-primary">
                soumia.so770717@gmail.com
              </a>
            </div>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Phone className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground">+212 612693297</span>
            </div>
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <MapPin className="h-5 w-5 text-primary mt-1" />
              <span className="text-muted-foreground">Sale, Morocco</span>
            </div>
            <div className="pt-4">
              <h3 className="font-semibold mb-2">{t("socialMedia")}</h3>
              {/* Social media links can be added here */}
              <p className="text-sm text-muted-foreground">
                Follow us on our (upcoming) social channels!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
