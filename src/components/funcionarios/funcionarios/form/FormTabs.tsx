import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UseFormReturn } from "react-hook-form";

interface FormTabsProps {
  form: UseFormReturn<any, any, undefined>;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: any;
  onClose: () => void;
  isSubmitting: boolean;
  imagePreview: string | null;
  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
  imageFile: File | null;
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  isUploadingImage: boolean;
  setIsUploadingImage: React.Dispatch<React.SetStateAction<boolean>>;
  funcionario?: any;
  children?: React.ReactNode;
}

const FormTabs: React.FC<FormTabsProps> = ({ 
  form, 
  activeTab, 
  setActiveTab, 
  onSubmit, 
  onClose, 
  isSubmitting,
  imagePreview,
  setImagePreview,
  imageFile,
  setImageFile,
  isUploadingImage,
  setIsUploadingImage,
  funcionario,
  children 
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="dados-basicos">Dados Básicos</TabsTrigger>
        <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};

export const FormTabsContent = TabsContent;

export default FormTabs;