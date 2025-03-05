import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Document } from '../../../models/Document';

export const useFolderNavigation = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const getCurrentFolderId = useCallback(() => {
    return searchParams.get('folderId') || '';
  }, [searchParams]);

  const navigateToFolder = useCallback((item: Document) => {
    if (item.type === 'folder') {
      setSearchParams({ folderId: item?.id });
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