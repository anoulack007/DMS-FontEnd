
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
      default:
        return 'gray';
    }
  };