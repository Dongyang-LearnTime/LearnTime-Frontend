import React from 'react';
import { toast as sonnerToast } from 'sonner';
import { CustomToast } from '../components/common/CustomToast';

export const toast = {
  success: (msg: string | React.ReactNode, data?: any) => 
    sonnerToast.custom((t) => <CustomToast t={t} title={msg as string} type="success" />, data),
    
  error: (msg: string | React.ReactNode, data?: any) => 
    sonnerToast.custom((t) => <CustomToast t={t} title={msg as string} type="error" />, data),
    
  warning: (msg: string | React.ReactNode, data?: any) => 
    sonnerToast.custom((t) => <CustomToast t={t} title={msg as string} type="warning" />, data),
    
  info: (msg: string | React.ReactNode, data?: any) => 
    sonnerToast.custom((t) => <CustomToast t={t} title={msg as string} type="info" />, data),
    
  promise: sonnerToast.promise,
  dismiss: sonnerToast.dismiss,
};
