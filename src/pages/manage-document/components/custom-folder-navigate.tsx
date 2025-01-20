import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { decode, encode } from '../../../utils/functions/HashString';

// Custom hook for managing folder navigation
export const useFolderNavigation = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const getCurrentFolder = useCallback(() => {
    const path = searchParams.get('folder');
    return decode(path ?? '');
  }, [searchParams]);

  const navigateToFolder = useCallback((folderPath: string) => {
    // Ensure the path starts with 'root' if not already present
    const normalizedPath = folderPath.startsWith('root') 
      ? folderPath 
      : `root/${folderPath}`;
    
    // Get the current UID (if exists)
    const currentFolder = getCurrentFolder();
    const splitPathWithUid = currentFolder.split('/root');
    const uid = splitPathWithUid?.[0]?.includes('/') 
      ? null 
      : splitPathWithUid?.[0];

    // Construct the new path with UID if present
    const newPath = uid 
      ? `${uid}${normalizedPath}` 
      : normalizedPath;

    // Update search params
    setSearchParams(`?folder=${encode(newPath)}`);
  }, [setSearchParams, getCurrentFolder]);

  const goBackToParentFolder = useCallback(() => {
    const currentFolder = getCurrentFolder();
    const pathParts = currentFolder.split('/');
    
    // Remove the last folder to go back
    if (pathParts.length > 1) {
      pathParts.pop();
      const parentPath = pathParts.join('/');
      setSearchParams(`?folder=${encode(parentPath)}`);
    } else {
      // If at root, clear search params
      setSearchParams('');
    }
  }, [setSearchParams, getCurrentFolder]);

  return {
    getCurrentFolder,
    navigateToFolder,
    goBackToParentFolder
  };
};