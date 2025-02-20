import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface FolderItem {
  id: string;
  name: string;
  itemType: 'folder' | 'document';
}

export const useFolderNavigation = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const getCurrentFolderId = useCallback(() => {
    return searchParams.get('folderId') || '';
  }, [searchParams]);

  const navigateToFolder = useCallback((item: FolderItem) => {
    if (item.itemType === 'folder') {
      setSearchParams({ folderId: item.id });
    }
  }, [setSearchParams]);

  const goBackToParentFolder = useCallback(() => {
    // Clear the folder ID to go back to root
    setSearchParams({});
  }, [setSearchParams]);

  return {
    getCurrentFolderId,
    navigateToFolder,
    goBackToParentFolder
  };
};