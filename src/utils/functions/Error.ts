import Swal from "sweetalert2";
import { ErrorModel } from "../../models/Error";
export const ErrorResponse = (error: ErrorModel): void => {
  const { response } = error;
  const { message, statusCode } = response.data;

  // Display the error using SweetAlert
  Swal.fire({
    title: `Error ${statusCode}`,
    text: `${message}`,
    icon: "error",
    confirmButtonText: "OK",
  });
};
