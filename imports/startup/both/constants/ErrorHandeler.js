export const showPopUp = (msj = "Serverdə xəta baş verdi", label = "Xəta") => {
  Swal.fire({
    icon: "error",
    title: label,
    text: msj,
  });
};
