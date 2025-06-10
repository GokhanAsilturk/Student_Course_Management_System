import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';

export interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  severity?: 'warning' | 'error' | 'info';
}

interface ConfirmDialogContextType {
  dialogState: ConfirmDialogState;
  openConfirmDialog: (options: Omit<ConfirmDialogState, 'isOpen'>) => void;
  closeConfirmDialog: () => void;
  handleConfirm: () => void;
  handleCancel: () => void;
  confirmDelete: (itemName: string, onConfirm: () => void | Promise<void>) => void;
  confirmBulkDelete: (count: number, onConfirm: () => void | Promise<void>) => void;
  confirmStatusChange: (itemName: string, newStatus: string, onConfirm: () => void | Promise<void>) => void;
}

const ConfirmDialogContext = createContext<ConfirmDialogContextType | undefined>(undefined);

interface ConfirmDialogProviderProps {
  children: ReactNode;
}

export const ConfirmDialogProvider: React.FC<ConfirmDialogProviderProps> = ({ children }) => {
  const [dialogState, setDialogState] = useState<ConfirmDialogState>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Onayla',
    cancelText: 'İptal',
    severity: 'warning',
  });

  const openConfirmDialog = useCallback((options: Omit<ConfirmDialogState, 'isOpen'>) => {
    console.log('openConfirmDialog çağrıldı:', options);
    setDialogState({
      ...options,
      isOpen: true,
      confirmText: options.confirmText || 'Onayla',
      cancelText: options.cancelText || 'İptal',
      severity: options.severity || 'warning',
    });
  }, []);

  const closeConfirmDialog = useCallback(() => {
    console.log('closeConfirmDialog çağrıldı');
    setDialogState(prev => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  const handleConfirm = useCallback(async () => {
    console.log('handleConfirm çağrıldı');
    if (dialogState.onConfirm) {
      await dialogState.onConfirm();
    }
    closeConfirmDialog();
  }, [dialogState, closeConfirmDialog]);

  const handleCancel = useCallback(() => {
    console.log('handleCancel çağrıldı');
    if (dialogState.onCancel) {
      dialogState.onCancel();
    }
    closeConfirmDialog();
  }, [dialogState, closeConfirmDialog]);

  const confirmDelete = useCallback((
    itemName: string,
    onConfirm: () => void | Promise<void>
  ) => {
    console.log('confirmDelete çağrıldı:', itemName);
    openConfirmDialog({
      title: 'Silme Onayı',
      message: `"${itemName}" öğesini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`,
      confirmText: 'Sil',
      cancelText: 'İptal',
      severity: 'error',
      onConfirm,
    });
  }, [openConfirmDialog]);

  const confirmBulkDelete = useCallback((
    count: number,
    onConfirm: () => void | Promise<void>
  ) => {
    openConfirmDialog({
      title: 'Toplu Silme Onayı',
      message: `Seçilen ${count} öğeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`,
      confirmText: 'Hepsini Sil',
      cancelText: 'İptal',
      severity: 'error',
      onConfirm,
    });
  }, [openConfirmDialog]);

  const confirmStatusChange = useCallback((
    itemName: string,
    newStatus: string,
    onConfirm: () => void | Promise<void>
  ) => {
    openConfirmDialog({
      title: 'Durum Değişikliği Onayı',
      message: `"${itemName}" öğesinin durumunu "${newStatus}" olarak değiştirmek istediğinizden emin misiniz?`,
      confirmText: 'Değiştir',
      cancelText: 'İptal',
      severity: 'warning',
      onConfirm,
    });
  }, [openConfirmDialog]);

  const value = {
    dialogState,
    openConfirmDialog,
    closeConfirmDialog,
    handleConfirm,
    handleCancel,
    confirmDelete,
    confirmBulkDelete,
    confirmStatusChange,
  };

  return (
    <ConfirmDialogContext.Provider value={value}>
      {children}
    </ConfirmDialogContext.Provider>
  );
};

export const useConfirmDialog = (): ConfirmDialogContextType => {
  const context = useContext(ConfirmDialogContext);
  if (context === undefined) {
    throw new Error('useConfirmDialog must be used within a ConfirmDialogProvider');
  }
  return context;
};
