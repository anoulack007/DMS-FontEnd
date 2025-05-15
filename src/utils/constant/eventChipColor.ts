
export const getEventChipColor = (event: string) => {
    switch (event) {
      case 'Update':
        return '#FFB200';
      case 'Upload':
        return '#03994D';
      case 'Delete':
        return '#91040B';
      case 'Create':
        return '#1F509A';
      case 'AddMember':
        return '#9C27B0';
      case 'Restore':
        return '#00897B';
      case 'RemoveMember':
        return '#D32F2F';
      case 'Download':
        return '#2196F3';
        case 'MoveFile':
      return '#6A1B9A';
      default:
        return 'gray';
    }
  };