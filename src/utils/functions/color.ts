export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "public":
      return "#36B37E29"; // Light red
    case "private":
      return "#91040B1A"; // Light orange
    default:
      return "transparent";
  }
};

export const getTextColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "public":
      return "#1B806A";
    case "private":
      return "#91040B";
    default:
      return "white";
  }
};
